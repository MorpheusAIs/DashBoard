import asyncio
import logging
from concurrent.futures import ThreadPoolExecutor
from web3_setup import session_contract, web3


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


async def get_sessions_by_provider(addr):
    offset = 0
    limit = 100
    loop = asyncio.get_running_loop()
    with ThreadPoolExecutor() as pool:
        sessions = await loop.run_in_executor(pool,
                                              session_contract
                                              .functions
                                              .getSessionsByProvider(addr,
                                                                     offset,
                                                                     limit)
                                              .call)

        formatted_sessions = [format_session(session) for session in sessions]

    return formatted_sessions


async def get_all_completed_sessions_list(provider_addr):
    completed_sessions = []

    formatted_sessions = await get_sessions_by_provider(provider_addr)

    for session in formatted_sessions:
        session_id = session['id']
        closed_at = int(session["closedAt"])
        if closed_at != 0:
            completed_sessions.append(session_id)

    return completed_sessions


async def get_claimable_balance(provider_addr):
    completed_sessions = await get_all_completed_sessions_list(provider_addr)
    provider_balances = []

    for session_id in completed_sessions:
        loop = asyncio.get_running_loop()
        with ThreadPoolExecutor() as pool:
            try:
                raw_balance = await loop.run_in_executor(pool,
                                                         session_contract
                                                         .functions
                                                         .getProviderClaimableBalance(session_id)
                                                         .call)
                if raw_balance is None:
                    logging.warning(f"Received None balance for session ID {session_id}")
                    provider_balances.append(0)  # Treat None as 0
                else:
                    provider_balances.append(float(raw_balance))

            except Exception as e:
                logging.error(f"Error for session ID {session_id}: {str(e)}")
                provider_balances.append(0)  # Set balance to 0 on error
                continue

    balance_sum = sum(provider_balances)

    logging.info(f"Total claimable balance: {balance_sum}")
    return balance_sum

