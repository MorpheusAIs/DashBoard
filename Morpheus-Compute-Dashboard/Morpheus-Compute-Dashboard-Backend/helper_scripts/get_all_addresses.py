import asyncio
from concurrent.futures import ThreadPoolExecutor
from web3_setup import provider_registry_contract


async def get_providers_list():
    loop = asyncio.get_running_loop()
    with ThreadPoolExecutor() as pool:
        providers_tuple = await loop.run_in_executor(pool,
                                                     provider_registry_contract.functions.providerGetAll().call
                                                     )
        providers_list = providers_tuple[0]
        return providers_list
