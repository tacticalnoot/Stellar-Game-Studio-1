import { createContext, useContext, useState } from "react";

export type LobbyRole = "player1" | "player2";

export type LobbyContextState = {
  lobbyId: string | null;
  role: LobbyRole | null;
  p1Floor: number;
  p2Floor: number;
  lastTxHash: string | null;
  attemptNonce: number;
  setLobby: (id: string, role: LobbyRole) => void;
  setFloors: (p1: number, p2: number) => void;
  setTxHash: (hash: string | null) => void;
  bumpNonce: () => void;
};

const LobbyContext = createContext<LobbyContextState | null>(null);

export function LobbyProvider({ children }: { children: React.ReactNode }) {
  const [lobbyId, setLobbyId] = useState<string | null>(null);
  const [role, setRole] = useState<LobbyRole | null>(null);
  const [p1Floor, setP1] = useState(0);
  const [p2Floor, setP2] = useState(0);
  const [lastTxHash, setLastTx] = useState<string | null>(null);
  const [attemptNonce, setAttemptNonce] = useState(0);

  const setLobby = (id: string, r: LobbyRole) => {
    setLobbyId(id);
    setRole(r);
  };
  const setFloors = (p1: number, p2: number) => {
    setP1(p1);
    setP2(p2);
  };
  const setTxHash = (hash: string | null) => setLastTx(hash);
  const bumpNonce = () => setAttemptNonce((n) => n + 1);

  return (
    <LobbyContext.Provider
      value={{ lobbyId, role, p1Floor, p2Floor, lastTxHash, attemptNonce, setLobby, setFloors, setTxHash, bumpNonce }}
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
