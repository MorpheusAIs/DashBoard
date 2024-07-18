import asyncio
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor
from web3_setup import model_registry_contract, marketplace_contract


async def get_model_name_to_model_id_mapping():
    loop = asyncio.get_running_loop()
    with ThreadPoolExecutor() as pool:
        model_ids, model_details = await loop.run_in_executor(pool,
                                                              model_registry_contract
                                                              .functions
                                                              .modelGetAll()
                                                              .call)

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

    # Create a dictionary to map model names to their IDs
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
                provider = bid[0]  # Access provider address by index
                price_per_second = bid[2]  # Access pricePerSecond by index
                provider_data[provider].append(price_per_second)
            model_bids[model_name][model_id] = provider_data

    # Print the results
    for model_name, id_to_providers in model_bids.items():
        print(f"Model Name: {model_name}")
        for model_id, providers in id_to_providers.items():
            print(f"  Model ID: {model_id} -> Providers:")
            for provider, prices in providers.items():
                prices_str = ", ".join(map(str, prices))
                print(f"    Provider: {provider} -> Prices: {prices_str}")


# Run the async function
asyncio.run(fetch_model_bids())
