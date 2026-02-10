import { StudioShell } from "./StudioShell";
import "./theFarmShell.css";

export function TheFarmPress() {
  return (
    <StudioShell>
      <section className="tf-panel tf-panel--glass">
        <p className="tf-panel__label">PRESS KIT</p>
        <h3 className="tf-panel__title">Assets coming online</h3>
        <p className="tf-panel__copy">
          Final logo lockups, screenshots, and a one-pager will drop once the fullscreen build lands (PR-3).
          Judges get a curated pack, not a zip dump.
        </p>
        <div className="tf-status-row">
          <span className="tf-pill tf-pill--line">Logo: in production</span>
          <span className="tf-pill tf-pill--line">Screens: waiting on PR-3</span>
          <span className="tf-pill tf-pill--mint">Tone: premium, dramatic</span>
        </div>
      </section>
    </StudioShell>
  );
}
