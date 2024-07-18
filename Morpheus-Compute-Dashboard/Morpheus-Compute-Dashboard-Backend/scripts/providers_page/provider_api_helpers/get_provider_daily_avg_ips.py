import asyncio
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime

import pandas as pd
from eth_abi import decode

from web3_setup import session_contract, model_registry_contract


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


async def get_model_name(model_id):
    loop = asyncio.get_running_loop()
    with ThreadPoolExecutor() as pool:
        model_details = await loop.run_in_executor(pool,
                                                   model_registry_contract
                                                   .functions
                                                   .modelMap(model_id)
                                                   .call)

        model_name = model_details[4]
        return model_name


async def get_all_completed_sessions_receipt_object(provider_addr):
    closeout_receipts = []

    formatted_sessions = await get_sessions_by_provider(provider_addr)

    for session in formatted_sessions:
        receipt = session['closeoutReceipt']
        model_id = session['modelAgentId']
        closed_at = int(session["closedAt"])
        if closed_at != 0:
            model_name = await get_model_name(model_id)
            closeout_receipts.append({
                "modelName": model_name,
                "model_id": model_id,
                "closeoutReceipt": receipt
            })

    return closeout_receipts


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
        return None, None, None


async def get_provider_model_daily_ips(provider_addr):
    provider_model_receipt_object = await get_all_completed_sessions_receipt_object(provider_addr)

    for record in provider_model_receipt_object:
        receipt = record['closeoutReceipt']
        session_id, timestamp, ips = await decode_receipt(receipt)
        if session_id:
            record['timestamp'] = timestamp
            record['ips'] = ips

    # Club data by modelName and model_id
    grouped_data = {}
    for record in provider_model_receipt_object:
        key = (record['modelName'], record['model_id'])
        if key not in grouped_data:
            grouped_data[key] = []
        grouped_data[key].append(record)

    result = []

    for (model_name, model_id), records in grouped_data.items():
        data = []
        for record in records:
            date = datetime.fromtimestamp(record['timestamp'] / 1000).strftime('%d/%m/%Y')
            data.append((date, record['ips']))

        # Create a DataFrame
        df = pd.DataFrame(data, columns=['date', 'ips'])
        df['date'] = pd.to_datetime(df['date'], format='%d/%m/%Y')

        # Calculate daily average
        daily_avg = df.groupby('date').mean().reindex(pd.date_range(df['date'].min(), datetime.now(), freq='D'), fill_value=0)
        daily_avg['date'] = daily_avg.index

        avg_ips = [{"date": date.strftime('%d/%m/%Y'), "value": row['ips']} for date, row in daily_avg.iterrows()]

        result.append({
            "modelName": model_name,
            "model_id": model_id,
            "daily_avg_ips": avg_ips
        })

    return result
