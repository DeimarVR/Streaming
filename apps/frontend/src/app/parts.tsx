import type { CSSProperties, ReactNode } from 'react';
import { Icon } from './icons';
import { USERS, initials, type Role } from '../demo/store';

export function toggleTheme() {
  const r = document.documentElement;
  r.setAttribute('data-theme', r.getAttribute('data-theme') === 'light' ? '' : 'light');
}

export function Avatar({ name, color, size = 34, font = 14 }: { name: string; color: string; size?: number; font?: number }) {
  return (
    <div className="avatar" style={{ width: size, height: size, fontSize: font, background: `linear-gradient(135deg,${color},${color}aa)` }}>
      {initials(name)}
    </div>
  );
}

export function Stat({ label, value, delta, warn, icon }: { label: string; value: ReactNode; delta?: string; warn?: boolean; icon?: string }) {
  return (
    <div className="stat">
      <div className="stat-top">
        <span className="k">{label}</span>
        {icon && <span className="stat-ic"><Icon n={icon} /></span>}
      </div>
      <div className="v">{value}</div>
      {delta && <div className={`d ${warn ? 'warn' : ''}`}>{delta}</div>}
    </div>
  );
}

export function Panel({ title, link, onLink, right, children, className = '', style, bodyStyle, flush }: {
  title?: string; link?: string; onLink?: () => void; right?: ReactNode; className?: string; style?: CSSProperties; bodyStyle?: CSSProperties; flush?: boolean; children: ReactNode;
}) {
  return (
    <div className={`panel ${className}`} style={style}>
      {(title || right || link) && (
        <div className="panel-h">
          {title && <h3>{title}</h3>}
          {right}
          {link && <span className="link" onClick={onLink}>{link}</span>}
        </div>
      )}
      {flush ? children : <div className="panel-b" style={bodyStyle}>{children}</div>}
    </div>
  );
}

export function Thumb({ color, children, live }: { color: string; children?: ReactNode; live?: boolean }) {
  return <div className={`thumb ${live ? 'live' : ''}`} style={{ background: `linear-gradient(150deg,${color},${color}bb)` }}>{children}</div>;
}

export function Header({ role, title, sub }: { role: Role; title: string; sub?: string }) {
  const u = USERS[role];
  return (
    <>
      <div className="topbar">
        <div className="tagline"><Icon n="cast" /><span>Clases en vivo, grabadas y organizadas por rol.</span></div>
        <div className="searchbar"><Icon n="search" /><input placeholder="Buscar…" /></div>
        <button className="icon-btn2" onClick={toggleTheme} title="Cambiar tema"><Icon n="moon" /></button>
        <button className="icon-btn2 bell" title="Notificaciones"><Icon n="bell" /><span className="bdot"></span></button>
        <div className="profile"><Avatar name={u.name} color={u.color} size={38} /><div className="pmeta"><b>{u.name}</b><span>{u.sub}</span></div></div>
      </div>
      <div className="greet"><h1>{title}</h1>{sub && <p>{sub}</p>}</div>
    </>
  );
}
