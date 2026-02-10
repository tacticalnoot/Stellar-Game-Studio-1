import { Link, useNavigate } from "react-router-dom";
import { StudioShell } from "./StudioShell";
import { config } from "../../../config";
import "./theFarmShell.css";

export function TheFarmPlay() {
  const navigate = useNavigate();

  return (
    <StudioShell tone="glass">
      <section className="tf-launcher">
        <div className="tf-launcher__left">
          <p className="tf-kicker">SESSION</p>
          <h2 className="tf-title">Launch Sequence</h2>
          <p className="tf-subtitle">
            Spin up a lobby, sync two wallets, drop into the dungeon. Testnet only — on-chain every attempt.
          </p>
          <div className="tf-launcher__actions">
            <button className="tf-button tf-button--primary" onClick={() => navigate("/the-farm/lobby")}>
              CREATE LOBBY
            </button>
            <button className="tf-button tf-button--ghost" onClick={() => navigate("/the-farm/lobby")}>
              JOIN WITH CODE
            </button>
            <Link to="/the-farm/game" className="tf-button tf-button--line">
              ENTER FULLSCREEN
            </Link>
          </div>
          <div className="tf-checks">
            <div className="tf-checks__item tf-checks__item--ok">
              <span>🛰️ Network</span>
              <strong>Testnet</strong>
            </div>
            <div className="tf-checks__item tf-checks__item--warn">
              <span>🔐 Wallet</span>
              <strong>Connect P1 / P2</strong>
            </div>
            <div className="tf-checks__item tf-checks__item--info">
              <span>⚙️ Graphics</span>
              <strong>DPR capped · Shadows off</strong>
            </div>
            <div className="tf-checks__item tf-checks__item--info">
              <span>🔗 Contract</span>
              <strong>{config.contractIds["the-farm"] || "Unset"}</strong>
            </div>
          </div>
        </div>

        <div className="tf-launcher__right">
          <div className="tf-loadout">
            <p className="tf-panel__label">Loadout</p>
            <div className="tf-loadout__row">
              <span>Sigil Secret</span>
              <span className="tf-pill tf-pill--amber">Generate in lobby</span>
            </div>
            <div className="tf-loadout__row">
              <span>Proof Worker</span>
              <span className="tf-pill tf-pill--line">WebWorker (pending)</span>
            </div>
            <div className="tf-loadout__row">
              <span>Latency</span>
              <span className="tf-pill tf-pill--line">~5s ledger close</span>
            </div>
            <div className="tf-loadout__row">
              <span>HUD</span>
              <span className="tf-pill tf-pill--mint">Helmet UI</span>
            </div>
            <p className="tf-panel__copy">
              P1 creates lobby → shares code → P2 joins → both set commitments → hub.start_game() → floor 1 opens.
            </p>
          </div>
        </div>
      </section>
    </StudioShell>
  );
}
