import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { TheFarmLanding } from "./games/the-farm/routes/TheFarmLanding";
import { TheFarmPlay } from "./games/the-farm/routes/TheFarmPlay";
import { TheFarmLobby } from "./games/the-farm/routes/TheFarmLobby";
import { TheFarmDevlog } from "./games/the-farm/routes/TheFarmDevlog";
import { TheFarmStatus } from "./games/the-farm/routes/TheFarmStatus";
import { TheFarmPress } from "./games/the-farm/routes/TheFarmPress";
import { TheFarmGameRoute } from "./games/the-farm/routes/TheFarmGameRoute";
import { LobbyProvider } from "./games/the-farm/game/LobbyContext";

export default function App() {
  return (
    <BrowserRouter basename="/labs/the-farm/client">
      <LobbyProvider>
        <Routes>
          <Route path="/" element={<TheFarmLanding />} />
          <Route path="/play" element={<TheFarmPlay />} />
          <Route path="/lobby" element={<TheFarmLobby />} />
          <Route path="/devlog" element={<TheFarmDevlog />} />
          <Route path="/status" element={<TheFarmStatus />} />
          <Route path="/press" element={<TheFarmPress />} />
          <Route path="/game" element={<TheFarmGameRoute />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </LobbyProvider>
    </BrowserRouter>
  );
}
