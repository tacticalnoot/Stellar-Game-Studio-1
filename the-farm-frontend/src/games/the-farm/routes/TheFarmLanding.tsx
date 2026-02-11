import { Link } from "react-router-dom";
import { StudioShell } from "./StudioShell";
import { FLOOR_DESIGNS } from "../lore/floors";
import "./theFarmShell.css";

export function TheFarmLanding() {
  return (
    <StudioShell>
      <section className="tf-hero">
        <div className="tf-hero__text">
          <p className="tf-kicker">新章 · オンライン · TESTNET</p>
          <h2 className="tf-title">THE FARM: STELLAR DUNGEON</h2>
          <p className="tf-subtitle">
            Two-player descent. Every rune choice is sealed on-chain; only the honest signal opens the door.
          </p>
          <div className="tf-cta-row">
            <Link to="/play" className="tf-button tf-button--primary">
              ▶ PLAY NOW
            </Link>
            <Link to="/game" className="tf-button tf-button--ghost">
              🎞️ WATCH REVEAL
            </Link>
            <Link to="/tech" className="tf-button tf-button--line">
              🧪 HOW ZK WORKS
            </Link>
          </div>
          <div className="tf-pills">
            <span className="tf-pill">2-PLAYER LIVE</span>
            <span className="tf-pill tf-pill--amber">TESTNET BUILD</span>
            <span className="tf-pill tf-pill--mint">SEALED RUNS</span>
          </div>
        </div>
        <div className="tf-hero__viz">
          <div className="tf-portal">
            <div className="tf-portal__inner">10 FLOORS</div>
          </div>
          <div className="tf-hero__ring tf-hero__ring--a" />
          <div className="tf-hero__ring tf-hero__ring--b" />
          <div className="tf-hero__particles" />
        </div>
      </section>

      <section className="tf-grid">
        <div className="tf-panel tf-panel--glass">
          <p className="tf-panel__label">THE DUNGEON RULE</p>
          <h3 className="tf-panel__title">Four runes. One opens.</h3>
          <p className="tf-panel__copy">
            Every choice ships a transaction. Proofs hit chain, hub tallies progress, traps punish the wrong rune.
          </p>
          <div className="tf-runes">
            {["A", "B", "C", "D"].map((rune) => (
              <span key={rune} className="tf-rune">
                {rune}
              </span>
            ))}
          </div>
        </div>

        <div className="tf-panel tf-panel--gate">
          <p className="tf-panel__label">CO-OP GATES</p>
          <h3 className="tf-panel__title">Floors 1 & 5 lock until both sync</h3>
          <p className="tf-panel__copy">
            Gate logic mirrors chain state. Both players clear → gate opens → sprint resumes. No desync allowed.
          </p>
          <div className="tf-gate-bar">
            <span className="tf-gate-bar__left">P1</span>
            <div className="tf-gate-bar__progress" />
            <span className="tf-gate-bar__right">P2</span>
          </div>
        </div>

        <div className="tf-panel tf-panel--status">
          <p className="tf-panel__label">LIVE BUILD STATUS</p>
          <h3 className="tf-panel__title">Testnet contract online</h3>
          <p className="tf-panel__copy">Hub: CB4VZAT2U3UC6XFK3N23SKRF2NDCMP3QHJYMCHHFMZO7MRQO6DQ2EMYG</p>
          <p className="tf-panel__copy">Dungeon: CA34IFEOQADUHTDIMJGTQ2I7O34QYHL4FFXFOJYTUSPVRMJQCS3UAY6N</p>
          <div className="tf-status-row">
            <span className="tf-pill tf-pill--mint">LEDGER OK</span>
            <span className="tf-pill tf-pill--line">PING ~5s</span>
            <Link to="/status" className="tf-button tf-button--line">
              STATUS PAGE
            </Link>
          </div>
        </div>
      </section>

      <section className="tf-footer-grid">
        <div className="tf-footer-card">
          <p className="tf-footer-label">PATCH NOTES</p>
          <ul className="tf-list">
            <li>New studio shell + routes online</li>
            <li>Launcher preflight coming next</li>
            <li>ZK worker lane queued</li>
          </ul>
          <Link to="/devlog" className="tf-link">
            Open Devlog →
          </Link>
        </div>
        <div className="tf-footer-card">
          <p className="tf-footer-label">PRESS KIT</p>
          <p className="tf-panel__copy">Logos, screenshots, one-pager. Polished for judges + press.</p>
          <Link to="/press" className="tf-link">
            Download →
          </Link>
        </div>
        <div className="tf-footer-card">
          <p className="tf-footer-label">THE TEN FLOORS</p>
          <ul className="tf-list">
            {FLOOR_DESIGNS.map((f) => (
              <li key={f.id}>
                Floor {f.id}: {f.title} — {f.miniGame}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </StudioShell>
  );
}
