import { Link, useLocation } from "react-router-dom";
import "./theFarmShell.css";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/play", label: "Play" },
  { to: "/lobby", label: "Lobby" },
  { to: "/devlog", label: "Devlog" },
  { to: "/status", label: "Status" },
  { to: "/press", label: "Press Kit" },
];

type StudioShellProps = {
  children: React.ReactNode;
  tone?: "dark" | "glass";
  hideNav?: boolean;
};

export function StudioShell({ children, tone = "dark", hideNav = false }: StudioShellProps) {
  const { pathname } = useLocation();

  return (
    <div className={`tf-shell tf-shell--${tone}`}>
      <div className="tf-shell__bg">
        <div className="tf-shell__grid" />
        <div className="tf-shell__runes" />
      </div>
      {!hideNav && (
        <header className="tf-shell__nav">
          <div className="tf-shell__brand">
            <span className="tf-shell__brand-mark">⚔️</span>
            <div>
              <p className="tf-shell__brand-overline">Stellar ZK Studio</p>
              <h1 className="tf-shell__brand-title">THE FARM</h1>
            </div>
          </div>
          <nav className="tf-shell__links">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={
                  (link.to === "/" ? pathname === "/" : pathname.startsWith(link.to))
                    ? "tf-shell__link tf-shell__link--active"
                    : "tf-shell__link"
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="tf-shell__cta">
            <Link to="/play" className="tf-button tf-button--primary">
              PLAY NOW
            </Link>
          </div>
        </header>
      )}
      <main className="tf-shell__content">{children}</main>
    </div>
  );
}
