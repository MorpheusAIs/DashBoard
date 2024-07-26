# Dash Boards For Morpheus Contributors and Users

## List of Dashboards:

## Capital
1A. Capital Dashboard Deposit, Stake, Claim (existing): https://dashboard.mor.org/#/capital?network=mainnet
1B. Capital Buying / Selling MOR Uniswap Pool For MOR / ETH: https://app.uniswap.org/explore/pools/arbitrum/0xE5Cf22EE4988d54141B77050967E1052Bd9c7F7A
1C. Capital MOR20 Smart Contract Factory: https://morpheus-dev.206.189.243.3.nip.io/#/mor20-ecosystem?network=testnet

## Code
2A. Coding Dashboard Claiming Rewards (new): https://testing-2nm.pages.dev/
2B. Coding Register as a Developer: https://mor.software/
2C. Coding Dashboard Staking Coding Weights (new) https://morph-ivory.vercel.app/

## Compute
3A. Compute Dashboard For Testnet Stats (new): https://nirmaan-morpheous-dashboard.pages.dev
3B. Register for as a Compute Provider (on Discord for testnet): https://discord.com/channels/1151741790408429580/1167520834139738289

## Builders
4A. Builders Dashboard Registering Smart Agents (existing): https://mor.software/
4B. Builders Dashboard Checking Rewards, Staking MOR (In Development): https://morpheus-dev.206.189.243.3.nip.io/#/community?network=testnet

## Different Branches Dashboards on Github:
- Builder: https://github.com/MorpheusAIs/DashBoard/tree/Builder-Dashboard
- Capital: https://github.com/MorpheusAIs/DashBoard/tree/Capital-Dashboard
- Code: https://github.com/MorpheusAIs/DashBoard/tree/Code-Dashboard
- Compute: https://github.com/MorpheusAIs/DashBoard/tree/Compute-Dashboard

## Community Info, Stats, & Charts:
https://dune.com/netherman/morpheus-ai-dashboard
https://morlord.com/
https://morstats.info/
Dash Boards For Contributors to the Morpheus Network

## Project Setup For Running A Dashboard
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn start
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Lints release/release candidate version
```
yarn rsc %release-version%
```

### Build docker image with version
```dockerfile
 docker build --no-cache --progress=plain --build-arg BUILD_VERSION=1.0.0-rc.0 -t vue-template .
```

### Dealing with env variables
Env variables can be rewritten by [env.is] (./static/env.js) file in runtime. To do so, we need to provide same [env variables](.env.example) there in json format

## Some additional features

### JsonApi lib

[@distributedlab/jac](https://distributed-lab.github.io/web-kit/modules/_distributedlab_jac.html)

### Web3 provider wrapper lib

[@distributedlab/w3p](https://distributed-lab.github.io/web-kit/modules/_distributedlab_w3p.html)

### Utils, tools, helpers, ...etc

[@distributedlab/tools](https://distributed-lab.github.io/web-kit/modules/_distributedlab_tools.html)

## License

This project is licensed under the MIT License - see the [LICENSE.md](./LICENSE) file for details
