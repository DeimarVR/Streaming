import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemo, USERS, TEACHER_SUBJECT, avg, fmt, gradeColor, initials, type Role } from '../demo/store';
import { Icon } from './icons';
import { Avatar, toggleTheme } from './parts';
import { ShellContext, useShell, type ShellApi } from './shellctx';
import { ViewContent } from './views';
import { LiveClass } from './LiveClass';

const NAVS: Record<Role, [string, string, string, boolean?][]> = {
  estudiante: [['inicio', 'grid', 'Inicio'], ['vivo', 'cast', 'Clase en vivo', true], ['notas', 'chart', 'Mis notas'], ['clases', 'calendar', 'Mis clases'], ['grab', 'play', 'Grabaciones']],
  profesor: [['inicio', 'grid', 'Dashboard'], ['vivo', 'cast', 'Transmisión', true], ['estud', 'users', 'Estudiantes'], ['cursos', 'book', 'Mis clases'], ['mat', 'folder', 'Materiales']],
  director: [['inicio', 'chart', 'Resumen'], ['vivo', 'cast', 'En vivo', true], ['docentes', 'users', 'Docentes'], ['cursos', 'book', 'Cursos'], ['reportes', 'doc', 'Reportes']],
  acudiente: [['inicio', 'grid', 'Inicio'], ['notas', 'chart', 'Notas'], ['asist', 'check', 'Asistencia'], ['grab', 'play', 'Grabaciones'], ['mensajes', 'mail', 'Mensajes']],
};

function Sidebar() {
  const { role, view, setView, showToast } = useDemo();
  const navigate = useNavigate();
  const u = USERS[role];
  const items = NAVS[role];
  const g1 = items.slice(0, 3);
  const g2 = items.slice(3);
  const navBtn = ([id, icon, label, live]: [string, string, string, boolean?]) => (
    <button key={id} className={`nav-item ${id === view ? 'active' : ''}`} onClick={() => setView(id)}>
      <span className="ni"><Icon n={icon} /></span><span>{label}</span>{live && <span className="badge">1</span>}
    </button>
  );
  return (
    <aside className="side">
      <a className="brand" href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}><span className="glyph"></span>Aula&nbsp;Viva</a>
      <div className="side-sec">Aula Viva</div>
      {g1.map(navBtn)}
      {g2.length > 0 && <><div className="side-sec">Panel</div>{g2.map(navBtn)}</>}
      <div className="side-sec">Cuenta</div>
      <button className="nav-item" onClick={() => showToast('Ajustes disponibles en la versión final')}><span className="ni"><Icon n="settings" /></span><span>Configuración</span></button>
      <button className="nav-item" onClick={toggleTheme}><span className="ni"><Icon n="moon" /></span><span>Tema</span></button>
      <button className="nav-item" onClick={() => navigate('/')}><span className="ni"><Icon n="logout" /></span><span>Cerrar sesión</span></button>
      <div className="side-foot"><div className="user-chip"><Avatar name={u.name} color={u.color} /><div className="meta"><b>{u.name}</b><span>{u.sub}</span></div></div></div>
    </aside>
  );
}

function MobileTabbar() {
  const { role, view, setView } = useDemo();
  return (
    <nav className="mobile-tabbar">
      {NAVS[role].slice(0, 5).map(([id, icon, label]) => (
        <button key={id} className={id === view ? 'active' : ''} onClick={() => setView(id)}>
          <span className="mi"><Icon n={icon} /></span>{label.split(' ')[0]}
        </button>
      ))}
    </nav>
  );
}

function ToastEl() {
  const { toast } = useDemo();
  return <div className={`toast ${toast ? 'show' : ''}`}>{toast ? <>{toast.icon} {toast.msg}</> : null}</div>;
}

function GradeForm({ id, onClose }: { id: string; onClose: () => void }) {
  const { findStudent, addGrade, setView, showToast } = useDemo();
  const s = findStudent(id);
  const [subject, setSubject] = useState(TEACHER_SUBJECT);
  const [item, setItem] = useState('');
  const [value, setValue] = useState('4.5');
  if (!s) return null;
  const save = () => {
    let v = parseFloat(value);
    if (isNaN(v)) v = 0;
    v = Math.min(5, Math.max(1, Math.round(v * 10) / 10));
    addGrade(id, { subject: subject || TEACHER_SUBJECT, item: item || 'Evaluación', value: v, date: 'hoy' });
    showToast('Nota ' + v.toFixed(1) + ' guardada a ' + s.name.split(' ')[0]);
    onClose();
    setView('estud');
  };
  return (
    <>
      <h3>Agregar nota</h3>
      <p className="m">Para <b>{s.name}</b> · {s.course}</p>
      <div className="field"><label>Materia</label><input value={subject} onChange={(e) => setSubject(e.target.value)} /></div>
      <div className="field"><label>Evaluación</label><input value={item} onChange={(e) => setItem(e.target.value)} placeholder="Ej: Taller de ecuaciones" /></div>
      <div className="field"><label>Nota (1.0 a 5.0)</label><input type="number" min={1} max={5} step={0.1} value={value} onChange={(e) => setValue(e.target.value)} /></div>
      <button className="btn btn-primary" style={{ width: '100%', marginTop: 6 }} onClick={save}>Guardar nota</button>
    </>
  );
}

