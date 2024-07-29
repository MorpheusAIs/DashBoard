import asyncio
import json
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor
from web3_setup import model_registry_contract


async def get_model_name_to_model_id_mapping():
    loop = asyncio.get_running_loop()
    with ThreadPoolExecutor() as pool:
        model_ids, model_details = await loop.run_in_executor(pool,
                                                              model_registry_contract.functions.modelGetAll().call)

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