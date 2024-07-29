import asyncio
from concurrent.futures import ThreadPoolExecutor
from web3_setup import session_contract
from eth_abi import decode
from statistics import mean


async def decode_receipt(receipt):
    data_bytes = bytes.fromhex(receipt[2:])  # Exclude the '0x' prefix

    types = ["bytes32", "uint128", "uint32"]
    try:
        decoded_data = decode(types, data_bytes)

        sessionID = decoded_data[0]
        timestamp_raw = decoded_data[1]
        ips_raw = decoded_data[2]

        session_id = f"0x{sessionID.hex()}"
        timestamp = int(timestamp_raw)
        ips = int(ips_raw)

        return session_id, timestamp, ips

    except Exception as e:
        print(f"Error during decoding: {e}")


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


async def get_all_completed_sessions_receipt_list(provider_addr):
    closeout_receipts = []

    formatted_sessions = await get_sessions_by_provider(provider_addr)

    for session in formatted_sessions:
        receipt = session['closeoutReceipt']
        closed_at = int(session["closedAt"])
        if closed_at != 0:
            closeout_receipts.append(receipt)

    return closeout_receipts


async def get_average_ips(provider_addr):
    closeout_receipts = await get_all_completed_sessions_receipt_list(provider_addr)
    ips_list = []

    for receipt in closeout_receipts:
        session_id, timestamp, ips = await decode_receipt(receipt)
        ips_list.append(ips)

    if not ips_list:
        ips_list.append(0)

    avg_ips = mean(ips_list)

    return avg_ips
