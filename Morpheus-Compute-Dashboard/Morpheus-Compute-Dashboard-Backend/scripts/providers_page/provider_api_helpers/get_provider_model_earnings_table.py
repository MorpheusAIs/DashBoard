import asyncio
from datetime import datetime
from scripts.providers_page.provider_api_helpers.get_provider_daily_avg_ips import get_sessions_by_provider, get_model_name
from eth_abi import decode

async def decode_receipt(receipt):
    data_bytes = bytes.fromhex(receipt[2:])  # Exclude the '0x' prefix

    types = ["bytes32", "uint128", "uint32"]
    try:
        decoded_data = decode(types, data_bytes)
        session_id = f"0x{decoded_data[0].hex()}"
        timestamp = int(decoded_data[1])
        ips = int(decoded_data[2])
        return session_id, timestamp, ips
    except Exception as e:
        print(f"Error during decoding: {e}")
        return None, None, None

async def get_all_provider_table(addr):
    formatted_sessions = await get_sessions_by_provider(addr)
    completed_sessions = []

    for session in formatted_sessions:
        model_id = session['modelAgentId']
        receipt = session['closeoutReceipt']
        opened_at = int(session["openedAt"])
        closed_at = int(session["closedAt"])
        price_per_second = int(session["pricePerSecond"])

        if closed_at != 0:
            model_name = await get_model_name(model_id)
            session_id, timestamp, ips = await decode_receipt(receipt)
            completed_sessions.append({
                "modelName": model_name,
                "model_id": model_id,
                "closeoutReceipt": receipt,
                "openedAt": opened_at,
                "closedAt": closed_at,
                "pricePerSecond": price_per_second,
                "timestamp": timestamp,
                "ips": ips
            })

    # Process completed sessions grouped by model
    model_data = {}

    for session in completed_sessions:
        model_key = (session["modelName"], session["model_id"])
        closed_date = datetime.fromtimestamp(session["closedAt"]).strftime('%d/%m/%Y')

        if model_key not in model_data:
            model_data[model_key] = {}

        if closed_date not in model_data[model_key]:
            model_data[model_key][closed_date] = {
                "totalSessionsCompletedThatDay": 0,
                "totalIPS": 0,
                "totalEarnings": 0
            }

        model_data[model_key][closed_date]["totalSessionsCompletedThatDay"] += 1
        model_data[model_key][closed_date]["totalIPS"] += session["ips"]

        opened_datetime = datetime.fromtimestamp(session["openedAt"])
        closed_datetime = datetime.fromtimestamp(session["closedAt"])
        duration = (closed_datetime - opened_datetime).total_seconds()
        earnings = duration * session["pricePerSecond"]

        model_data[model_key][closed_date]["totalEarnings"] += earnings

    # Convert model_data to the required format
    result = []
    for (model_name, model_id), daily_data in model_data.items():
        for date, data in daily_data.items():
            avg_ips = data["totalIPS"] / data["totalSessionsCompletedThatDay"]
            result.append({
                "modelName": model_name,
                "model_id": model_id,
                "date": date,
                "totalSessionsCompletedThatDay": data["totalSessionsCompletedThatDay"],
                "avgIPSforSessionsClosedThatDay": avg_ips,
                "morEarnedThatDay": data["totalEarnings"]
            })

    return result