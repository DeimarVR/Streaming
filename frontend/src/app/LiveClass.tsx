import { useEffect, useRef, useState } from 'react';
import { useDemo, initials } from '../demo/store';
import { useShell } from './shellctx';

const PARTS = [
  { name: 'Marcela Ríos', role: 'Docente', color: '#1F9E6E', host: true },
  { name: 'Andrés Gómez', role: '', color: '#3B39D6' },
  { name: 'Sofía Martínez', role: '', color: '#B4438F' },
  { name: 'Laura Vega', role: '', color: '#E0813B' },
  { name: 'Diego Ruiz', role: '', color: '#1E8FB8' },
  { name: 'Camila Torres', role: '', color: '#C0392B' },
];

const pad = (n: number) => String(n).padStart(2, '0');

export function LiveClass() {
  const { role, setView, classEndsAt, ensureClass, endClass, chat, sendChat, showToast } = useDemo();
  const { openStartClass } = useShell();
  const [now, setNow] = useState(Date.now());
  const [tab, setTab] = useState<'chat' | 'parts'>('chat');
  const [text, setText] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);
  const isTeacher = role === 'profesor';
  const isDirector = role === 'director';

  useEffect(() => { ensureClass(); }, [ensureClass]);
  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);
  useEffect(() => {
    if (classEndsAt != null && now >= classEndsAt) {
      endClass();
      showToast(isTeacher ? 'Clase finalizada y grabada' : 'La clase terminó · se cerró tu sesión', '⏱');
      setView('inicio');
    }
  }, [now, classEndsAt, endClass, showToast, setView, isTeacher]);
  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [chat, tab]);

  const remaining = Math.max(0, (classEndsAt ?? now) - now);
  const s = Math.floor(remaining / 1000);
  const clock = pad(Math.floor(s / 60)) + ':' + pad(s % 60);
  const warn = s <= 60;

  const send = () => { const v = text.trim(); if (!v) return; sendChat(v); setText(''); };

  return (
    <>
      <div className="topbar">
        <button className="icon-btn" onClick={() => setView('inicio')}>←</button>
        <div>
          <h2>{isDirector ? 'Observando clase en vivo' : 'Clase en vivo'}</h2>
          <div className="sub">Prof. Marcela Ríos · 28 conectados</div>
        </div>
        <div className="topbar-right">
          <span className="pill live"><span style={{ display: 'inline-block', width: 7, height: 7, background: 'var(--live)', borderRadius: '50%', marginRight: 5 }}></span>EN VIVO</span>
        </div>
      </div>
      <div className="live-grid">
        <div className="live-main">
          <div className="live-stage">
            <div className="live-top">
              <span className="badge-live" style={{ position: 'static' }}><span className="dot-live"></span>EN VIVO</span>
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
                {warn && <span style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'var(--live)', color: '#fff', padding: '5px 10px', borderRadius: 8, fontSize: 11.5, fontWeight: 700 }}>⏱ Termina en &lt;1 min</span>}
                <span style={{ background: '#000000a6', color: '#fff', padding: '5px 11px', borderRadius: 8, fontSize: 12.5, fontVariantNumeric: 'tabular-nums' }}>⏱ <b>{clock}</b></span>
              </div>
            </div>
            <div className="teacher">👩🏻‍🏫</div>
            <div className="name-tag">Prof. Marcela Ríos</div>
            <div className="cc">"La fórmula general es x = (−b ± √(b²−4ac)) / 2a"</div>
          </div>
          <div className="live-controls">
            {isTeacher ? (
              <>
                <button className="ctrl on">🎙️</button>
                <button className="ctrl on">📷</button>
                <button className="ctrl" onClick={() => showToast('Compartiendo pantalla')}>🖥️</button>
                <button className="ctrl">✏️</button>
                <button className="ctrl" onClick={openStartClass} title="Cambiar duración">⏱️</button>
                <button className="ctrl end" onClick={() => { endClass(); showToast('Clase finalizada y grabada'); setView('inicio'); }}>⏹ Terminar clase</button>
              </>
            ) : isDirector ? (
              <>
                <button className="ctrl">🔇</button>
                <button className="ctrl end" style={{ background: '#33405C' }} onClick={() => setView('inicio')}>Salir de observación</button>
              </>
            ) : (
              <>
                <button className="ctrl on">🎙️</button>
                <button className="ctrl on">📷</button>
                <button className="ctrl" onClick={() => showToast('Mano levantada ✋')}>✋</button>
                <button className="ctrl end" onClick={() => setView('inicio')}>Salir</button>
              </>
            )}
          </div>
        </div>
        <div className="live-side">
          <div className="live-tabs">
            <button className={tab === 'chat' ? 'active' : ''} onClick={() => setTab('chat')}>Chat</button>
            <button className={tab === 'parts' ? 'active' : ''} onClick={() => setTab('parts')}>Participantes · 28</button>
          </div>
          {tab === 'chat' ? (
            <div className="chat-scroll" ref={chatRef}>
              {chat.map((m, i) => (
                <div className="msg" key={i}>
                  <div className="who">{m.who}<small>{m.time}</small></div>
                  <div className="txt">{m.txt}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="parts">
              {PARTS.map((p) => (
                <div className="li2" key={p.name}>
                  <div className="avatar" style={{ background: p.color, width: 30, height: 30, fontSize: 12 }}>{initials(p.name)}</div>
                  <div><b style={{ fontWeight: 600 }}>{p.name}</b>{p.role && <div style={{ fontSize: 11.5, color: 'var(--ink-faint)' }}>{p.role}</div>}</div>
                  {p.host ? <span className="pill ok" style={{ marginLeft: 'auto' }}>Anfitrión</span> : <span style={{ marginLeft: 'auto', fontSize: 14 }}>🎙️</span>}
                </div>
              ))}
            </div>
          )}
          {!isDirector && (
            <div className="chat-input">
              <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') send(); }} placeholder="Escribe un mensaje…" />
              <button className="send" onClick={send}>➤</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
