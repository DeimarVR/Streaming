import { useState } from 'react';
import { useDemo, avg, fmt, gradeColor, initials, TEACHER_SUBJECT, HOMEROOM_GROUP, TEACHER_COURSES, type Grade, type Student, type Role } from '../demo/store';
import { Header, Panel, Stat, Thumb, Avatar } from './parts';
import { useShell } from './shellctx';
import { Icon } from './icons';

/* ---------- helpers de fila ---------- */
function Slot({ t, subj, who, state, onEnter }: { t: string; subj: string; who: string; state: 'live' | 'soon' | 'done'; onEnter?: () => void }) {
  const right =
    state === 'live' ? (
      <button className="btn btn-primary btn-sm" onClick={onEnter}>Entrar</button>
    ) : (
      <span className={`pill ${state}`}>{state === 'soon' ? 'Programada' : 'Terminó'}</span>
    );
  return (
    <div className="slot">
      <div className="t">{t}</div>
      <div className="subject"><b>{subj}</b><span>{who}</span></div>
      {right}
    </div>
  );
}

function GradeMini({ g }: { g: Grade }) {
  const c = gradeColor(g.value);
  return (
    <div className="li2">
      <span className="g" style={{ background: c }}></span>
      <div><b style={{ fontWeight: 600 }}>{g.item}</b><div style={{ fontSize: 12, color: 'var(--ink-faint)' }}>{g.subject} · {g.date}</div></div>
      <span className="grade" style={{ color: c, marginLeft: 'auto' }}>{g.value.toFixed(1)}</span>
    </div>
  );
}

