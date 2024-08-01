# Morpheus Compute Dashboard Backend by Nirmaan.ai

- Here are the details for the Lumerin compute node contracts that we have forked, deployed and verified:
- When the official Lumerin contracts go live, the only adjustment needed to adapt the dashboard to the live version 
will be updating the contract addresses and chain ID to the official ones in the `config.json` file.

| Type           | Name              | Address                                    |
|----------------|-------------------|--------------------------------------------|
| diamond-router | Diamond           | 0x437E71B8fc341bafB2687Ad6935476231c49928F |
| token contract | MOR_ADDRESS       | 0xc1664f994Fd3991f98aE944bC16B9aED673eF5fD |
| diamond-init   | DiamondInit       | 0x3f3212f193dd7980ed57878fa5a3fbae0797dce4 |
| facet          | DiamondCutFacet   | 0x33133B9AcEdBE3b014275Fb24553724218e81a70 |
| facet          | DiamondLoupeFacet | 0x547dB0445a19dCB59Fd469aADba1Fd9129D418Bf |
| facet          | OwnershipFacet    | 0x86C0CA6e5724913d5776447ceea505BC692D1e64 |
| facet          | ModelRegistry     | 0x72B9D44110B2a15fC35512a617C2A0f28284e05A |
| facet          | ProviderRegistry  | 0x1342b73B76b5ecc400118185B6546C2a6A978C5A |
| facet          | Marketplace       | 0x577Eb8829c1e225Ef220D32BC9045c050265C4D3 |
| facet          | SessionRouter     | 0x906f8bf61A4710Ef51e31435FA8eECdd0b532bc0 |

## How to run:
1)  Install the required dependencies:
- `pip install -r "requirements.txt"`

2)  Create a `.env` file:
- Copy the contents of the `.env.example` file into the `.env` file and fill in your Alchemy Arbitrum Sepolia Key instead of the placeholder `ENTER-YOUR-ALCHEMY-KEY`

3) Run `main.py` using Uvicorn:
- To test the backend and make it live, run: `uvicorn main:app --reload --port 8080
`
### Editing `config.json`:
- In order to test your own deployed contracts or frontend with this backend, you can edit the `config.json` file by changing 
the contract addresses with your own, changing the chain ID, MOR token address or even the frontend domain.