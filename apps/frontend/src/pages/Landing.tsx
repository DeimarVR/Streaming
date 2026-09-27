import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemo, type Role } from '../demo/store';
import { CONFIG } from '../config';

const ROLES: { key: Role; emoji: string; bg: string; title: string; desc: string; items: string[] }[] = [
  { key: 'estudiante', emoji: '🎓', bg: '#ECEBFB', title: 'Estudiantes', desc: 'Entran a clase, ven sus notas y repasan lo que se perdieron.', items: ['Unirse a la clase en vivo', 'Consultar sus notas y promedio', 'Clases grabadas y tareas'] },
  { key: 'profesor', emoji: '🧑🏽‍🏫', bg: '#E7F5EF', title: 'Profesores', desc: 'Transmiten, gestionan a sus estudiantes y les ponen notas.', items: ['Iniciar transmisión', 'Estudiantes registrados por curso', 'Agregar y editar notas'] },
  { key: 'director', emoji: '🏛️', bg: '#E9F3F8', title: 'Dirección', desc: 'Ve el pulso de la institución: qué se dicta, quién asiste, cómo va todo.', items: ['Panel general de asistencia', 'Gestión de docentes y cursos', 'Reportes descargables'] },
  { key: 'acudiente', emoji: '👨‍👩‍👧', bg: '#FBF0E6', title: 'Acudientes', desc: 'Acompañan el proceso de su estudiante desde el celular.', items: ['Asistencia y notas de su acudido', 'Grabaciones de las clases', 'Mensajes de la institución'] },
];

const FEATURES = [
  { ic: '🔴', t: 'Streaming en vivo', p: 'Video estable, chat, mano levantada y control de sala para el profesor.' },
  { ic: '🎬', t: 'Grabación automática', p: 'Cada clase se guarda sola y se organiza por curso, materia y fecha.' },
  { ic: '📋', t: 'Asistencia inteligente', p: 'Registra quién entró, cuánto tiempo estuvo y avisa a los ausentes.' },
  { ic: '📈', t: 'Notas y calificaciones', p: 'Los profes registran notas y cada estudiante y acudiente las ve al instante.' },
  { ic: '📊', t: 'Reportes para dirección', p: 'Asistencia, participación y actividad docente en tableros claros.' },
  { ic: '🔐', t: 'Acceso por rol seguro', p: 'Cada quien ve solo lo que le corresponde. Datos protegidos.' },
];

const STEPS = [
  { t: 'El profe inicia la clase', p: 'Abre su curso, le fija una duración y presiona "Iniciar transmisión". Cuando se acaba el tiempo, la clase se cierra sola y saca a quien siga conectado.' },
  { t: 'El curso entra en vivo', p: 'Los estudiantes se conectan con un clic, escriben en el chat y levantan la mano. La asistencia se toma sola.' },
  { t: 'Queda grabada para todos', p: 'Al terminar, la clase se guarda en la biblioteca. Estudiantes y acudientes la ven cuando quieran.' },
];

