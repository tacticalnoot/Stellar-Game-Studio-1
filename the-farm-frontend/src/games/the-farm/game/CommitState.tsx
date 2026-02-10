import { useState } from "react";
import { useLobbyContext } from "./LobbyContext";
import { useWallet } from "@/hooks/useWallet";
import { setCommit } from "../theFarmApi";

export function CommitState() {
  const { lobbyId, role, setCommitHash } = useLobbyContext();
  const { getContractSigner, publicKey } = useWallet();
  const [commitInput, setCommitInput] = useState("0xdeadbeefcafebabe");
  const [commitTx, setCommitTx] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const explorer = (hash: string) => `https://stellar.expert/explorer/testnet/tx/${hash}`;

  const handleCommit = async () => {
    setError(null);
    if (!lobbyId || !role) {
      setError("Join a lobby first.");
      return;
    }
    const signer = safeSigner();
    if (!signer || !publicKey) {
      setError("Connect wallet first.");
      return;
    }
    try {
      const res = await setCommit(
        Number(lobbyId.replace("L", "")),
        Buffer.from(commitInput),
        publicKey,
        signer
      );
      setCommitTx(res.hash);
      setCommitHash(res.hash);
    } catch (e: any) {
      setError(e?.message || "Commit failed");
    }
  };

  return (
    <div className="tf-hud-commit">
      <div className="tf-hud-chip tf-hud-chip--line">Role: {role || "?"}</div>
      <div className="tf-hud-chip tf-hud-chip--line">Commit: {commitTx ? "sent" : "required"}</div>
      <div className="tf-hud-commit-row">
        <input
          className="tf-input tf-input--compact"
          value={commitInput}
          onChange={(e) => setCommitInput(e.target.value)}
          placeholder="commit bytes"
        />
        <button className="tf-button tf-button--line" onClick={handleCommit}>
          Send commit
        </button>
      </div>
      {commitTx && (
        <a href={explorer(commitTx)} target="_blank" rel="noreferrer" className="tf-link">
          Commit tx
        </a>
      )}
      {error && <div className="tf-hud-result tf-hud-result--line" style={{ color: "#ffb3a1" }}>{error}</div>}
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
