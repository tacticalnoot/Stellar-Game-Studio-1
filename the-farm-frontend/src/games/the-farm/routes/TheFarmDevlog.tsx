import { StudioShell } from "./StudioShell";
import "./theFarmShell.css";

export function TheFarmDevlog() {
  return (
    <StudioShell tone="glass">
      <section className="tf-panel tf-panel--glass tf-devlog">
        <p className="tf-panel__label">DEVLOG</p>
        <h3 className="tf-panel__title">Patch channel open</h3>
        <p className="tf-panel__copy">
          We ship in small, verifiable slices. Watch the state machine form: router → lobby → fullscreen → ZK worker → Noir proofs.
        </p>
        <ul className="tf-list">
          <li>PR-1: Routing + studio shell + landing/launcher (you’re here)</li>
          <li>PR-2: Lobby UI + chain polling scaffold</li>
          <li>PR-3: Fullscreen game canvas + HUD</li>
          <li>PR-4: On-chain attempts + traps</li>
          <li>PR-7: Noir proof live on worker</li>
        </ul>
      </section>
    </StudioShell>
  );
}
