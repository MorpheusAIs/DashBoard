# Morpheus Claim Page - Check Rewards, Claim Rewards, or Get Reward Balance

This project was designed to ensure an efficient, simple and aesthetic claim process for MOR rewards for Code and Capital Contributors.

## How to run:

In the project directory, you can run:

### 1. Install Necessary Dependencies:
`npm install`

### 2. `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.


### 3. `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### 4. `info.json` Explained:
```
{
    "contract_address": "0x47176B2Af9885dC6C4575d4eFd63895f7Aaa4790", // Distribution.sol Contract
    "token_address": "0x092baadb7def4c3981454dd9c0a0d7ff07bcfc86",    // MOR Arbitrum Token Address
    "ether_fee": "0.001"                                              // Fixed Ether mint fee suggested my Morpheus AI
}
```

- Resources: [MOR Rewards Claiming Guide](https://github.com/MorpheusAIs/Docs/blob/main/!KEYDOCS%20README%20FIRST!/FAQs%20%26%20Guides/Guides/MOR/Mainnet/MOR%20Rewards%20Smart%20Contract%20Claim%20Guide.md#how-to-claim-rewards)