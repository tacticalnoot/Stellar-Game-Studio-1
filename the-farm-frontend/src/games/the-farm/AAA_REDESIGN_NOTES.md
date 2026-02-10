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

---

## PR-1 — Routing + Studio shell + landing baseline
- Goals:
  - Add real routing with dedicated pages for home/play/lobby/devlog/status/press/game.
  - Replace single “sample card” view with a cinematic studio shell + hero + CTA.
  - Establish a launcher screen that feels like a client, not a form.
- Changes:
  - Added `react-router-dom` dependency (note: install still needed locally).
  - New StudioShell nav + background (`routes/StudioShell.tsx`, `theFarmShell.css`) and route pages (`TheFarmLanding`, `TheFarmPlay`, `TheFarmLobby`, `TheFarmDevlog`, `TheFarmStatus`, `TheFarmPress`, `TheFarmGameRoute`).
  - `App.tsx` now mounts router + routes and defaults to `/the-farm`.
- Runbook:
  - From `the-farm-frontend/`: `npm install` (or `bun install`) to pull `react-router-dom`.
  - `npm run dev` (or `bun run dev` if Bun installed).
  - Visit `/the-farm` → CTA to `/the-farm/play`, `/the-farm/lobby`, `/the-farm/game`.
- Known issues:
  - Bun CLI not installed on host; install required for canonical `bun run` flow.
  - Game canvas not yet implemented (reserved in `/the-farm/game`).
  - Launcher/lobby actions are UI-only placeholders until PR-2 wiring.
- Judge impression score (1–10): 6.3 — visual tone upgraded, still needs motion + real data.
- Next PR:
  - PR-2: Lobby UI + chain polling scaffold. Hook create/join placeholders to service layer and show live lobby/floor state.

## PR-2 — Lobby scaffold + motion polish
- Goals:
  - Give lobby/launcher tangible interactions (create/join code, live-ish heartbeat) so it doesn’t feel dead.
  - Surface contract IDs/status on play/status pages.
  - Add baseline motion to hero/nav/panels for AAA feel.
- Changes:
  - Play page now shows contract ID from config and extra preflight check.
  - Lobby page now has create/join inputs, shows lobby ID/status/floors, and a lightweight heartbeat to avoid dead UI.
  - Status page pulls dungeon contract from config; hero/nav/panels get motion keyframes.
- Runbook:
  - `npm install` (or `bun install` after Bun is installed) to bring in react-router-dom (already in package.json).
  - `npm run dev` → navigate to `/the-farm`, `/the-farm/play`, `/the-farm/lobby`.
- Known issues:
  - Lobby actions are client-side only (no RPC yet); chain polling still pending.
  - Bun not installed on host; need Bun for canonical `bun run` scripts.
- Judge impression score (1–10): 6.8 — more alive, still needs real data + fullscreen canvas.
- Next PR:
- PR-3: Fullscreen game canvas + HUD shell, start mounting Three.js/controls, and prep worker lane stub.

## PR-4 — Lobby→Game state + attempt scaffold
- Goals:
  - Carry lobby identity/role into the game route and show it in HUD.
  - Provide a visible attempt action (simulated for now) so the game route is interactive, not just a shell.
  - Add a shared lobby context to prep for real service wiring.
- Changes:
  - Added LobbyContext provider to share lobbyId/role/floors/txHash.
  - Play route quick-creates a lobby and jumps to lobby; lobby create/join now populates context and shows live-ish state.
  - Game route HUD shows lobby/role/floors and includes a simulated “submit attempt” with result banner and pointer-lock CTA.
  - Fullscreen canvas remains ready for Three.js; overlay copy explicitly calls out simulation until contract wiring lands.
- Runbook:
  - `npm install` (Bun still needed for canonical scripts).
  - `npm run dev` → `/the-farm/play` → create lobby → lobby shows IDs → go `/the-farm/game` and click canvas to lock pointer; hit “SUBMIT ATTEMPT (SIM)” to see HUD feedback.
- Known issues:
  - Contract bindings in repo target an older template; real contract wiring pending (will require regenerating bindings for `contracts/the-farm`).
  - Bun not installed locally; blocks `bun run setup` flow.
  - Attempt action is simulated; no on-chain tx yet.
- Judge impression score (1–10): 7.1 — interactive shell, but still needs real RPC/attempts and 3D scene.
- Next PR:
  - PR-5: Regenerate bindings for `contracts/the-farm`, wire real create/join/attempt via theFarmService, and surface tx hashes/events in HUD + status.

## PR-5 — Bindings regenerated + live lobby polling hook
- Goals:
  - Replace stale bindings with real contract schema from `contracts/the-farm`.
  - Begin live data by reading lobbies from chain (polling get_lobby).
- Changes:
  - Ran `bun run bindings the-farm` against contract ID `CA34IFEOQ...` (testnet) — new bindings in `bindings/the_farm/`.
  - Added `theFarmApi.ts` using regenerated client; Lobby now polls real get_lobby when a lobbyId exists.
  - Play/Lobby keep context; HUD unchanged; Bun installed globally (bun v1.3.9).
- Runbook:
  - From repo root: `bun run bindings the-farm` (already done once).
  - From frontend: `bun install` or `npm install`; `bun run dev`.
  - Create lobby (UI), then lobby polling will attempt `get_lobby` on-chain.
- Known issues:
  - Create/join/attempt still not sending tx (next PR to wire signing + submit).
  - Polling assumes lobbyId numeric after stripping leading “L”.
- Judge impression score (1–10): 7.3 — real RPC read-path exists; tx path still pending.

## PR-6b — Tx wiring (create/join/attempt) + explorer links
- Goals:
  - Move from sim to real tx calls for lobby + attempt.
  - Surface tx hashes with explorer links in lobby/game/status.
- Changes:
  - `theFarmApi` now exposes create_lobby, join_lobby, attempt_door with signer.
  - Lobby buttons call real txs; show hash + errors; keep polling get_lobby.
  - Game HUD submits attempt_door (placeholder proof) and shows hash with explorer link; nonce tracked in context.
  - Status page now shows last tx link if present.
- Runbook:
  - `bun install` then `bun run dev`.
  - Flow: create lobby → lobby shows hash + poll; go to game, pointer-lock, submit attempt_door → hash links to explorer.
- Known issues:
  - Proof bytes still placeholder; contract may reject without commit/proof; need real ZK + commit flow.
  - start_game/end_game events still not surfaced; status feed minimal.
- Judge impression score (1–10): 7.6 — tx path live, hashes visible; still needs real proofs and 3D scene.
- Next PR:
  - Integrate real commit/proof flow + 3D scene + hub events.