function AddStudentForm({ onClose }: { onClose: () => void }) {
  const { addStudent, setView, showToast } = useDemo();
  const [name, setName] = useState('');
  const [att, setAtt] = useState('100');
  const save = () => {
    if (!name.trim()) { showToast('Escribe un nombre'); return; }
    let a = parseInt(att);
    if (isNaN(a)) a = 100;
    addStudent(name.trim(), a);
    showToast(name.trim().split(' ')[0] + ' registrado en 9°B');
    onClose();
    setView('estud');
  };
  return (
    <>
      <h3>Registrar estudiante</h3>
      <p className="m">Se agrega al curso 9°B de Matemáticas.</p>
      <div className="field"><label>Nombre completo</label><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: María Fernanda López" /></div>
      <div className="field"><label>Asistencia inicial (%)</label><input type="number" min={0} max={100} value={att} onChange={(e) => setAtt(e.target.value)} /></div>
      <button className="btn btn-primary" style={{ width: '100%', marginTop: 6 }} onClick={save}>Registrar</button>
    </>
  );
}

function StartClassForm({ onClose }: { onClose: () => void }) {
  const { startClass, setView, showToast } = useDemo();
  const [dur, setDur] = useState('45');
  const go = () => {
    const m = parseInt(dur) || 45;
    startClass(m);
    onClose();
    setView('vivo');
    showToast('Clase iniciada · ' + m + ' min', '▶');
  };
  return (
    <>
      <h3>Iniciar transmisión</h3>
      <p className="m">Matemáticas · 9°B · Ecuaciones cuadráticas</p>
      <div className="field"><label>Duración de la clase</label>
        <select value={dur} onChange={(e) => setDur(e.target.value)}>
          <option value="45">45 minutos</option>
          <option value="60">60 minutos</option>
          <option value="90">90 minutos</option>
          <option value="1">1 minuto — para ver el cierre automático</option>
        </select>
      </div>
      <p style={{ fontSize: 12.5, color: 'var(--ink-faint)', margin: '-2px 0 16px', display: 'flex', gap: 8 }}><span>⏱</span><span>Cuando se acabe el tiempo, la clase se cierra y quien siga conectado sale automáticamente.</span></p>
      <button className="btn btn-primary" style={{ width: '100%' }} onClick={go}>🔴 Iniciar en vivo</button>
    </>
  );
}

function StudentDetail({ id, onClose }: { id: string; onClose: () => void }) {
  const { findStudent } = useDemo();
  const { openGrade } = useShell();
  const s = findStudent(id);
  if (!s) return null;
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
        <div className="avatar" style={{ background: s.color, width: 44, height: 44, fontSize: 16 }}>{initials(s.name)}</div>
        <div><h3 style={{ fontSize: 19 }}>{s.name}</h3><span style={{ fontSize: 12.5, color: 'var(--ink-faint)' }}>{s.course} · Asistencia {s.attendance}% · Promedio {fmt(avg(s.grades, TEACHER_SUBJECT))}</span></div>
      </div>
      <div style={{ overflowX: 'auto', marginTop: 12, border: '1px solid var(--line)', borderRadius: 12 }}>
        <table className="gtable">
          <thead><tr><th>Materia</th><th>Evaluación</th><th>Fecha</th><th style={{ textAlign: 'right' }}>Nota</th></tr></thead>
          <tbody>
            {s.grades.length ? s.grades.slice().reverse().map((g, i) => (
              <tr key={i}><td>{g.subject}</td><td>{g.item}</td><td style={{ color: 'var(--ink-faint)' }}>{g.date}</td><td style={{ textAlign: 'right' }}><span className="gv" style={{ color: gradeColor(g.value) }}>{g.value.toFixed(1)}</span></td></tr>
            )) : (
              <tr><td colSpan={4} style={{ color: 'var(--ink-faint)', textAlign: 'center', padding: 18 }}>Sin notas todavía</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <button className="btn btn-primary" style={{ width: '100%', marginTop: 16 }} onClick={() => { onClose(); openGrade(id); }}>＋ Agregar otra nota</button>
    </>
  );
}

type ModalState = { type: 'grade' | 'add' | 'start' | 'student'; id?: string } | null;

function Modals({ modal, onClose }: { modal: ModalState; onClose: () => void }) {
  if (!modal) return null;
  return (
    <div className="modal-back" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <button className="icon-btn" style={{ position: 'absolute', top: 16, right: 16 }} onClick={onClose}>✕</button>
        {modal.type === 'grade' && <GradeForm id={modal.id!} onClose={onClose} />}
        {modal.type === 'add' && <AddStudentForm onClose={onClose} />}
        {modal.type === 'start' && <StartClassForm onClose={onClose} />}
        {modal.type === 'student' && <StudentDetail id={modal.id!} onClose={onClose} />}
      </div>
    </div>
  );
}

export function AppShell() {
  const { view } = useDemo();
  const [modal, setModal] = useState<ModalState>(null);
  const api = useMemo<ShellApi>(
    () => ({
      openGrade: (id) => setModal({ type: 'grade', id }),
      openAddStudent: () => setModal({ type: 'add' }),
      openStartClass: () => setModal({ type: 'start' }),
      openStudent: (id) => setModal({ type: 'student', id }),
    }),
    [],
  );
  return (
    <ShellContext.Provider value={api}>
      <div className="app-shell">
        <Sidebar />
        <div className="main">
          {view === 'vivo' ? <LiveClass /> : <ViewContent />}
          <MobileTabbar />
        </div>
      </div>
      <Modals modal={modal} onClose={() => setModal(null)} />
      <ToastEl />
    </ShellContext.Provider>
  );
}
