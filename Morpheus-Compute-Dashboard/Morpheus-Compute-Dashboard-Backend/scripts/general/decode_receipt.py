import asyncio
from eth_abi import decode

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