import json
import os
from typing import List
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi_utils.tasks import repeat_every
from models import Card, ProviderExistenceResponse
from scripts.home_page.home_api_helpers.get_circulating_supply import get_circulating_supply_json
from scripts.home_page.home_api_helpers.get_model_mapping_table import get_formatted_model_data
from scripts.home_page.home_api_helpers.get_provider_and_model_counts import get_model_count, get_provider_count
from scripts.models_page.model_api_helpers.get_model_data_main import get_model_data
from scripts.models_page.model_api_helpers.get_model_list_with_id import get_model_name_to_model_id_mapping
from scripts.providers_page.provider_api_helpers.helpers import check_provider_exists, get_models_by_provider
from scripts.home_page.home_api_helpers.get_daily_avg_ips import get_daily_average_ips
from scripts.providers_page.provider_api_helpers.get_provider_model_earnings_table import get_all_provider_table
from scripts.providers_page.provider_api_helpers.get_provider_claimable_balance import get_claimable_balance
from scripts.providers_page.provider_api_helpers.get_provider_daily_avg_ips import get_provider_model_daily_ips
from helper_scripts.get_all_addresses import get_providers_list
from web3_setup import web3

# ---------------------INITIALIZATION-------------------------

CACHE_FILE = 'cache.json'

app = FastAPI()

base_dir = os.path.dirname(os.path.abspath(__file__))
config_path = os.path.join(base_dir, "config.json")

with open(config_path, "r") as file:
    config = json.load(file)

frontend_domain = config["FrontendDomain"]

# ---------------------CORS CONFIG-------------------------

