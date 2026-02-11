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
  const [attempts, setAttempts] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [lastTxHash, setTxHash] = useState<string | null>(null);
  const [attemptError, setAttemptError] = useState<string | null>(null);
  const [attemptNonce, setAttemptNonce] = useState(0);
  const [isPolling, setIsPolling] = useState(false);

  const setFloors = (p1: number, p2: number) => {
    setP1Floor(p1);
    setP2Floor(p2);
  };

  const bumpNonce = () => setAttemptNonce((n) => n + 1);

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
            setFloors(l.p1.floor, l.p2.floor);
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
  }, [lobbyId, role, p1Floor, p2Floor, setFloors]);

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
            <div className="tf-hud-chip tf-hud-chip--line">Lobby: {lobbyId || "unset"}</div>
            <div className="tf-hud-chip tf-hud-chip--line">Role: {role || "?"}</div>
            <div className="tf-hud-chip tf-hud-chip--line">Pointer lock: {locked ? "ON" : "Click to lock"}</div>
          </div>
        </div>

        <div className="tf-overlay-content">
          <FloorPrompt
            floor={role === "player1" ? p1Floor : p2Floor}
            onAttempt={attemptDoor}
            busy={!!result && result.includes("Signing")}
          />
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
