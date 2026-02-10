import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { TheFarmLanding } from "./games/the-farm/routes/TheFarmLanding";
import { TheFarmPlay } from "./games/the-farm/routes/TheFarmPlay";
import { TheFarmLobby } from "./games/the-farm/routes/TheFarmLobby";
import { TheFarmDevlog } from "./games/the-farm/routes/TheFarmDevlog";
import { TheFarmStatus } from "./games/the-farm/routes/TheFarmStatus";
import { TheFarmPress } from "./games/the-farm/routes/TheFarmPress";
import { TheFarmGameRoute } from "./games/the-farm/routes/TheFarmGameRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/the-farm" element={<TheFarmLanding />} />
        <Route path="/the-farm/play" element={<TheFarmPlay />} />
        <Route path="/the-farm/lobby" element={<TheFarmLobby />} />
        <Route path="/the-farm/devlog" element={<TheFarmDevlog />} />
        <Route path="/the-farm/status" element={<TheFarmStatus />} />
        <Route path="/the-farm/press" element={<TheFarmPress />} />
        <Route path="/the-farm/game" element={<TheFarmGameRoute />} />
        <Route path="*" element={<Navigate to="/the-farm" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
