import asyncio
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor
from web3_setup import model_registry_contract, marketplace_contract, session_contract
from scripts.home_page.utils.get_active_and_completed_sessions import get_all_sessions
from scripts.models_page.utils.get_avg_ips_by_provider import get_average_ips

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

async def get_session(session_id):
    loop = asyncio.get_running_loop()
    with ThreadPoolExecutor() as pool:
        session = await loop.run_in_executor(pool, session_contract.functions.getSession(session_id).call)
    return session

def format_session(session_tuple):
    return {
        "id": '0x' + session_tuple[0].hex(),
        "user": session_tuple[1],
        "provider": session_tuple[2],
        "modelAgentId": '0x' + session_tuple[3].hex(),
        "bidID": '0x' + session_tuple[4].hex(),
        "stake": str(session_tuple[5]),
        "pricePerSecond": str(session_tuple[6]),
        "closeoutReceipt": '0x' + session_tuple[7].hex() if session_tuple[7] else '0x',
        "closeoutType": str(session_tuple[8]),
        "providerWithdrawnAmount": str(session_tuple[9]),
        "openedAt": str(session_tuple[10]),
        "endsAt": str(session_tuple[11]),
        "closedAt": str(session_tuple[12])
    }

async def get_completed_sessions_by_provider(provider_address):
    provider_completed_sessions = []
    active_sessions, completed_sessions = await get_all_sessions()

    for session_id in completed_sessions:
        session_tuple = await get_session(session_id)
        formatted_session = format_session(session_tuple)

        if formatted_session["provider"] == provider_address:
            provider_completed_sessions.append(session_id)
    return provider_completed_sessions

async def get_model_completed_sessions_by_provider(provider_address, model_id):
    provider_model_completed_sessions = []
    active_sessions, completed_sessions = await get_all_sessions()

    for session_id in completed_sessions:
        session_tuple = await get_session(session_id)
        formatted_session = format_session(session_tuple)

        if formatted_session["provider"] == provider_address and formatted_session["modelAgentId"] == model_id:
            provider_model_completed_sessions.append(session_id)

    return provider_model_completed_sessions

async def get_all_table_data():
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

    # Fetch completed sessions for each provider and each model ID
    for model_name, id_to_providers in model_bids.items():
        for model_id, providers in id_to_providers.items():
            for provider in providers:
                total_sessions = await get_completed_sessions_by_provider(provider)
                model_sessions = await get_model_completed_sessions_by_provider(provider, model_id)
                providers[provider] = {
                    "prices": providers[provider],
                    "total_sessions": len(total_sessions),
                    "model_sessions": len(model_sessions)
                }

    # Format the project_data for JSON output
    result_data = {}
    _id = 1
    for model_name, id_to_providers in model_bids.items():
        table_data = []
        for model_id, providers in id_to_providers.items():
            for provider, data in providers.items():
                for price in data["prices"]:
                    table_data.append({
                        "_id": _id,
                        "model_id": model_id,
                        "model_name": model_name,
                        "provider_address": provider,
                        "totalSessionsCompleted": data["total_sessions"],
                        "modelSessionsCompleted": data["model_sessions"],
                        "avgIps": await get_average_ips(provider),
                        "pricePerSecond": float(price),
                        "view": ""
                    })
                    _id += 1
        result_data[model_name] = {
            "tableData": table_data
        }

    # print(result_data)
    return result_data