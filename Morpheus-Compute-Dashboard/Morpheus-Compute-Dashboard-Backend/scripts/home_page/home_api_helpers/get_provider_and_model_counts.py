import asyncio
from concurrent.futures import ThreadPoolExecutor
from web3_setup import provider_registry_contract, model_registry_contract


async def get_provider_count():
    loop = asyncio.get_running_loop()
    with ThreadPoolExecutor() as pool:
        provider_count = await loop.run_in_executor(pool,
                                                    provider_registry_contract.functions.providerGetCount().call
                                                    )
        return provider_count


async def get_model_count():
    loop = asyncio.get_running_loop()
    with ThreadPoolExecutor() as pool:
        model_count = await loop.run_in_executor(pool,
                                                 model_registry_contract.functions.modelGetCount().call
                                                 )
        return model_count