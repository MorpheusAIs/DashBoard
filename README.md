# Dash Boards For Morpheus Contributors and Users

## List of Dashboards:

## Capital
- 1A. Capital Dashboard Deposit, Stake, Claim (existing): https://dashboard.mor.org/#/capital?network=mainnet
- 1B. Capital MOR20 Smart Contract Factory: https://morpheus-dev.206.189.243.3.nip.io/#/mor20-ecosystem?network=testnet

## Code
- 2A. Coding Dashboard Claiming Rewards (new): https://testing-2nm.pages.dev/
- 2B. Coding Register as a Developer: https://mor.software/
- 2C. Coding Dashboard Staking Coding Weights (new) https://morph-ivory.vercel.app/

## Compute
- 3A. Compute Dashboard For Testnet Stats (new): https://nirmaan-morpheous-dashboard.pages.dev
- 3B. Register Compute Provider (for testnet): https://discord.com/channels/1151741790408429580/1167520834139738289

## Builders
- 4A. Builders Dashboard Registering Smart Agents (existing): https://mor.software/
- 4B. Builders Dashboard MOR Rewards & Staking (Development): https://morpheus-dev.206.189.243.3.nip.io/#/community?network=testnet

## End Users
- **Capital:** Buying / Selling MOR: https://app.uniswap.org/explore/pools/arbitrum/0xE5Cf22EE4988d54141B77050967E1052Bd9c7F7A
- **Code Interface:** Hodl MOR for Pro Venice Access: https://venice.ai/home
- **Compute API:** Devs access Inference on Morpheus: https://discord.com/channels/1151741790408429580/1167520834139738289
- **Builders:** Stake MOR Toward a MOR20 / MRC21 Project: https://mor.org/ecosystem

## Different Branches For Dashboards on Github:
- **Capital:** https://github.com/MorpheusAIs/DashBoard/tree/Capital-Dashboard
- **Code:** https://github.com/MorpheusAIs/DashBoard/tree/Code-Dashboard
- **Compute:** https://github.com/MorpheusAIs/DashBoard/tree/Compute-Dashboard
- **Builder:** https://github.com/MorpheusAIs/DashBoard/tree/Builder-Dashboard

## Community Info, Stats, & Charts:
- Board Morpheus Stats & Toosl: https://morlord.com/
- https://morstats.info/
- https://dune.com/netherman/morpheus-ai-dashboard

# Project Setup Instructions For Running A Dashboard
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
