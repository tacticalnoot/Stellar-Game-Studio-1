import { createContext, useContext, useState } from "react";

export type LobbyRole = "player1" | "player2";

export type LobbyContextState = {
  lobbyId: string | null;
  role: LobbyRole | null;
  p1Floor: number;
  p2Floor: number;
  p1Cleared1: boolean;
  p1Cleared5: boolean;
  p2Cleared1: boolean;
  p2Cleared5: boolean;
  lastTxHash: string | null;
  attemptNonce: number;
  commitTxHash: string | null;
  setLobby: (id: string, role: LobbyRole) => void;
  setFloors: (p1: number, p2: number, p1c1: boolean, p1c5: boolean, p2c1: boolean, p2c5: boolean) => void;
  setTxHash: (hash: string | null) => void;
  setCommitHash: (hash: string | null) => void;
  bumpNonce: () => void;
};

const LobbyContext = createContext<LobbyContextState | null>(null);

export function LobbyProvider({ children }: { children: React.ReactNode }) {
  const [lobbyId, setLobbyId] = useState<string | null>(null);
  const [role, setRole] = useState<LobbyRole | null>(null);
  const [p1Floor, setP1] = useState(0);
  const [p2Floor, setP2] = useState(0);
  const [p1Cleared1, setP1C1] = useState(false);
  const [p1Cleared5, setP1C5] = useState(false);
  const [p2Cleared1, setP2C1] = useState(false);
  const [p2Cleared5, setP2C5] = useState(false);
  const [lastTxHash, setLastTx] = useState<string | null>(null);
  const [attemptNonce, setAttemptNonce] = useState(0);
  const [commitTxHash, setCommitTx] = useState<string | null>(null);

  const setLobby = (id: string, r: LobbyRole) => {
    setLobbyId(id);
    setRole(r);
  };
  const setFloors = (p1: number, p2: number, p1c1: boolean, p1c5: boolean, p2c1: boolean, p2c5: boolean) => {
    setP1(p1);
    setP2(p2);
    setP1C1(p1c1);
    setP1C5(p1c5);
    setP2C1(p2c1);
    setP2C5(p2c5);
  };
  const setTxHash = (hash: string | null) => setLastTx(hash);
  const setCommitHash = (hash: string | null) => setCommitTx(hash);
  const bumpNonce = () => setAttemptNonce((n) => n + 1);

  return (
    <LobbyContext.Provider
      value={{
        lobbyId,
        role,
        p1Floor,
        p2Floor,
        p1Cleared1,
        p1Cleared5,
        p2Cleared1,
        p2Cleared5,
        lastTxHash,
        attemptNonce,
        commitTxHash,
        setLobby,
        setFloors,
        setTxHash,
        setCommitHash,
        bumpNonce,
      }}
    >
      {children}
    </LobbyContext.Provider>
  );
}

export function useLobbyContext() {
  const ctx = useContext(LobbyContext);
  if (!ctx) throw new Error("useLobbyContext must be used within LobbyProvider");
  return ctx;
}
