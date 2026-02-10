import { StudioShell } from "./StudioShell";
import "./theFarmShell.css";

export function TheFarmLobby() {
  return (
    <StudioShell>
      <section className="tf-lobby">
        <div className="tf-panel tf-panel--glass tf-lobby__card">
          <p className="tf-panel__label">Lobby Console</p>
          <h3 className="tf-panel__title">Create or join</h3>
          <p className="tf-panel__copy">
            P1 spins a lobby; P2 enters code. Commitments lock before the run. Hub call: start_game() when both are ready.
          </p>
          <div className="tf-lobby__actions">
            <button className="tf-button tf-button--primary">Create lobby</button>
            <button className="tf-button tf-button--ghost">Join with code</button>
          </div>
          <div className="tf-lobby__meta">
            <span className="tf-pill tf-pill--line">Floors: 10</span>
            <span className="tf-pill tf-pill--line">Gate floors: 1 & 5</span>
            <span className="tf-pill tf-pill--line">Attempts: on-chain</span>
          </div>
        </div>

        <div className="tf-panel tf-panel--status tf-lobby__card">
          <p className="tf-panel__label">Presence</p>
          <h3 className="tf-panel__title">Ghost beacons</h3>
          <p className="tf-panel__copy">
            We mirror chain progress for opponent visibility. P2 not here? We still render a flicker phantom to keep tension high.
          </p>
          <div className="tf-status-row">
            <span className="tf-pill tf-pill--amber">P1: waiting</span>
            <span className="tf-pill tf-pill--line">P2: invite pending</span>
          </div>
        </div>
      </section>
    </StudioShell>
  );
}