origins = [
    frontend_domain, "http://localhost:3000", "http://localhost:3001", "https://nirmaan-morpheous-dashboard.pages.dev"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------GLOBAL CACHING CONFIG-------------------------

# Function to read cache from a file
def read_cache() -> dict:
    if os.path.exists(CACHE_FILE):
        try:
            with open(CACHE_FILE, 'r') as file:
                data = file.read()
                if data.strip():
                    return json.loads(data)
                else:
                    return {}
        except json.JSONDecodeError as e:
            print(f"Error reading cache file: {e}")
            return {}
    return {}


# Function to write cache to a file
def write_cache(cache_data: dict):
    try:
        with open(CACHE_FILE, 'w') as file:
            json.dump(cache_data, file)
    except Exception as e:
        print(f"Error writing to cache file: {e}")


# Periodically update the cache
@app.on_event("startup")
@repeat_every(seconds=600)  # Update cache every 10 minutes
async def update_cache_task() -> None:
    cache_data = read_cache()

    cache_data['publicCards'] = {
        "provider_count": await get_provider_count(),
        "model_count": await get_model_count()
    }
    cache_data['circulatingSupply'] = await get_circulating_supply_json()
    cache_data['dailyAvgIps'] = await get_daily_average_ips()
    cache_data['homepageTable'] = await get_formatted_model_data()

    # Update modelList
    model_list = await get_model_name_to_model_id_mapping()
    cache_data['modelList'] = model_list

    # Update cache for each model using modelID
    for model_name, model_ids in model_list.items():
        for model_id in model_ids:
            cache_key = f"model_{model_id}"
            model_data = await get_model_data(model_id)
            cache_data[cache_key] = model_data

    # Cache for providerTableData
    provider_addresses = await get_providers_list()
    for address in provider_addresses:
        cache_key = f"providerTableData_{address}"
        provider_all_table_data = await get_all_provider_table(address)
        cache_data[cache_key] = provider_all_table_data

        # Update providerTableData for each modelID
        for model_name, model_ids in model_list.items():
            for model_id in model_ids:
                filtered_data = [item for item in provider_all_table_data if item['model_id'] == model_id]
                if filtered_data:
                    cache_data[f"{cache_key}_{model_id}"] = filtered_data

    # Cache for providerModelChart
    for address in provider_addresses:
        cache_key = f"providerModelChart_{address}"
        provider_all_chart_data = await get_provider_model_daily_ips(address)
        cache_data[cache_key] = provider_all_chart_data

        # Update providerModelChart for each modelID
        for model_name, model_ids in model_list.items():
            for model_id in model_ids:
                filtered_data = [item for item in provider_all_chart_data if item['model_id'] == model_id]
                if filtered_data:
                    cache_data[f"{cache_key}_{model_id}"] = filtered_data

    write_cache(cache_data)


# ---------------------ROOT ENDPOINT-------------------------
@app.get("/")
async def read_root():
    return {"Hello": "World"}


# ---------------------HOME PAGE-------------------------
@app.get("/publicCards", response_model=List[Card])
async def public_cards():
    cache_data = read_cache()
    if 'publicCards' in cache_data:
        provider_count = cache_data['publicCards']['provider_count']
        model_count = cache_data['publicCards']['model_count']
    else:
        provider_count = await get_provider_count()
        model_count = await get_model_count()
        cache_data['publicCards'] = {
            "provider_count": provider_count,
            "model_count": model_count
        }
        write_cache(cache_data)

    cards = [
        Card(_id=1, name="Registered Providers",
             icon="",
             amount=str(provider_count),
             label="Become a provider",
             href=f"{frontend_domain}/provider"),

        Card(_id=2,
             name="Available Models",
             icon="",
             amount=str(model_count),
             label="Explore LLMs",
             href=f"{frontend_domain}/model"),

        Card(_id=3,
             name="Next Disbursement",
             icon="",
             amount="",  # Value will be overwritten by our Frontend
             label="How does it work?",
             href="https://mor.org/")
    ]
    return cards


@app.get("/circulatingSupply")
async def circulating_supply():
    cache_data = read_cache()
    if 'circulatingSupply' in cache_data:
        return cache_data['circulatingSupply']

    data = await get_circulating_supply_json()
    cache_data['circulatingSupply'] = data
    write_cache(cache_data)
    return data


@app.get("/dailyAvgIps")
async def daily_ips():
    cache_data = read_cache()
    if 'dailyAvgIps' in cache_data:
        return cache_data['dailyAvgIps']

    data = await get_daily_average_ips()
    cache_data['dailyAvgIps'] = data
    write_cache(cache_data)
    return data


@app.get("/homepageTable")
async def homepage_table():
    cache_data = read_cache()
    if 'homepageTable' in cache_data:
        return {"items": cache_data['homepageTable']}

    formatted_data = await get_formatted_model_data()
    cache_data['homepageTable'] = formatted_data
    write_cache(cache_data)
    return {"items": formatted_data}


# ---------------------MODELS PAGE-------------------------
@app.get("/modelList")
async def model_list():
    cache_data = read_cache()
    if 'modelList' in cache_data:
        return cache_data['modelList']

    data = await get_model_name_to_model_id_mapping()
    cache_data['modelList'] = data
    write_cache(cache_data)
    return data


@app.get("/model")
async def model_page(modelID: str):
    if not modelID:
        raise HTTPException(status_code=400, detail="Model ID parameter is required")

    cache_data = read_cache()
    cache_key = f"model_{modelID}"
    if cache_key in cache_data:
        return cache_data[cache_key]

    data = await get_model_data(modelID)
    cache_data[cache_key] = data
    write_cache(cache_data)
    return data


# ---------------------PROVIDERS PAGE------------------------
@app.get("/providerExists")
async def provider_exists(address: str):
    address = web3.to_checksum_address(address)
    if not address:
        raise HTTPException(status_code=400, detail="Address parameter is required")

    cache_data = read_cache()
    cache_key = f"providerExists_{address}"
    if cache_key in cache_data:
        return cache_data[cache_key]

    provider_exists_value = await check_provider_exists(address)
    response = provider_exists_value
    cache_data[cache_key] = response
    write_cache(cache_data)
    return response


@app.get("/providerClaimableBalance")
async def provider_claimable_balance(address: str):
    address = web3.to_checksum_address(address)
    if not address:
        raise HTTPException(status_code=400, detail="Address parameter is required")

    cache_data = read_cache()
    cache_key = f"providerClaimableBalance_{address}"
    if cache_key in cache_data:
        return cache_data[cache_key]

    provider_balance_sum = await get_claimable_balance(address)
    cache_data[cache_key] = provider_balance_sum
    write_cache(cache_data)
    return provider_balance_sum


@app.get("/hostedModels")
async def hosted_models(address: str):
    address = web3.to_checksum_address(address)
    if not address:
        raise HTTPException(status_code=400, detail="Address parameter is required")

    cache_data = read_cache()
    cache_key = f"hostedModels_{address}"
    if cache_key in cache_data:
        return cache_data[cache_key]

    provider_hosted_models = await get_models_by_provider(address)
    cache_data[cache_key] = provider_hosted_models
    write_cache(cache_data)
    return provider_hosted_models


@app.get("/providerTableData")
async def provider_table_data(address: str, modelID: str = None):
    address = web3.to_checksum_address(address)
    if not address:
        raise HTTPException(status_code=400, detail="Address parameter is required")

    cache_data = read_cache()
    cache_key = f"providerTableData_{address}"
    if cache_key in cache_data:
        provider_all_table_data = cache_data[cache_key]
    else:
        provider_all_table_data = await get_all_provider_table(address)
        cache_data[cache_key] = provider_all_table_data
        write_cache(cache_data)

    if modelID:
        filtered_data = [item for item in provider_all_table_data if item['model_id'] == modelID]
        return filtered_data

    return provider_all_table_data


@app.get("/providerModelChart")
async def provider_model_chart(address: str, modelID: str = None):
    address = web3.to_checksum_address(address)
    if not address:
        raise HTTPException(status_code=400, detail="Address parameter is required")

    cache_data = read_cache()
    cache_key = f"providerModelChart_{address}"
    if cache_key in cache_data:
        provider_all_chart_data = cache_data[cache_key]
    else:
        provider_all_chart_data = await get_provider_model_daily_ips(address)
        cache_data[cache_key] = provider_all_chart_data
        write_cache(cache_data)

    if modelID:
        filtered_data = [item for item in provider_all_chart_data if item['model_id'] == modelID]
        return filtered_data

    return provider_all_chart_data


# if __name__ == "__main__":
#     uvicorn.run(app, host="0.0.0.0", port=8080)
