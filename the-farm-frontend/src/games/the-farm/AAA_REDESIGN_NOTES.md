# THE FARM — TECH INVENTORY & AAA REDESIGN STARTER

Last updated: 2026-02-10  
Scope: `Stellar-Game-Studio-1` fork — frontend lives in `the-farm-frontend/`, contract in `contracts/the-farm/`.

## A) What’s here today
- **Frontend stack**: Vite + React 19 + TypeScript, Tailwind v4 (vanilla classes in CSS), no router.
- **Entry point**: `src/App.tsx` renders a single card + `TheFarmGame` behind `Layout`.
- **Game screen**: `src/games/the-farm/TheFarmGame.tsx` (sample-style UI; not fullscreen; no 3D).
- **Layout/theming**: `src/components/Layout.tsx`, `Layout.css`; fullscreen variant `LayoutStandalone.tsx` + `LayoutStandalone.css`. Global styles in `src/index.css`.
- **Wallet infra**:
  - Dev wallets: `services/devWalletService.ts`, `hooks/useWallet.ts`, `components/WalletSwitcher.tsx`.
  - Real wallets (Stellar Wallets Kit): `hooks/useWalletStandalone.ts`, `components/WalletStandalone.tsx`.
  - State store: `src/store/walletSlice.ts`.
- **Network/config**: `src/config.ts`, `src/utils/constants.ts` (RPC, passphrase, contract IDs via env).  
  Node detected: `v22.21.1`. **Bun not installed** on host (cli call fails).
- **Contracts**: `contracts/the-farm/` (Rust Soroban), main file `contracts/the-farm/src/lib.rs`. Tests in `test.rs`.
- **Bindings**: generated TS client at `bindings/the_farm/src/index.ts` (imported as `./games/the-farm/bindings.ts`).
- **Service layer**: `src/games/the-farm/theFarmService.ts` (auth entry signing, start_game/end_game helpers, etc).
- **No graphics engine yet**: `rg` shows no three.js / r3f / pixi / pointer lock code.
- **Other frontends** in repo (sgs_frontend, template_frontend) are untouched; the active game lives only in `the-farm-frontend/`.

## B) Current pain / gaps
- Single-page “sample” layout; no route structure for studio, launcher, lobby, game, devlog, status, press.
- No fullscreen canvas, no pointer lock or mobile controls; zero in-world look.
- Multiplayer loop is scaffold-only; lobby/progress UX not surfaced.
- Bun missing locally → root “bun run setup” flow can’t run until Bun is installed (affects quickstart scripts).
- No cinematic/hero or studio shell; typography/buttons still template-like.

## C) Target architecture (AAA site + client)
- Add React Router and split experiences:
  - `/the-farm` (studio landing), `/the-farm/play` (launcher), `/the-farm/lobby` (matchmaking), `/the-farm/game` (fullscreen), `/the-farm/devlog`, `/the-farm/status`, `/the-farm/press`.
- Build a lightweight design system (buttons, pills, panels) with Tailwind tokens but custom CSS for premium feel.
- Game client stack:
  - `game/GameCanvas.tsx` (Three.js or custom WebGL), `HUD.tsx`, `Input.ts`, `Audio.ts`, `state/machine.ts`.
  - WebWorker for proving: `workers/zkProver.worker.ts` (later Noir).
  - Presence: chain-poll “floor beacon” plus optional WebRTC fallback.
- Service layer expansion: `theFarmService.ts` to expose create/join/setCommit/attemptDoor/getLobby/watchLobby with strict typing.
- Contract events must be surfaced on `/status` (hub start/end, attempts, floors).

## D) Key edit locations (for fast navigation)
- **Frontend entry**: `the-farm-frontend/src/App.tsx`
- **Routing (to add)**: new router setup in `src/main.tsx` or `src/App.tsx`
- **Styles/theming**: `src/index.css`, `src/components/Layout.css`, `LayoutStandalone.css`
- **Game UI**: `src/games/the-farm/TheFarmGame.tsx` (to be refactored into route components)
- **Contracts root**: `contracts/the-farm/`
- **Deployment scripts**: root hackathon flow uses `bun run setup / create / dev:game` (requires Bun)
- **Bindings output**: `bindings/the_farm/` → consumed via `src/games/the-farm/bindings.ts`

## E) Immediate blockers / enablers
- Install **Bun** locally to run the canonical quickstart scripts.
- Introduce **react-router-dom** and restructure `App.tsx` to mount the new routes.
- Preserve wallet hooks; avoid refactoring auth plumbing while redesigning UI.
- Keep contract IDs/env wiring intact (`VITE_THE_FARM_CONTRACT_ID`, RPC, passphrase).
