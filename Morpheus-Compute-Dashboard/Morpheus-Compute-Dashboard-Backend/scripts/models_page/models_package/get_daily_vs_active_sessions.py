import asyncio
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta
from web3_setup import model_registry_contract, session_contract, web3

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

async def get_sessions_by_model_id(model_id):
    offset = 0
    limit = 100
    loop = asyncio.get_running_loop()
    model_id_bytes32 = web3.to_bytes(hexstr=model_id)  # Convert model_id to bytes32
    with ThreadPoolExecutor() as pool:
        sessions_tuple = await loop.run_in_executor(pool,
                                                    session_contract.functions.getSessionsByModel(
                                                        model_id_bytes32,
                                                        offset,
                                                        limit
                                                    ).call
                                                    )
        return sessions_tuple

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

async def get_daily_and_active_sessions():
    model_name_to_ids = await get_model_name_to_model_id_mapping()
    result_data = {}
    _id = 1
    today = datetime.utcnow()

    for model_name, model_ids in model_name_to_ids.items():
        for model_id in model_ids:
            sessions = await get_sessions_by_model_id(model_id)
            if not sessions:
                continue
            formatted_sessions = [format_session(session) for session in sessions]

            # Step 1: Convert timestamps and count sessions per day
            session_count_per_day = defaultdict(int)
            active_sessions_per_day = defaultdict(int)
            active_days_set = set()

            for session in formatted_sessions:
                opened_at = int(session["openedAt"])
                closed_at = int(session["closedAt"])
                if closed_at == 0:
                    closed_at = int(today.timestamp())  # If session is still active, use current timestamp

                # Track daily sessions
                date_str = datetime.utcfromtimestamp(opened_at).strftime('%d/%m/%Y')
                session_count_per_day[date_str] += 1

                # Track active sessions per day
                start_date = datetime.utcfromtimestamp(opened_at).date()
                end_date = datetime.utcfromtimestamp(closed_at).date()

                for single_date in (start_date + timedelta(n) for n in range((end_date - start_date).days + 1)):
                    active_date_str = single_date.strftime('%d/%m/%Y')
                    active_sessions_per_day[active_date_str] += 1
                    active_days_set.add(active_date_str)

            # Fill in missing dates with count 0 for session counts and active session counts
            min_date = min(session_count_per_day.keys(), default=today.strftime('%d/%m/%Y'))
            min_date = datetime.strptime(min_date, '%d/%m/%Y')
            date_range = (today - min_date).days

            for i in range(date_range + 1):
                current_date = (min_date + timedelta(days=i)).strftime('%d/%m/%Y')
                if current_date not in session_count_per_day:
                    session_count_per_day[current_date] = 0
                if current_date not in active_sessions_per_day:
                    active_sessions_per_day[current_date] = 0

            # Step 2: Add the project_data to the result
            result_data[model_name] = {
                "_id": _id,
                "model_id": model_id,
                "daily_sessions": dict(sorted(session_count_per_day.items())),
                "active_days": sorted(list(active_days_set)),
                "active_sessions_per_day": dict(sorted(active_sessions_per_day.items()))
            }
            _id += 1

    # print(result_data)
    return result_data