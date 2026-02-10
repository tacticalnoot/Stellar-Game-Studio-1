import { StudioShell } from "./StudioShell";
import "./theFarmShell.css";

export function TheFarmGameRoute() {
  return (
    <StudioShell tone="dark">
      <section className="tf-panel tf-panel--status">
        <p className="tf-panel__label">FULLSCREEN CLIENT</p>
        <h3 className="tf-panel__title">Loading chamber</h3>
        <p className="tf-panel__copy">
          PR-3 will drop the actual canvas: pointer lock, rune pedestals, HUD overlays, and proving overlay.
          This placeholder exists only to keep navigation real — not a demo card.
        </p>
        <div className="tf-status-row">
          <span className="tf-pill tf-pill--line">Canvas mount reserved</span>
          <span className="tf-pill tf-pill--amber">Awaiting state machine</span>
          <span className="tf-pill tf-pill--line">Worker lane: pending</span>
        </div>
      </section>
    </StudioShell>
  );
}
