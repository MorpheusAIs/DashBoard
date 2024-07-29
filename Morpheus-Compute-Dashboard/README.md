# Morpheus AI Compute Dashboard

## Project Details
- This Project contains Full Frontend, UI and Backend for the Morpheus Lumerin Node Dashboard
-  We've incorporated new details from the last issue and successfully developed a fully functional dashboard that integrates information from the Lumerin Node Contracts.
-  To achieve this, we forked, deployed, and verified the official Lumerin contracts, creating a 1:1 replica.
-  This forked version was populated with on-chain data to register providers, models, bids, and open/close sessions.
-  We revamped the UI and frontend to align with the official Morpheus design and developed a new backend to fetch on-chain data for models, providers, bids, and sessions and made the UI mobile-friendly.
-  To optimize performance, we implemented a state-of-the-art caching mechanism that updates every few minutes, ensuring a smooth user experience.
-  Key features added include: A graph tracking average daily IPS across all sessions, A marketplace table comparing models, best bids, number of providers, and active sessions, A comprehensive models page listing all available models and a graph comparing the number of sessions opened daily versus active sessions, Provider comparison tables showing total sessions completed, sessions for specific models, average IPS, and bid price per second.

### Other Details:
- Each of the subfolders for the backend and frontend contain README files on how to run the project, Please follow the guides to the set the project up.
