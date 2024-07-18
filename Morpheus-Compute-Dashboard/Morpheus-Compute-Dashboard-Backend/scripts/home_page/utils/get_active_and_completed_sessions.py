import asyncio
from concurrent.futures import ThreadPoolExecutor
from web3_setup import provider_registry_contract, session_contract


async def get_providers_list():
    loop = asyncio.get_running_loop()
    with ThreadPoolExecutor() as pool:
        providers_tuple = await loop.run_in_executor(pool,
                                                     provider_registry_contract.functions.providerGetAll().call
                                                     )
        providers_list = providers_tuple[0]
        return providers_list


async def get_sessions_by_provider(provider):
    offset = 0
    limit = 100
    loop = asyncio.get_running_loop()
    with ThreadPoolExecutor() as pool:
        sessions_tuple = await loop.run_in_executor(pool,
                                                    session_contract.functions.getSessionsByProvider(
                                                        provider,
                                                        offset,
                                                        limit
                                                    ).call
                                                    )
        return sessions_tuple


async def get_all_sessions():
    providers_list = await get_providers_list()

    active_sessions_dict = {}
    completed_sessions_dict = {}

    for provider in providers_list:
        sessions = await get_sessions_by_provider(provider)
        if not sessions:
            continue
        formatted_sessions = [{
            "id": '0x' + session[0].hex(),
            "user": session[1],
            "provider": session[2],
            "modelAgentId": '0x' + session[3].hex(),
            "bidID": '0x' + session[4].hex(),
            "stake": str(session[5]),
            "pricePerSecond": str(session[6]),
            "closeoutReceipt": '0x' + session[7].hex() if session[7] else '0x',
            "closeoutType": str(session[8]),
            "providerWithdrawnAmount": str(session[9]),
            "openedAt": str(session[10]),
            "endsAt": str(session[11]),
            "closedAt": str(session[12])
        } for session in sessions]

        for session in formatted_sessions:
            session_id = session["id"]
            opened_at = session["openedAt"]
            if session["closedAt"] == "0":
                active_sessions_dict[session_id] = opened_at
            else:
                completed_sessions_dict[session_id] = opened_at

    return active_sessions_dict, completed_sessions_dict
