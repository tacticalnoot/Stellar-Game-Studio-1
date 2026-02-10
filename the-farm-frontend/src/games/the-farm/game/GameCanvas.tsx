import { useEffect, useRef, useState } from "react";
import "./gameCanvas.css";

export function GameCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const handleLockChange = () => {
      const doc: any = document;
      setLocked(doc.pointerLockElement === el);
    };
    document.addEventListener("pointerlockchange", handleLockChange);
    return () => document.removeEventListener("pointerlockchange", handleLockChange);
  }, []);

  const requestLock = () => {
    const el = canvasRef.current;
    if (!el) return;
    if (document.pointerLockElement !== el) {
      el.requestPointerLock?.();
    }
  };

  return (
    <div className="tf-game-wrapper">
      <div ref={canvasRef} className="tf-game-canvas" onClick={requestLock} role="presentation">
        <div className="tf-canvas-bg">
          <div className="tf-canvas-fog" />
          <div className="tf-canvas-grid" />
          <div className="tf-canvas-runes">A · B · C · D</div>
        </div>
        <div className="tf-hud">
          <div className="tf-hud-left">
            <div className="tf-hud-chip">Floor 1/10</div>
            <div className="tf-hud-chip tf-hud-chip--amber">Attempts: 0</div>
            <div className="tf-hud-chip tf-hud-chip--mint">Network: testnet</div>
          </div>
          <div className="tf-hud-right">
            <div className="tf-hud-chip tf-hud-chip--line">Opponent: floor 0</div>
            <div className="tf-hud-chip tf-hud-chip--line">Pointer lock: {locked ? "ON" : "Click to lock"}</div>
          </div>
        </div>
        <div className="tf-overlay">
          <p className="tf-overlay-title">ENTERING DUNGEON</p>
          <p className="tf-overlay-copy">
            This shell will host the Three.js scene and WebWorker proving lane in upcoming PRs. Pointer lock is wired.
          </p>
          <button className="tf-button tf-button--primary" onClick={requestLock}>
            {locked ? "LOCKED" : "CLICK TO LOCK + START"}
          </button>
        </div>
      </div>
    </div>
  );
}
