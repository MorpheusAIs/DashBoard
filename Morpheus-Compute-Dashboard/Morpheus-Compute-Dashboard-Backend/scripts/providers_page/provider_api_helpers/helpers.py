import asyncio
import json
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor
from web3_setup import web3, provider_registry_contract, model_registry_contract, marketplace_contract


async def get_model_map_by_id(model_id):
    loop = asyncio.get_running_loop()
    with ThreadPoolExecutor() as pool:
        model_map = await loop.run_in_executor(pool,
                                               model_registry_contract
                                               .functions
                                               .modelMap(model_id)
                                               .call)
    return model_map


async def get_models_by_provider(addr):
    addr = web3.to_checksum_address(addr)
    loop = asyncio.get_running_loop()
    with ThreadPoolExecutor() as pool:
        model_id_tuple = await loop.run_in_executor(pool,
                                                    marketplace_contract
                                                    .functions
                                                    .getActiveBidsByProvider(addr)
                                                    .call)

    model_name_to_counts = defaultdict(lambda: {"modelName": "", "modelID": "", "count": 0})

    if not model_id_tuple:
        model_name_to_counts["N/A"] = {"modelName": "N/A", "modelID": "N/A", "count": 0}
        return json.dumps(list(model_name_to_counts.values()))

    for item in model_id_tuple:
        model_id = item[1].hex()
        formatted_model_id = "0x" + model_id
        model_map = await get_model_map_by_id(formatted_model_id)
        model_name = model_map[4] if len(model_map) > 4 and model_map[4] else "N/A"
        model_name_to_counts[model_name]["modelName"] = model_name
        model_name_to_counts[model_name]["modelID"] = formatted_model_id
        model_name_to_counts[model_name]["count"] += 1

    return json.loads(json.dumps(list(model_name_to_counts.values())))


async def check_provider_exists(addr):
    addr = web3.to_checksum_address(addr)
    loop = asyncio.get_running_loop()
    with ThreadPoolExecutor() as pool:
        provider_exists = await loop.run_in_executor(pool,
                                                     provider_registry_contract
                                                     .functions
                                                     .providrerExists(addr)
                                                     .call)
    return provider_exists

