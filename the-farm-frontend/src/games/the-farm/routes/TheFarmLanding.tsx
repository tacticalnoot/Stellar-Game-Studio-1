import { Link } from "react-router-dom";
import { StudioShell } from "./StudioShell";
import { FLOOR_DESIGNS } from "../lore/floors";
import "./theFarmShell.css";

export function TheFarmLanding() {
  return (
    <StudioShell hideNav>
      <section className="tf-hero tf-hero--centered">
        <div className="tf-hero__viz">
          <div className="tf-portal">
            <div className="tf-portal__inner"></div>
          </div>
          <div className="tf-hero__ring tf-hero__ring--a" />
          <div className="tf-hero__ring tf-hero__ring--b" />
          <div className="tf-hero__particles" />
        </div>

        <div className="tf-hero__text">
          <p className="tf-kicker">Stellar ZK Dungeon</p>
          <h2 className="tf-title">THE FARM</h2>
          <p className="tf-subtitle">
            10 Floors. Two Players. One Winner.
          </p>

          <div className="tf-cta-row">
            <Link to="/play" className="tf-button tf-button--primary tf-button--mega">
              ENTER DUNGEON
            </Link>
          </div>

          <div className="tf-pills" style={{ marginTop: '30px', opacity: 0.5 }}>
            <span className="tf-pill">Turn-Based Strategy</span>
            <span className="tf-pill tf-pill--amber">Testnet</span>
          </div>
        </div>
      </section>
    </StudioShell>
  );
}
