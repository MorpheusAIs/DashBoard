import asyncio
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor
from scripts.home_page.utils.get_sessions_by_model_id import get_active_sessions_by_model_id
from web3_setup import model_registry_contract, marketplace_contract, frontend_domain

async def get_model_name_to_model_id_mapping():
    loop = asyncio.get_running_loop()
    with ThreadPoolExecutor() as pool:
        model_ids, model_details = await loop.run_in_executor(pool, model_registry_contract.functions.modelGetAll().call)

    formatted_model_ids = ['0x' + mid.hex() for mid in model_ids]
    formatted_model_details = [{
        "ipfsCID": '0x' + detail[0].hex(),
        "fee": detail[1],
        "stake": detail[2],
        "owner": detail[3],
        "name": detail[4],
        "tags": detail[5],
        "timestamp": detail[6],
        "isDeleted": detail[7]
    } for detail in model_details]

    # Dictionary to map model names to their IDs
    model_name_to_ids = defaultdict(list)

    # Populate the dictionary
    for model_id, model_detail in zip(formatted_model_ids, formatted_model_details):
        model_name_to_ids[model_detail['name']].append(model_id)

    return model_name_to_ids

async def get_active_bids_by_model_agent(model_id):
    loop = asyncio.get_running_loop()
    with ThreadPoolExecutor() as pool:
        bids = await loop.run_in_executor(pool, marketplace_contract.functions.getActiveBidsByModelAgent(model_id).call)
    return bids

async def fetch_model_bids():
    model_name_to_ids = await get_model_name_to_model_id_mapping()

    model_bids = {}
    for model_name, model_ids in model_name_to_ids.items():
        model_bids[model_name] = {}
        for model_id in model_ids:
            bids = await get_active_bids_by_model_agent(model_id)
            provider_data = defaultdict(list)  # Dictionary to store provider and their pricePerSecond values
            for bid in bids:
                provider = bid[0]  # Access provider address from tuple by index
                price_per_second = bid[2]  # Access pricePerSecond from tuple by index
                provider_data[provider].append(price_per_second)
            model_bids[model_name][model_id] = provider_data

    return model_bids

def format_model_data_for_table(model_bids, active_sessions_count):
    table_data = []
    _id = 1

    for model_name, id_to_providers in model_bids.items():
        providers = []
        prices = []

        for model_id, provider_data in id_to_providers.items():
            for provider, price_list in provider_data.items():
                if price_list:
                    providers.append(provider)
                    prices.extend(price_list)

            # Calculate the number of active sessions for this model ID
            active_sessions = active_sessions_count.get(model_id, 0)

            if providers:
                best_ask = min(prices)
                table_data.append({
                    "_id": _id,
                    "model": model_name,
                    "numberOfProviders": len(providers),
                    "bestAsk": f"{best_ask} mMOR/IPS",
                    "activeSessions": active_sessions,
                    "modelID": model_id
                })
                _id += 1

    return table_data


async def get_formatted_model_data():
    model_bids = await fetch_model_bids()

    # Fetch the active sessions count for each model ID
    active_sessions_count = {}
    for model_name, id_to_providers in model_bids.items():
        for model_id in id_to_providers.keys():
            active_sessions = await get_active_sessions_by_model_id(model_id)
            active_sessions_count[model_id] = len(active_sessions)

    formatted_data = format_model_data_for_table(model_bids, active_sessions_count)
    return formatted_data