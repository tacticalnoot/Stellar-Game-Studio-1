import { useEffect, useRef, useState } from "react";
import { FloorPrompt } from "./FloorPrompt";
import { useLobbyContext } from "./LobbyContext";
import { useWallet } from "@/hooks/useWallet";
import { attemptDoor as apiAttemptDoor } from "../theFarmApi";
import { initScene, disposeScene } from "./threeScene";
import { floorProofPlan } from "../proofPlan";
// @ts-ignore
import ZkWorker from "../workers/zkProver.worker.ts?worker&inline";
import { CommitState } from "./CommitState";
import "./gameCanvas.css";

function explorerUrl(hash: string) {
  return `https://stellar.expert/explorer/testnet/tx/${hash}`;
}

export function GameCanvas() {
  const { lobbyId, role } = useLobbyContext();
  const { publicKey, getContractSigner } = useWallet();
  const canvasRef = useRef<HTMLDivElement>(null);

  const [locked, setLocked] = useState(false);
  const [p1Floor, setP1Floor] = useState(1);
  const [p2Floor, setP2Floor] = useState(1);
  const [p1Gates, setP1Gates] = useState({ g1: false, g5: false });
  const [p2Gates, setP2Gates] = useState({ g1: false, g5: false });
  const [attempts, setAttempts] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [lastTxHash, setTxHash] = useState<string | null>(null);
  const [attemptError, setAttemptError] = useState<string | null>(null);
  const [attemptNonce, setAttemptNonce] = useState(0);
  const [showHelp, setShowHelp] = useState(false);

  const toggleHelp = () => setShowHelp(h => !h);

  const setFloors = (p1: number, p2: number, p1s: any, p2s: any) => {
    setP1Floor(p1);
    setP2Floor(p2);
    setP1Gates({ g1: p1s.cleared_gate1, g5: p1s.cleared_gate5 });
    setP2Gates({ g1: p2s.cleared_gate1, g5: p2s.cleared_gate5 });
  };

  const bumpNonce = () => setAttemptNonce((n) => n + 1);

  // ... (useEffect for scene init remains)
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const cleanup = initScene(el);
    const handleLockChange = () => {
      const doc: any = document;
      setLocked(doc.pointerLockElement === el);
    };
    document.addEventListener("pointerlockchange", handleLockChange);
    return () => {
      document.removeEventListener("pointerlockchange", handleLockChange);
      cleanup();
    };
  }, []);

  // Poll for chain state updates
  useEffect(() => {
    if (!lobbyId) return;
    const id = Number(lobbyId.replace("L", ""));
    const timer = setInterval(() => {
      fetchLobby(id)
        .then((l) => {
          if (l) {
            setFloors(l.p1.floor, l.p2.floor, l.p1, l.p2);
            // If we are P1, check if our floor advanced
            if (role === "player1" && l.p1.floor > p1Floor) {
              setResult(null); // Clear previous result
            }
            if (role === "player2" && l.p2.floor > p2Floor) {
              setResult(null);
            }
          }
        })
        .catch(() => { });
    }, 2000);
    return () => clearInterval(timer);
  }, [lobbyId, role, p1Floor, p2Floor]);

  const isWaitingAtGate = () => {
    if (role === 'player1') {
      if (p1Floor === 1 && p1Gates.g1 && p2Floor === 1) return true;
      if (p1Floor === 5 && p1Gates.g5 && p2Floor === 5) return true;
    }
    if (role === 'player2') {
      if (p2Floor === 1 && p2Gates.g1 && p1Floor === 1) return true;
      if (p2Floor === 5 && p2Gates.g5 && p1Floor === 5) return true;
    }
    return false;
  };

  const requestLock = () => {
    const el = canvasRef.current;
    if (!el) return;
    if (document.pointerLockElement !== el) {
      el.requestPointerLock?.();
    }
  };

  const attemptDoor = async (isCorrectOption: boolean) => {
    setAttempts((a) => a + 1);
    const signer = safeSigner();
    if (!signer || !publicKey || !lobbyId) {
      setResult("Connect wallet + lobby before attempting.");
      return;
    }
    setAttemptError(null);
    try {
      setResult("Signing attempt...");
      const res = await apiAttemptDoor(
        Number(lobbyId.replace("L", "")),
        role === "player1" ? p1Floor : p2Floor,
        attemptNonce + 1,
        publicKey,
        isCorrectOption,
        signer
      );
      setTxHash(res.hash);
      bumpNonce();
      setResult("Attempt submitted. Waiting for ledger...");
    } catch (e: any) {
      setAttemptError(e?.message || "Attempt failed");
      setResult("Attempt failed");
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
            <div className="tf-hud-chip">Floor P1: {p1Floor}/10</div>
            <div className="tf-hud-chip tf-hud-chip--line">Floor P2: {p2Floor}/10</div>
            <div className="tf-hud-chip tf-hud-chip--amber">Attempts: {attempts}</div>
            <div className="tf-hud-chip tf-hud-chip--mint">Network: testnet</div>
            <div className="tf-hud-chip tf-hud-chip--line">
              Stack: {floorProofPlan[p1Floor] || "mixed"}
            </div>
            <div className="tf-hud-chip tf-hud-chip--line">
              Last Tx: {lastTxHash ? lastTxHash.slice(0, 8) + '...' : 'None'}
            </div>
          </div>
          <div className="tf-hud-right">
            <button className="tf-hud-chip tf-hud-chip--btn" onClick={toggleHelp}>
              {showHelp ? "Close Help" : "How to Play"}
            </button>
            <div className="tf-hud-chip tf-hud-chip--line">Lobby: {lobbyId || "unset"}</div>
            <div className="tf-hud-chip tf-hud-chip--line">Role: {role || "?"}</div>
            <div className="tf-hud-chip tf-hud-chip--line">Pointer lock: {locked ? "ON" : "Click to lock"}</div>
          </div>
        </div>

        {showHelp && (
          <div className="tf-overlay-backdrop" onClick={toggleHelp}>
            <div className="tf-help-modal" onClick={e => e.stopPropagation()}>
              <h2>How to Play</h2>
              <ul>
                <li><strong>Objective:</strong> Ascend to Floor 10.</li>
                <li><strong>Co-op:</strong> You share a lobby with a partner.</li>
                <li><strong>Gates:</strong> On Floors 1 and 5, BOTH players must clear the challenge before ANYONE can advance.</li>
                <li><strong>Choices:</strong> Read the prompt. Select the answer that matches the Lore.</li>
                <li><strong>Technology:</strong> Every move generates a Zero-Knowledge proof (simulated on testnet) and verifies on-chain.</li>
              </ul>
              <button className="tf-button tf-button--primary" onClick={toggleHelp}>Got it</button>
            </div>
          </div>
        )}

        <div className="tf-overlay-content">
          {isWaitingAtGate() ? (
            <div className="tf-gate-lock">
              <h2>GATE LOCKED</h2>
              <p>Waiting for partner to clear verification...</p>
              <div className="tf-spinner"></div>
            </div>
          ) : (
            <FloorPrompt
              floor={role === "player1" ? p1Floor : p2Floor}
              onAttempt={attemptDoor}
              busy={!!result && result.includes("Signing")}
            />
          )}
        </div>
        {result && <div className="tf-hud-result">{result}</div>}
        {lastTxHash && (
          <div className="tf-hud-result tf-hud-result--line">
            tx: <a href={explorerUrl(lastTxHash)} target="_blank" rel="noreferrer">{lastTxHash}</a>
          </div>
        )}
      </div>
    </div>
  );

  function safeSigner() {
    try {
      return getContractSigner();
    } catch {
      return null;
    }
  }
}
