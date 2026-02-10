import { useEffect, useRef, useState } from "react";
import { useLobbyContext } from "./LobbyContext";
import "./gameCanvas.css";

export function GameCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [locked, setLocked] = useState(false);
  const { lobbyId, role, p1Floor, p2Floor, setFloors, lastTxHash, setTxHash } = useLobbyContext();
  const [attempts, setAttempts] = useState(0);
  const [result, setResult] = useState<string | null>(null);

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

  const attemptDoor = () => {
    const success = Math.random() > 0.5;
    setAttempts((a) => a + 1);
    setResult(success ? "Door opens. Floor advanced." : "Trap sprung. Proof still submitted.");
    setTxHash(`sim-${Date.now()}`);
    if (success) {
      setFloors(p1Floor + 1, p2Floor);
    }
    setTimeout(() => setResult(null), 2500);
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
            <div className="tf-hud-chip">Floor P1: {p1Floor}/10</div>
            <div className="tf-hud-chip tf-hud-chip--line">Floor P2: {p2Floor}/10</div>
            <div className="tf-hud-chip tf-hud-chip--amber">Attempts: {attempts}</div>
            <div className="tf-hud-chip tf-hud-chip--mint">Network: testnet</div>
          </div>
          <div className="tf-hud-right">
            <div className="tf-hud-chip tf-hud-chip--line">Lobby: {lobbyId || "unset"}</div>
            <div className="tf-hud-chip tf-hud-chip--line">Role: {role || "?"}</div>
            <div className="tf-hud-chip tf-hud-chip--line">Pointer lock: {locked ? "ON" : "Click to lock"}</div>
          </div>
        </div>
        <div className="tf-overlay">
          <p className="tf-overlay-title">ENTERING DUNGEON</p>
          <p className="tf-overlay-copy">
            This shell will host the Three.js scene and WebWorker proving lane in upcoming PRs. Pointer lock is wired.
            Attempts here simulate on-chain calls; next PR swaps to real contract flow.
          </p>
          <button className="tf-button tf-button--primary" onClick={requestLock}>
            {locked ? "LOCKED" : "CLICK TO LOCK + START"}
          </button>
          <button className="tf-button tf-button--ghost" onClick={attemptDoor}>
            SUBMIT ATTEMPT (SIM)
          </button>
          {result && <div className="tf-hud-result">{result}</div>}
          {lastTxHash && <div className="tf-hud-result tf-hud-result--line">tx: {lastTxHash}</div>}
        </div>
      </div>
    </div>
  );
}
