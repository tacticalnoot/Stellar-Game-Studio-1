import { useEffect, useRef, useState } from "react";
import { useLobbyContext } from "./LobbyContext";
import { useWallet } from "@/hooks/useWallet";
import { attemptDoor as apiAttemptDoor } from "../theFarmApi";
import { initScene, disposeScene } from "./threeScene";
// @ts-ignore
import ZkWorker from "../workers/zkProver.worker.ts?worker&inline";
import { CommitState } from "./CommitState";
import "./gameCanvas.css";

function explorerUrl(hash: string) {
  return `https://stellar.expert/explorer/testnet/tx/${hash}`;
}

export function GameCanvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [locked, setLocked] = useState(false);
  const { lobbyId, role, p1Floor, p2Floor, setFloors, lastTxHash, setTxHash, attemptNonce, bumpNonce } =
    useLobbyContext();
  const { getContractSigner, publicKey } = useWallet();
  const [attempts, setAttempts] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [attemptError, setAttemptError] = useState<string | null>(null);
  const [workerReady, setWorkerReady] = useState(true);
  const [proofBusy, setProofBusy] = useState(false);

  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const cleanup = initScene(el);
    const handleLockChange = () => {
      const doc: any = document;
      setLocked(doc.pointerLockElement === el);
    };
    document.addEventListener("pointerlockchange", handleLockChange);
    return () => document.removeEventListener("pointerlockchange", handleLockChange);
  }, []);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    return () => disposeScene(el);
  }, []);

  useEffect(() => {
    const w: Worker = new ZkWorker();
    workerRef.current = w;
    setWorkerReady(true);
    return () => w.terminate();
  }, []);

  const requestLock = () => {
    const el = canvasRef.current;
    if (!el) return;
    if (document.pointerLockElement !== el) {
      el.requestPointerLock?.();
    }
  };

  const attemptDoor = async () => {
    setAttempts((a) => a + 1);
    const signer = safeSigner();
    if (!signer || !publicKey || !lobbyId) {
      setResult("Connect wallet + lobby before attempting.");
      return;
    }
    setAttemptError(null);
    try {
      setProofBusy(true);
      const proofPayload = await runProofWorker();
      setProofBusy(false);
      const res = await apiAttemptDoor(
        Number(lobbyId.replace("L", "")),
        p1Floor,
        attemptNonce + 1,
        publicKey,
        proofPayload.proof,
        proofPayload.publicInputs,
        signer
      );
      setTxHash(res.hash);
      bumpNonce();
      // Assume success until poll catches floor
      setResult("Attempt submitted on-chain. Awaiting ledger.");
    } catch (e: any) {
      setAttemptError(e?.message || "Attempt failed");
      setResult("Attempt failed");
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
            Pointer lock engaged; your moves are sealed to the ledger without breaking immersion. Keep it smooth, keep it honest.
          </p>
          <button className="tf-button tf-button--primary" onClick={requestLock}>
            {locked ? "LOCKED" : "CLICK TO LOCK + START"}
          </button>
          <button className="tf-button tf-button--ghost" onClick={attemptDoor}>
            {proofBusy ? "FORGING…" : "SUBMIT ATTEMPT"}
          </button>
          {result && <div className="tf-hud-result">{result}</div>}
          {lastTxHash && (
            <div className="tf-hud-result tf-hud-result--line">
              tx: <a href={explorerUrl(lastTxHash)} target="_blank" rel="noreferrer">{lastTxHash}</a>
            </div>
          )}
          {attemptError && <div className="tf-hud-result tf-hud-result--line" style={{ color: "#ffb3a1" }}>{attemptError}</div>}
        </div>
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

  async function runProofWorker(): Promise<{ proof: Buffer; publicInputs: Buffer }> {
    return new Promise((resolve) => {
      if (!workerRef.current) {
        resolve({ proof: Buffer.alloc(0), publicInputs: Buffer.alloc(0) });
        return;
      }
      workerRef.current.onmessage = (msg) => {
        const { proof, publicInputs } = msg.data || {};
        resolve({
          proof: Buffer.from(proof || []),
          publicInputs: Buffer.from(publicInputs || []),
        });
      };
      workerRef.current.postMessage({ payload: { lobbyId, floor: p1Floor, nonce: attemptNonce + 1 } });
    });
  }
}
