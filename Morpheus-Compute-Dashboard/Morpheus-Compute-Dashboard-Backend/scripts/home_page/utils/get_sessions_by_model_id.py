import asyncio
from concurrent.futures import ThreadPoolExecutor
from scripts.home_page.utils.get_active_and_completed_sessions import get_all_sessions
from web3_setup import session_contract


async def get_session(session_id):
    loop = asyncio.get_running_loop()
    with ThreadPoolExecutor() as pool:
        session = await loop.run_in_executor(pool,
                                             session_contract
                                             .functions
                                             .getSession(session_id)
                                             .call
                                             )
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


async def get_active_sessions_by_model_id(model_id):
    model_id_active_sessions = []
    active_sessions, completed_sessions = await get_all_sessions()

    for session_id in active_sessions:
        session_tuple = await get_session(session_id)
        formatted_session = format_session(session_tuple)
        if formatted_session["modelAgentId"] == model_id:
            model_id_active_sessions.append(session_id)
    return model_id_active_sessions