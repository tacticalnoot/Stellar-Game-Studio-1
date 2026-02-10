import { StudioShell } from "./StudioShell";
import { config } from "../../../config";
import "./theFarmShell.css";

export function TheFarmStatus() {
  return (
    <StudioShell tone="glass">
      <section className="tf-panel tf-panel--status">
        <p className="tf-panel__label">STATUS</p>
        <h3 className="tf-panel__title">Live testnet state</h3>
        <p className="tf-panel__copy">
          Hub: CB4VZAT2U3UC6XFK3N23SKRF2NDCMP3QHJYMCHHFMZO7MRQO6DQ2EMYG
          <br />
          Dungeon: {config.contractIds["the-farm"] || "unset"}
        </p>
        <div className="tf-status-row">
          <span className="tf-pill tf-pill--mint">Ledger heartbeat: OK</span>
          <span className="tf-pill tf-pill--amber">Tx explorer links coming</span>
          <span className="tf-pill tf-pill--line">start_game / end_game events required</span>
        </div>
        <p className="tf-panel__copy">
          Next steps: surface on-chain events, attach tx hashes, and show last attempt per lobby.
        </p>
      </section>
    </StudioShell>
  );
}