export function Landing() {
  const navigate = useNavigate();
  const { setRole, setView } = useDemo();
  const [menuOpen, setMenuOpen] = useState(false);
  const goLogin = () => navigate('/login');
  const goRole = (r: Role) => { setRole(r); setView('inicio'); navigate('/app'); };
  const toggleTheme = () => {
    const el = document.documentElement;
    el.setAttribute('data-theme', el.getAttribute('data-theme') === 'light' ? '' : 'light');
  };

  return (
    <>
      <header className="nav">
        <div className="wrap nav-in">
          <a className="brand" href="#top"><span className="glyph"></span>{CONFIG.platform}</a>
          <nav className="nav-links">
            <a href="#roles">Para cada rol</a>
            <a href="#como">Cómo funciona</a>
            <a href="#features">Plataforma</a>
          </nav>
          <div className="nav-right">
            <button className="icon-btn" onClick={toggleTheme} title="Cambiar tema">◐</button>
            <button className="btn btn-ghost btn-sm nav-cta-desktop" onClick={goLogin}>Entrar</button>
            <button className="btn btn-primary btn-sm nav-cta-desktop" onClick={goLogin}>Ver demo</button>
            <button className="icon-btn menu-toggle" onClick={() => setMenuOpen((v) => !v)}>☰</button>
          </div>
        </div>
      </header>

      <div className={`drawer ${menuOpen ? 'open' : ''}`}>
        <button className="icon-btn" style={{ alignSelf: 'flex-end', marginBottom: 10 }} onClick={() => setMenuOpen(false)}>✕</button>
        <a href="#roles" onClick={() => setMenuOpen(false)}>Para cada rol</a>
        <a href="#como" onClick={() => setMenuOpen(false)}>Cómo funciona</a>
        <a href="#features" onClick={() => setMenuOpen(false)}>Plataforma</a>
        <button className="btn btn-primary" style={{ marginTop: 18 }} onClick={() => { setMenuOpen(false); goLogin(); }}>Ver demo</button>
      </div>

      <span id="top"></span>
      <section className="hero">
        <div className="wrap hero-in">
          <div>
            <span className="eyebrow hero-reveal d1"><span className="dot-live"></span> Clases en vivo, sin salir de tu institución</span>
            <h1 className="title hero-reveal d1">La sala de clases<br />de tu institución,<br /><span className="mark">en vivo</span> y grabada.</h1>
            <p className="lead hero-reveal d2">{CONFIG.platform} transmite las clases en tiempo real, las guarda automáticamente y le da a cada persona —estudiante, profesor, dirección y acudiente— justo lo que necesita ver.</p>
            <div className="hero-actions hero-reveal d3">
              <button className="btn btn-primary" onClick={goLogin}>Explorar la demo →</button>
              <a className="btn btn-ghost" href="#roles">Ver los roles</a>
            </div>
            <div className="trust hero-reveal d4">
              <div><b>1 clic</b><span>para entrar a clase</span></div>
              <div><b>24/7</b><span>clases grabadas</span></div>
              <div><b>4 vistas</b><span>según quién eres</span></div>
            </div>
          </div>
          <div className="player-card hero-reveal d3">
            <div className="player-top"><span className="win-dot"></span><span className="win-dot"></span><span className="win-dot"></span><span className="tag">Matemáticas · Grupo A</span></div>
            <div className="stage">
              <span className="badge-live"><span className="dot-live"></span>EN VIVO · 28 conectados</span>
              <div className="teacher">👩🏻‍🏫</div>
              <button className="play-fab" onClick={goLogin} aria-label="Reproducir"></button>
              <div className="caption">Prof. Marcela: "Hoy resolvemos ecuaciones de segundo grado paso a paso…"</div>
            </div>
            <div className="player-side">
              <div className="chatline"><b>Sofía</b><span>¿La fórmula sirve si b es negativo?</span></div>
              <div className="chatline"><b>Andrés</b><span>Profe, ¿queda grabada?</span></div>
              <div className="chatline"><b>Prof. Marcela</b><span>Sí Andrés, la subo al terminar 👍</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="block" id="roles">
        <div className="wrap">
          <div className="sec-head">
            <div className="sec-kicker">Seccionado por rol</div>
            <h2>Cada persona entra y ve lo suyo</h2>
            <p>Un mismo lugar, cuatro experiencias. Entra a cualquiera y pruébalo.</p>
          </div>
          <div className="roles">
            {ROLES.map((r) => (
              <div className="role" key={r.key}>
                <div className="ico" style={{ background: r.bg }}>{r.emoji}</div>
                <h3>{r.title}</h3>
                <p>{r.desc}</p>
                <ul>{r.items.map((i) => <li key={i}>{i}</li>)}</ul>
                <button className="btn btn-ghost btn-sm open" onClick={() => goRole(r.key)}>Probar vista →</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="block" id="como">
        <div className="wrap">
          <div className="sec-head"><div className="sec-kicker">Cómo funciona</div><h2>De la sala física a la pantalla, sin fricción</h2></div>
          <div className="steps">
            {STEPS.map((s) => (<div className="step" key={s.t}><div className="n"></div><h3>{s.t}</h3><p>{s.p}</p></div>))}
          </div>
        </div>
      </section>

      <section className="block" id="features">
        <div className="wrap">
          <div className="sec-head"><div className="sec-kicker">La plataforma</div><h2>Todo lo que una institución necesita para dar clase en línea</h2></div>
          <div className="features">
            {FEATURES.map((f) => (<div className="feat" key={f.t}><div className="ico">{f.ic}</div><h3>{f.t}</h3><p>{f.p}</p></div>))}
          </div>
        </div>
      </section>

      <section className="block">
        <div className="wrap">
          <div className="cta-band">
            <div><h2>¿Listo para probar {CONFIG.platform}?</h2><p>Entra como cualquiera de los cuatro roles y recorre la experiencia completa.</p></div>
            <button className="btn btn-primary" onClick={goLogin}>Entrar a la demo</button>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap">
          <div className="foot-grid">
            <div style={{ maxWidth: 260 }}>
              <a className="brand" href="#top" style={{ marginBottom: 12 }}><span className="glyph"></span>{CONFIG.platform}</a>
              <p style={{ fontSize: '13.5px' }}>La plataforma de clases en vivo pensada para colegios y universidades.</p>
            </div>
            <div><h4>Plataforma</h4><ul><li><a href="#features">Streaming</a></li><li><a href="#features">Grabaciones</a></li><li><a href="#features">Asistencia</a></li><li><a href="#features">Notas</a></li></ul></div>
            <div><h4>Roles</h4><ul><li><a href="#roles">Estudiantes</a></li><li><a href="#roles">Profesores</a></li><li><a href="#roles">Dirección</a></li><li><a href="#roles">Acudientes</a></li></ul></div>
            <div><h4>Institución</h4><ul><li><a href="#como">Cómo funciona</a></li><li><a href="#">Soporte</a></li><li><a href="#">Privacidad</a></li></ul></div>
          </div>
          <div className="foot-bottom"><span>© 2026 {CONFIG.platform}</span><span>Hecho para tu institución</span></div>
        </div>
      </footer>
    </>
  );
}
