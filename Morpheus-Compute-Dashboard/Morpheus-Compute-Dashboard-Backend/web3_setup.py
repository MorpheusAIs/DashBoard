import os
from web3 import Web3
import json
from dotenv import load_dotenv

load_dotenv()

alchemy_url = os.getenv("ALCHEMY_URL")
if alchemy_url is None:
    raise ValueError("ALCHEMY_URL is not set in the environment variables.")

web3 = Web3(Web3.HTTPProvider(alchemy_url))

if not web3.is_connected():
    raise ConnectionError("Failed to connect to the Ethereum network via Alchemy.")

base_dir = os.path.dirname(os.path.abspath(__file__))
config_path = os.path.join(base_dir, "config.json")
abi_dir = os.path.join(base_dir, "abi")

# Loading up chain ID and contract addresses for the forked testnet contracts
with open(config_path, "r") as file:
    config = json.load(file)

frontend_domain = config["FrontendDomain"]

# Testnet ABIs from Arbitrum Sepolia Testnet
with open(os.path.join(abi_dir, "erc20_abi.json"), "r") as f:
    erc20_abi = json.load(f)
with open(os.path.join(abi_dir, "diamond_abi.json"), "r") as f:
    diamond_abi = json.load(f)
with open(os.path.join(abi_dir, "provider_registry_abi.json"), "r") as f:
    provider_registry_abi = json.load(f)
with open(os.path.join(abi_dir, "model_registry.json"), "r") as f:
    model_registry_abi = json.load(f)
with open(os.path.join(abi_dir, "marketplace_abi.json"), "r") as f:
    marketplace_abi = json.load(f)
with open(os.path.join(abi_dir, "session_router.json"), "r") as f:
    session_abi = json.load(f)

# Chain ID taken from config.json: Currently set to Arbitrum Sepolia Testnet
chain_id = config['chainID']

diamond_router_address = web3.to_checksum_address(config['DiamondRouter'])
provider_registry_address = web3.to_checksum_address(config['ProviderRegistry'])
model_registry_address = web3.to_checksum_address(config['ModelRegistry'])
marketplace_address = web3.to_checksum_address(config['Marketplace'])
session_contract_address = web3.to_checksum_address(config['SessionRouter'])
mor_contract_address = web3.to_checksum_address(config['MOR_ADDRESS'])

# Contract Definition for Diamond Proxy and its Facets
diamond_contract = web3.eth.contract(address=diamond_router_address, abi=diamond_abi)
provider_registry_contract = web3.eth.contract(address=diamond_router_address, abi=provider_registry_abi)
model_registry_contract = web3.eth.contract(address=diamond_router_address, abi=model_registry_abi)
marketplace_contract = web3.eth.contract(address=diamond_router_address, abi=marketplace_abi)
session_contract = web3.eth.contract(address=diamond_router_address, abi=session_abi)
