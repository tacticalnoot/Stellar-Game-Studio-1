import { useEffect, useMemo, useState } from "react";
import { StudioShell } from "./StudioShell";
import { config } from "../../../config";
import { useLobbyContext } from "../game/LobbyContext";
import { useWallet } from "@/hooks/useWallet";
import type { ContractSigner } from "@/types/signer";
import { fetchLobby, createLobby as apiCreateLobby, joinLobby as apiJoinLobby } from "../theFarmApi";
import "./theFarmShell.css";

const explorer = (hash: string) => `https://stellar.expert/explorer/testnet/tx/${hash}`;

type LobbySnapshot = {
  lobbyId: string;
  status: "waiting" | "active";
  player1?: string;
  player2?: string;
  p1Floor: number;
  p2Floor: number;
  createdAt: number;
};

export function TheFarmLobby() {
  const { setLobby, lobbyId: ctxLobbyId, role } = useLobbyContext();
  const { getContractSigner, publicKey, walletType } = useWallet();
  const [lobby, setLobby] = useState<LobbySnapshot | null>(null);
  const [joiningCode, setJoiningCode] = useState("");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generatedLobby = useMemo(
    () => `L${Math.floor(Date.now() % 1_000_000).toString().padStart(6, "0")}`,
    []
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (ctxLobbyId) {
        fetchLobby(Number(ctxLobbyId.replace("L", "")))
          .then((chainLobby) => {
            if (!chainLobby) return;
            setLobby({
              lobbyId: ctxLobbyId,
              status: chainLobby.status.tag === "Active" ? "active" : chainLobby.status.tag === "Finished" ? "finished" : "waiting",
              player1: chainLobby.player1,
              player2: chainLobby.player2 ?? undefined,
              p1Floor: chainLobby.p1.floor,
              p2Floor: chainLobby.p2.floor,
              createdAt: Date.now(),
            });
          })
          .catch(() => {});
      }
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const handleCreate = async () => {
    const signer = getSigner();
    if (!signer || !publicKey) {
      setError("Connect dev wallet to create a lobby.");
      return;
    }
    const newLobby = {
      lobbyId: generatedLobby,
      status: "waiting",
      player1: "P1-connected",
      player2: undefined,
      p1Floor: 1,
      p2Floor: 0,
      createdAt: Date.now(),
    };
    setLobby(newLobby);
    setLobbyContext(newLobby.lobbyId, "player1");
    try {
      const res = await apiCreateLobby(publicKey, signer);
      setTxHash(res.hash);
    } catch (e: any) {
      setError(e?.message || "Create lobby failed");
    }
  };

  const handleJoin = async () => {
    if (!joiningCode.trim()) return;
    const signer = getSigner();
    if (!signer || !publicKey) {
      setError("Connect wallet before joining.");
      return;
    }
    const joined = {
      lobbyId: joiningCode.trim(),
      status: "waiting",
      player1: "Host",
      player2: "You",
      p1Floor: 1,
      p2Floor: 1,
      createdAt: Date.now(),
    };
    setLobby(joined);
    setLobbyContext(joined.lobbyId, "player2");
    try {
      const res = await apiJoinLobby(Number(joiningCode.replace("L", "")), publicKey, signer);
      setTxHash(res.hash);
    } catch (e: any) {
      setError(e?.message || "Join lobby failed");
    }
  };

  const setLobbyContext = (id: string, r: LobbyRole) => {
    setLobby(id, r);
  };

  return (
    <StudioShell>
      <section className="tf-lobby">
        <div className="tf-panel tf-panel--glass tf-lobby__card">
          <p className="tf-panel__label">Lobby Console</p>
          <h3 className="tf-panel__title">Create or join</h3>
          <p className="tf-panel__copy">
            P1 spins a lobby; P2 enters code. Secrets lock before the run; the hub opens once both are ready.
          </p>
          <div className="tf-lobby__actions">
            <button className="tf-button tf-button--primary" onClick={handleCreate}>
              Create lobby
            </button>
            <input
              className="tf-input"
              placeholder="Lobby code"
              value={joiningCode}
              onChange={(e) => setJoiningCode(e.target.value)}
            />
            <button className="tf-button tf-button--ghost" onClick={handleJoin}>
              Join with code
            </button>
          </div>
          <div className="tf-lobby__meta">
            <span className="tf-pill tf-pill--line">Floors: 10</span>
            <span className="tf-pill tf-pill--line">Gate floors: 1 & 5</span>
            <span className="tf-pill tf-pill--line">Attempts: on-chain</span>
            <span className="tf-pill tf-pill--line">Contract: {config.contractIds["the-farm"] || "unset"}</span>
          </div>
        </div>

        <div className="tf-panel tf-panel--status tf-lobby__card">
          <p className="tf-panel__label">Presence</p>
          <h3 className="tf-panel__title">Ghost beacons</h3>
          <p className="tf-panel__copy">
            Chain-authoritative progress renders here. A heartbeat keeps the room alive while we wait for the next seal.
          </p>
          <div className="tf-status-row">
            <span className="tf-pill tf-pill--amber">
              P1: {lobby?.player1 || "waiting"}
            </span>
            <span className="tf-pill tf-pill--line">
              P2: {lobby?.player2 || "invite pending"}
            </span>
          </div>
          {lobby && (
            <div className="tf-lobby__state">
              <div>Lobby: {ctxLobbyId || lobby.lobbyId}</div>
              <div>Status: {lobby.status}</div>
              <div>Role: {role || "unassigned"}</div>
              <div>Floors — P1: {lobby.p1Floor} / P2: {lobby.p2Floor}</div>
              {txHash && (
                <div>
                  Last tx:{" "}
                  <a href={explorer(txHash)} target="_blank" rel="noreferrer">
                    {txHash}
                  </a>
                </div>
              )}
            </div>
          )}
          {error && <div className="tf-panel__copy" style={{ color: "#ffb3a1" }}>{error}</div>}
        </div>
      </section>
    </StudioShell>
  );

  function getSigner(): ContractSigner | null {
    try {
      return getContractSigner();
    } catch {
      return null;
    }
  }
}