function RecCard({ t, meta, color, dur, prog, onOpen }: { t: string; meta: string; color: string; dur: string; prog: string; onOpen: () => void }) {
  return (
    <div style={{ border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden', background: 'var(--surface)', cursor: 'pointer' }} onClick={onOpen}>
      <div style={{ aspectRatio: '16/9', background: `linear-gradient(150deg,${color},${color}99)`, position: 'relative', display: 'grid', placeItems: 'center', color: '#fff' }}>
        <span style={{ fontSize: 30 }}>▶</span>
        <span style={{ position: 'absolute', bottom: 8, right: 8, background: '#000000aa', color: '#fff', fontSize: 11, padding: '2px 6px', borderRadius: 5 }}>{dur}</span>
        <span style={{ position: 'absolute', bottom: 0, left: 0, height: 3, width: prog, background: 'var(--highlight)' }}></span>
      </div>
      <div style={{ padding: '11px 12px' }}><b style={{ fontSize: 14, display: 'block' }}>{t}</b><span style={{ fontSize: 12, color: 'var(--ink-faint)' }}>{meta}</span></div>
    </div>
  );
}

function GradesTable({ grades }: { grades: Grade[] }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="gtable">
        <thead><tr><th>Materia</th><th>Evaluación</th><th>Fecha</th><th style={{ textAlign: 'right' }}>Nota</th></tr></thead>
        <tbody>
          {grades.slice().reverse().map((g, i) => (
            <tr key={i}><td>{g.subject}</td><td>{g.item}</td><td style={{ color: 'var(--ink-faint)' }}>{g.date}</td><td style={{ textAlign: 'right' }}><span className="gv" style={{ color: gradeColor(g.value) }}>{g.value.toFixed(1)}</span></td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SubjAvgList({ grades }: { grades: Grade[] }) {
  const subjects = [...new Set(grades.map((g) => g.subject))];
  return (
    <>
      {subjects.map((s) => {
        const a = avg(grades, s);
        const c = gradeColor(a);
        return (
          <div className="subj-avg" key={s}>
            <div className="ring" style={{ background: c }}>{s[0]}</div>
            <div><b style={{ fontWeight: 600 }}>{s}</b><div style={{ fontSize: 12, color: 'var(--ink-faint)' }}>{grades.filter((g) => g.subject === s).length} evaluaciones</div></div>
            <span className="badge-avg" style={{ color: c }}>{fmt(a)}</span>
          </div>
        );
      })}
    </>
  );
}

function GradesReport({ student, role, title, sub }: { student: Student; role: Role; title: string; sub: string }) {
  const subjects = [...new Set(student.grades.map((g) => g.subject))];
  const prom = avg(student.grades);
  return (
    <>
      <Header role={role} title={title} sub={sub} />
      <div className="content">
        <div className="cards-3">
          <Stat label="Promedio general" value={fmt(prom)} delta={prom != null && prom >= 4 ? 'Buen desempeño 🎉' : 'A mejorar'} />
          <Stat label="Materias" value={String(subjects.length)} delta="Este periodo" />
          <Stat label="Evaluaciones" value={String(student.grades.length)} delta="Registradas" />
        </div>
        <Panel title="Promedio por materia" bodyStyle={{ padding: 0 }}><SubjAvgList grades={student.grades} /></Panel>
        <Panel title="Detalle de calificaciones" flush><GradesTable grades={student.grades} /></Panel>
      </div>
    </>
  );
}

function InfoRow({ color, live, title, meta, right }: { color: string; live?: boolean; title: string; meta: string; right?: React.ReactNode }) {
  return (
    <div className="row">
      <Thumb color={color} live={live}>▶</Thumb>
      <div className="info"><b>{title}</b><span>{meta}</span></div>
      {right}
    </div>
  );
}

/* ---------- ESTUDIANTE ---------- */
function StudentView() {
  const { view, setView, findStudent } = useDemo();
  const me = findStudent('sofia')!;
  if (view === 'inicio') {
    const prom = avg(me.grades);
    return (
      <>
        <Header role="estudiante" title="Hola, Sofía 👋" sub="Martes 22 de septiembre · tienes 5 clases hoy" />
        <div className="content">
          <div className="panel" style={{ borderColor: 'var(--brand)', background: 'linear-gradient(120deg,var(--brand-soft),transparent)' }}>
            <div className="panel-b" style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <Thumb color="#3B39D6" live>▶</Thumb>
              <div className="info" style={{ flex: 1, minWidth: 180 }}>
                <b style={{ fontSize: 16 }}>Matemáticas · Ecuaciones cuadráticas</b>
                <span style={{ color: 'var(--ink-soft)', fontSize: 13, display: 'block' }}>Prof. Marcela Ríos · empezó hace 4 min</span>
              </div>
              <button className="btn btn-primary" onClick={() => setView('vivo')}>Entrar a clase →</button>
            </div>
          </div>
          <div className="cards-4">
            <Stat label="Mi promedio" value={fmt(prom)} delta="Periodo 3" />
            <Stat label="Asistencia" value={me.attendance + '%'} delta="Excelente" />
            <Stat label="Clases hoy" value="5" delta="2 vistas" />
            <Stat label="Tareas" value="2" delta="Esta semana" warn />
          </div>
          <div className="cards-2">
            <Panel title="Horario de hoy" link="Ver semana" onLink={() => setView('clases')}>
              <div className="schedule">
                <Slot t="07:00" subj="Matemáticas" who="Prof. Marcela · 9°B" state="live" onEnter={() => setView('vivo')} />
                <Slot t="08:00" subj="Biología" who="Prof. Daniel · Lab virtual" state="soon" />
                <Slot t="09:30" subj="Inglés" who="Prof. Karen" state="soon" />
                <Slot t="11:00" subj="Historia" who="Prof. Luis" state="soon" />
                <Slot t="13:00" subj="Ed. Física" who="Prof. Óscar" state="soon" />
              </div>
            </Panel>
            <Panel title="Últimas notas" link="Ver todas" onLink={() => setView('notas')}>
              <div className="list-plain">{me.grades.slice(-4).reverse().map((g, i) => <GradeMini key={i} g={g} />)}</div>
            </Panel>
          </div>
        </div>
      </>
    );
  }
  if (view === 'notas') return <GradesReport student={me} role="estudiante" title="Mis notas" sub="Sofía Martínez · 9°B · Periodo 3" />;
  if (view === 'clases') {
    return (
      <>
        <Header role="estudiante" title="Mis clases" sub="Tu horario completo de la semana" />
        <div className="content">
          <Panel title="Semana en curso">
            <div className="schedule">
              <Slot t="Lun 07:00" subj="Matemáticas" who="Prof. Marcela" state="done" />
              <Slot t="Lun 09:30" subj="Inglés" who="Prof. Karen" state="done" />
              <Slot t="Mar 07:00" subj="Matemáticas" who="Prof. Marcela · ahora" state="live" onEnter={() => setView('vivo')} />
              <Slot t="Mar 08:00" subj="Biología" who="Prof. Daniel" state="soon" />
              <Slot t="Mié 07:00" subj="Química" who="Prof. Ana" state="soon" />
              <Slot t="Jue 10:00" subj="Historia" who="Prof. Luis" state="soon" />
            </div>
          </Panel>
        </div>
      </>
    );
  }
  if (view === 'grab') {
    return (
      <>
        <Header role="estudiante" title="Grabaciones" sub="Todas las clases guardadas, listas para repasar" />
        <div className="content">
          <div className="cards-3">
            <RecCard t="Ecuaciones cuadráticas" meta="Matemáticas · hoy" color="#3B39D6" dur="50 min" prog="0%" onOpen={() => setView('vivo')} />
            <RecCard t="Funciones lineales" meta="Matemáticas · ayer" color="#3B39D6" dur="48 min" prog="60%" onOpen={() => setView('vivo')} />
            <RecCard t="Sistema digestivo" meta="Biología · lun" color="#1F9E6E" dur="52 min" prog="20%" onOpen={() => setView('vivo')} />
            <RecCard t="Revolución Francesa" meta="Historia · lun" color="#E0813B" dur="45 min" prog="0%" onOpen={() => setView('vivo')} />
            <RecCard t="Present perfect" meta="Inglés · vie" color="#1E8FB8" dur="40 min" prog="100%" onOpen={() => setView('vivo')} />
            <RecCard t="Tabla periódica" meta="Química · vie" color="#B4438F" dur="55 min" prog="0%" onOpen={() => setView('vivo')} />
          </div>
        </div>
      </>
    );
  }
  return null;
}

/* ---------- PROFESOR ---------- */
function StudentManageRow({ s }: { s: Student }) {
  const { openGrade, openStudent } = useShell();
  const a = avg(s.grades, TEACHER_SUBJECT);
  return (
    <div className="li2">
      <div className="avatar" style={{ background: s.color, width: 36, height: 36 }}>{initials(s.name)}</div>
      <div style={{ minWidth: 0 }}>
        <b style={{ fontWeight: 600 }}>{s.name}{s.isMe && <span className="pill soon" style={{ fontSize: 9, padding: '1px 6px', marginLeft: 6 }}>demo</span>}</b>
        <div style={{ fontSize: 12, color: 'var(--ink-faint)' }}>{s.course} · Asistencia {s.attendance}% · {s.grades.filter((g) => g.subject === TEACHER_SUBJECT).length} notas</div>
      </div>
      <span className="grade" style={{ color: gradeColor(a), marginLeft: 'auto' }}>{fmt(a)}</span>
      <button className="btn btn-primary btn-sm" style={{ marginLeft: 6 }} onClick={() => openGrade(s.id)}>＋ Nota</button>
      <button className="btn btn-ghost btn-sm" style={{ marginLeft: 4 }} onClick={() => openStudent(s.id)}>Ver</button>
    </div>
  );
}

function TeacherView() {
  const { view, setView, students, showToast } = useDemo();
  const { openStartClass, openAddStudent } = useShell();
  const [groupFilter, setGroupFilter] = useState<string>(HOMEROOM_GROUP);
  const homeroom = students.filter((s) => s.course === HOMEROOM_GROUP);

  if (view === 'inicio') {
    const classAvg = avg(homeroom.flatMap((s) => s.grades), TEACHER_SUBJECT);
    const homeroomAtt = homeroom.length ? Math.round(homeroom.reduce((a, s) => a + s.attendance, 0) / homeroom.length) : 0;
    return (
      <>
        <Header role="profesor" title="¡Hola Marcela! Bienvenida a tu panel de docente." sub="Prof. Marcela Ríos · Matemáticas" />
        <div className="content">
          <div className="cards-4">
            <Stat label="Cursos que dicto" value={String(TEACHER_COURSES.length)} delta="grupos" icon="book" />
            <Stat label={'Promedio ' + HOMEROOM_GROUP} value={fmt(classAvg)} delta="tu grupo" icon="chart" />
            <Stat label="Estudiantes en total" value={String(students.length)} delta={TEACHER_COURSES.length + ' cursos'} icon="users" />
            <Stat label="Tareas por revisar" value="17" delta="vencen este viernes" warn icon="check" />
          </div>
          <div className="panel live-banner">
            <div className="panel-b" style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div className="info" style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.05em', color: 'var(--live)', marginBottom: 4 }}>PRÓXIMO EVENTO EN VIVO</div>
                <b style={{ fontSize: 16 }}>Matemáticas · 9°B · Ecuaciones cuadráticas</b>
                <span style={{ color: 'var(--ink-soft)', fontSize: 13, display: 'block', marginTop: 2 }}>Comienza en 3 minutos</span>
              </div>
              <button className="btn btn-primary" onClick={openStartClass}><Icon n="cast" /> Iniciar transmisión</button>
            </div>
          </div>
          <Panel title="Dirección de grupo" right={<span className="pill ok" style={{ marginLeft: 'auto' }}>Director de grupo</span>}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '6px 6px', flexWrap: 'wrap' }}>
              <div className="ring" style={{ width: 46, height: 46, fontSize: 18, background: 'var(--brand)' }}>{HOMEROOM_GROUP[0]}</div>
              <div style={{ flex: 1, minWidth: 180 }}>
                <b style={{ fontWeight: 600 }}>Eres director de grupo de {HOMEROOM_GROUP}</b>
                <div style={{ fontSize: 12.5, color: 'var(--ink-faint)' }}>{homeroom.length} estudiantes · asistencia promedio {homeroomAtt}%</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => { setGroupFilter(HOMEROOM_GROUP); setView('estud'); }}>Ver mi grupo →</button>
            </div>
          </Panel>
          <Panel title={'Estudiantes de ' + HOMEROOM_GROUP + ' (tu grupo)'} link="Gestionar →" onLink={() => { setGroupFilter(HOMEROOM_GROUP); setView('estud'); }} flush>
            <div className="student-grid">
              {homeroom.slice(0, 4).map((s) => {
                const a = avg(s.grades, TEACHER_SUBJECT);
                return (
                  <div className="stud" key={s.id}>
                    <Avatar name={s.name} color={s.color} size={42} font={15} />
                    <div className="sinfo"><b>{s.name}</b><span>Asistencia {s.attendance}%</span></div>
                    <span className="sgrade" style={{ color: gradeColor(a) }}>{fmt(a)}</span>
                  </div>
                );
              })}
            </div>
          </Panel>
        </div>
        <div className="live-fab" onClick={() => setView('vivo')}>
          <div className="lf-top"><span>Matemáticas · 9°B</span><Icon n="cast" /></div>
          <div className="lf-stage"><span className="lf-badge"><span style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff', display: 'inline-block' }}></span>EN VIVO</span><div className="lf-play"></div></div>
          <div className="lf-cap">Prof. Marcela: "Hoy resolvemos ecuaciones…"</div>
        </div>
      </>
    );
  }

  if (view === 'estud') {
    const groups = TEACHER_COURSES.map((c) => c.group);
    const chips = ['Todos', ...groups];
    const filtered = groupFilter === 'Todos' ? students : students.filter((s) => s.course === groupFilter);
    return (
      <>
        <Header role="profesor" title="Estudiantes" sub={students.length + ' estudiantes · ' + groups.length + ' cursos'} />
        <div className="content">
          <div className="panel" style={{ background: 'var(--brand-soft)', borderColor: 'var(--brand)' }}>
            <div className="panel-b" style={{ padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: 20 }}>💡</span>
              <span style={{ fontSize: 13.5, color: 'var(--brand-ink)', flex: 1, minWidth: 200 }}>Agrega una nota a <b>Sofía</b> (9°B) y luego entra como <b>Estudiante</b> o <b>Acudiente</b>: la verás reflejada al instante.</span>
              <button className="btn btn-primary btn-sm" onClick={openAddStudent}>＋ Registrar estudiante</button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--ink-faint)', fontWeight: 600, marginRight: 2 }}>Curso:</span>
            {chips.map((g) => (
              <button key={g} className={`btn btn-sm ${groupFilter === g ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setGroupFilter(g)}>
                {g}{g === HOMEROOM_GROUP ? ' ★' : ''}
              </button>
            ))}
          </div>
          <Panel
            title={groupFilter === 'Todos' ? 'Todos los cursos' : 'Curso ' + groupFilter}
            right={groupFilter === HOMEROOM_GROUP ? <span className="pill ok" style={{ marginLeft: 'auto' }}>Dir. de grupo</span> : undefined}
          >
            <div className="list-plain">{filtered.map((s) => <StudentManageRow key={s.id} s={s} />)}</div>
          </Panel>
        </div>
      </>
    );
  }

  if (view === 'cursos') {
    return (
      <>
        <Header role="profesor" title="Mis cursos" sub={'Dictas Matemáticas en ' + TEACHER_COURSES.length + ' grupos'} />
        <div className="content">
          <div className="cards-3">
            {TEACHER_COURSES.map((c) => {
              const count = students.filter((s) => s.course === c.group).length;
              const isHome = c.group === HOMEROOM_GROUP;
              return (
                <div className="panel" key={c.id}>
                  <div style={{ height: 80, background: 'linear-gradient(150deg,var(--grad1),var(--grad2))', display: 'grid', placeItems: 'center', color: '#fff', fontFamily: "'Bricolage Grotesque'", fontWeight: 700, fontSize: 26 }}>{c.group}</div>
                  <div style={{ padding: 14 }}>
                    <b style={{ fontSize: 15, display: 'block' }}>{c.subject}{isHome && <span className="pill ok" style={{ marginLeft: 8, fontSize: 10 }}>Dir. de grupo</span>}</b>
                    <span style={{ fontSize: 13, color: 'var(--ink-faint)' }}>{c.group} · {count} estudiantes</span>
                    <button className="btn btn-ghost btn-sm" style={{ width: '100%', marginTop: 12 }} onClick={openStartClass}>Iniciar clase</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }

  if (view === 'mat') {
    const files: [string, string, string][] = [
      ['Guía ecuaciones cuadráticas.pdf', '2.1 MB · hoy', '📄'],
      ['Presentación funciones.pptx', '8.4 MB · ayer', '📊'],
      ['Taller práctico.docx', '340 KB · lun', '📝'],
      ['Grabación · Funciones lineales', '48 min · ayer', '🎬'],
    ];
    return (
      <>
        <Header role="profesor" title="Material" sub="Recursos que compartes con tus cursos" />
        <div className="content">
          <Panel title="Archivos del curso 9°B" right={<button className="btn btn-primary btn-sm" style={{ marginLeft: 'auto' }} onClick={() => showToast('En la versión final: subir archivo')}>＋ Subir material</button>}>
            <div className="list-plain">
              {files.map(([t, meta, ic], i) => (
                <div className="li2" key={i}>
                  <span style={{ fontSize: 20 }}>{ic}</span>
                  <div><b style={{ fontWeight: 600 }}>{t}</b><div style={{ fontSize: 12, color: 'var(--ink-faint)' }}>{meta}</div></div>
                  <button className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }} onClick={() => showToast('Compartido con 9°B')}>Compartir</button>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </>
    );
  }
  return null;
}

/* ---------- DIRECCIÓN ---------- */
function DirectorView() {
  const { view, setView } = useDemo();
  if (view === 'inicio') {
    const bars = [
      { h: 88, l: 'Lun' }, { h: 90, l: 'Mar' }, { h: 91, l: 'Mié', hi: true }, { h: 0, l: 'Jue', empty: true }, { h: 0, l: 'Vie', empty: true },
    ];
    const live: [string, string, string][] = [
      ['Matemáticas 9°B', 'Prof. Marcela · 28', '#3B39D6'],
      ['Biología 10°A', 'Prof. Daniel · 26', '#1F9E6E'],
      ['Inglés 8°C', 'Prof. Karen · 24', '#1E8FB8'],
      ['Historia 11°A', 'Prof. Luis · 30', '#E0813B'],
    ];
    return (
      <>
        <Header role="director" title="Resumen de la institución" sub="Institución Demo · martes 22 de septiembre" />
        <div className="content">
          <div className="cards-4">
            <Stat label="Clases en vivo ahora" value="6" delta="de 14 programadas" />
            <Stat label="Asistencia hoy" value="91%" delta="+3% vs promedio" />
            <Stat label="Docentes activos" value="28" delta="2 ausentes" warn />
            <Stat label="Estudiantes conectados" value="742" delta="de 810" />
          </div>
          <div className="cards-2">
            <Panel title="Asistencia por día (esta semana)" bodyStyle={{ padding: 18 }}>
              <div className="bars">
                {bars.map((b, i) => (
                  <div key={i} className={`bar ${b.hi ? 'hi' : ''}`} style={{ height: b.empty ? 6 : Math.max(6, b.h * 1.3) }}>
                    {!b.empty && <span className="cap">{b.h}%</span>}
                  </div>
                ))}
              </div>
              <div className="bar-labels">{bars.map((b, i) => <span key={i}>{b.l}</span>)}</div>
            </Panel>
            <Panel title="Clases en vivo ahora" right={<span className="pill live" style={{ marginLeft: 'auto' }}>6 activas</span>}>
              <div className="list-plain">
                {live.map(([t, meta, c], i) => (
                  <InfoRow key={i} color={c} live title={t} meta={meta + ' conectados'} right={<button className="btn btn-ghost btn-sm" onClick={() => setView('vivo')}>Ver</button>} />
                ))}
              </div>
            </Panel>
          </div>
          <Panel title="Alertas que necesitan atención">
            <div className="list-plain">
              <AlertRow t="2 docentes sin registrar clase hoy" meta="Ed. Física y Artes" type="warn" />
              <AlertRow t="Curso 7°A con asistencia baja (68%)" meta="Últimos 3 días" type="warn" />
              <AlertRow t="Reporte mensual listo para descargar" meta="Septiembre" type="ok" />
            </div>
          </Panel>
        </div>
      </>
    );
  }
  if (view === 'docentes') {
    const rows: [string, string, string, string, 'live' | 'ok' | 'warn'][] = [
      ['Marcela Ríos', 'Matemáticas · 3 clases hoy', 'En vivo', '#3B39D6', 'live'],
      ['Daniel Ospina', 'Biología · 2 clases hoy', 'En vivo', '#1F9E6E', 'live'],
      ['Karen López', 'Inglés · 4 clases hoy', 'Al día', '#1E8FB8', 'ok'],
      ['Luis Prada', 'Historia · 2 clases hoy', 'Al día', '#E0813B', 'ok'],
      ['Óscar Mesa', 'Ed. Física · sin registrar', 'Pendiente', '#C0392B', 'warn'],
    ];
    return (
      <>
        <Header role="director" title="Docentes" sub="28 docentes · actividad de hoy" />
        <div className="content">
          <Panel title="Planta docente" link="Exportar">
            <div className="list-plain">
              {rows.map(([name, meta, badge, c, st], i) => (
                <div className="li2" key={i}>
                  <div className="avatar" style={{ background: c, width: 30, height: 30, fontSize: 12 }}>{initials(name)}</div>
                  <div><b style={{ fontWeight: 600 }}>{name}</b><div style={{ fontSize: 12, color: 'var(--ink-faint)' }}>{meta}</div></div>
                  <span className={`pill ${st}`} style={{ marginLeft: 'auto' }}>{badge}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </>
    );
  }
  if (view === 'cursos') {
    const gs: [string, string, string][] = [
      ['9°B', '32 est · 91%', '#3B39D6'], ['10°A', '30 est · 94%', '#1F9E6E'], ['8°C', '28 est · 87%', '#1E8FB8'],
      ['11°A', '34 est · 96%', '#E0813B'], ['7°A', '29 est · 68%', '#C0392B'], ['6°B', '31 est · 90%', '#B4438F'],
    ];
    return (
      <>
        <Header role="director" title="Cursos" sub="Todos los grupos de la institución" />
        <div className="content">
          <div className="cards-4">
            {gs.map(([g, meta, c], i) => (
              <div className="panel" key={i} style={{ cursor: 'pointer' }}>
                <div style={{ height: 60, background: `linear-gradient(150deg,${c},${c}aa)`, display: 'grid', placeItems: 'center', color: '#fff', fontFamily: "'Bricolage Grotesque'", fontWeight: 700, fontSize: 22 }}>{g}</div>
                <div style={{ padding: 12 }}><span style={{ fontSize: 12.5, color: 'var(--ink-faint)' }}>{meta}</span></div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }
  if (view === 'reportes') {
    const reps: [string, string, string][] = [
      ['Asistencia general — Septiembre', 'Actualizado hoy', '📄'],
      ['Actividad docente — Septiembre', 'Actualizado hoy', '📄'],
      ['Participación por curso', 'Semana en curso', '📊'],
      ['Horas de clase transmitidas', 'Trimestre', '⏱️'],
    ];
    return (
      <>
        <Header role="director" title="Reportes" sub="Descarga los informes de la institución" />
        <div className="content">
          <Panel>
            <div className="list-plain">
              {reps.map(([t, meta, ic], i) => (
                <div className="li2" key={i}>
                  <span style={{ fontSize: 20 }}>{ic}</span>
                  <div><b style={{ fontWeight: 600 }}>{t}</b><div style={{ fontSize: 12, color: 'var(--ink-faint)' }}>{meta}</div></div>
                  <button className="btn btn-primary btn-sm" style={{ marginLeft: 'auto' }}>Descargar</button>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </>
    );
  }
  return null;
}

function AlertRow({ t, meta, type }: { t: string; meta: string; type: 'warn' | 'ok' }) {
  return (
    <div className="li2">
      <span style={{ fontSize: 18 }}>{type === 'warn' ? '⚠️' : '✅'}</span>
      <div><b style={{ fontWeight: 600 }}>{t}</b><div style={{ fontSize: 12, color: 'var(--ink-faint)' }}>{meta}</div></div>
      <span className={`pill ${type === 'warn' ? 'live' : 'ok'}`} style={{ marginLeft: 'auto' }}>{type === 'warn' ? 'Revisar' : 'Listo'}</span>
    </div>
  );
}

/* ---------- ACUDIENTE ---------- */
function GuardianView() {
  const { view, setView, findStudent } = useDemo();
  const kid = findStudent('sofia')!;
  if (view === 'inicio') {
    const prom = avg(kid.grades);
    return (
      <>
        <Header role="acudiente" title="Hola, Carmen 👋" sub="Seguimiento de Sofía Martínez · 9°B" />
        <div className="content">
          <div className="cards-3">
            <Stat label="Asistencia del mes" value={kid.attendance + '%'} delta="Muy buena" />
            <Stat label="Promedio actual" value={fmt(prom)} delta="Periodo 3" />
            <Stat label="Tareas pendientes" value="2" delta="Esta semana" warn />
          </div>
          <div className="panel" style={{ borderColor: 'var(--brand)', background: 'linear-gradient(120deg,var(--brand-soft),transparent)' }}>
            <div className="panel-b" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <Thumb color="#3B39D6" live>▶</Thumb>
              <div className="info" style={{ flex: 1, minWidth: 160 }}><b>Sofía está en clase ahora</b><span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>Matemáticas · conectada hace 12 min</span></div>
              <span className="pill ok">Presente</span>
            </div>
          </div>
          <div className="cards-2">
            <Panel title="Últimas notas de Sofía" link="Ver todas" onLink={() => setView('notas')}>
              <div className="list-plain">{kid.grades.slice(-4).reverse().map((g, i) => <GradeMini key={i} g={g} />)}</div>
            </Panel>
            <Panel title="Mensajes de la institución" right={<span style={{ marginLeft: 'auto', background: 'var(--live)', color: '#fff', fontSize: 11, padding: '2px 8px', borderRadius: 999 }}>2</span>}>
              <div className="list-plain">
                <MsgRow who="Dirección" txt="Reunión de padres 9°B — jueves 6pm" color="#E0813B" />
                <MsgRow who="Prof. Marcela" txt="Sofía va muy bien en álgebra 🎉" color="#3B39D6" />
              </div>
            </Panel>
          </div>
        </div>
      </>
    );
  }
  if (view === 'notas') return <GradesReport student={kid} role="acudiente" title="Notas de Sofía" sub="Periodo 3 · 9°B" />;
  if (view === 'asist') {
    const rows: [string, string, string, 'ok' | 'warn'][] = [
      ['Matemáticas', 'Hoy 07:00', 'Presente', 'ok'],
      ['Biología', 'Ayer 08:00', 'Presente', 'ok'],
      ['Inglés', 'Ayer 09:30', 'Presente', 'ok'],
      ['Historia', 'Lunes 10:00', 'Tarde (8 min)', 'warn'],
      ['Química', 'Viernes 11:00', 'Presente', 'ok'],
    ];
    return (
      <>
        <Header role="acudiente" title="Asistencia" sub="Registro de conexión de Sofía a sus clases" />
        <div className="content">
          <Panel>
            <div className="list-plain">
              {rows.map(([subj, when, badge, st], i) => (
                <div className="li2" key={i}>
                  <span className="g" style={{ background: st === 'ok' ? 'var(--ok)' : 'var(--warn)' }}></span>
                  <div><b style={{ fontWeight: 600 }}>{subj}</b><div style={{ fontSize: 12, color: 'var(--ink-faint)' }}>{when}</div></div>
                  <span className={`pill ${st === 'ok' ? 'ok' : 'warn'}`} style={{ marginLeft: 'auto' }}>{badge}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </>
    );
  }
  if (view === 'grab') {
    return (
      <>
        <Header role="acudiente" title="Grabaciones" sub="Todo lo que vio Sofía, para repasar juntos en casa" />
        <div className="content">
          <div className="cards-3">
            <RecCard t="Ecuaciones cuadráticas" meta="Matemáticas · hoy" color="#3B39D6" dur="50 min" prog="0%" onOpen={() => setView('inicio')} />
            <RecCard t="Sistema digestivo" meta="Biología · lun" color="#1F9E6E" dur="52 min" prog="0%" onOpen={() => setView('inicio')} />
            <RecCard t="Revolución Francesa" meta="Historia · lun" color="#E0813B" dur="45 min" prog="0%" onOpen={() => setView('inicio')} />
            <RecCard t="Present perfect" meta="Inglés · vie" color="#1E8FB8" dur="40 min" prog="0%" onOpen={() => setView('inicio')} />
          </div>
        </div>
      </>
    );
  }
  if (view === 'mensajes') {
    return (
      <>
        <Header role="acudiente" title="Mensajes" sub="Comunicación con la institución" />
        <div className="content">
          <Panel>
            <div className="list-plain">
              <MsgRow who="Dirección" txt="Reunión de padres 9°B — jueves 6pm" color="#E0813B" />
              <MsgRow who="Prof. Marcela" txt="Sofía va muy bien en álgebra 🎉" color="#3B39D6" />
              <MsgRow who="Secretaría" txt="Recordatorio de pago de pensión" color="#1E8FB8" />
              <MsgRow who="Prof. Daniel" txt="Falta entrega del ensayo de célula" color="#1F9E6E" />
            </div>
          </Panel>
        </div>
      </>
    );
  }
  return null;
}

function MsgRow({ who, txt, color }: { who: string; txt: string; color: string }) {
  return (
    <div className="li2">
      <div className="avatar" style={{ background: color, width: 30, height: 30, fontSize: 11 }}>{initials(who)}</div>
      <div style={{ minWidth: 0 }}><b style={{ fontWeight: 600 }}>{who}</b><div style={{ fontSize: 12.5, color: 'var(--ink-soft)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{txt}</div></div>
    </div>
  );
}

export function ViewContent() {
  const { role } = useDemo();
  if (role === 'estudiante') return <StudentView />;
  if (role === 'profesor') return <TeacherView />;
  if (role === 'director') return <DirectorView />;
  return <GuardianView />;
}
