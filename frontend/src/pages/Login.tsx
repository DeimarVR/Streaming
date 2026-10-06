import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemo, type Role } from '../demo/store';

const ROLE_OPTS: { key: Role; e: string; t: string; d: string }[] = [
  { key: 'estudiante', e: '🎓', t: 'Estudiante', d: 'Ver mis clases y notas' },
  { key: 'profesor', e: '🧑🏽‍🏫', t: 'Profesor', d: 'Dictar y calificar' },
  { key: 'director', e: '🏛️', t: 'Dirección', d: 'Panel general' },
  { key: 'acudiente', e: '👨‍👩‍👧', t: 'Acudiente', d: 'Seguir a mi estudiante' },
];

export function Login() {
  const navigate = useNavigate();
  const { setRole, setView } = useDemo();
  const [sel, setSel] = useState<Role>('estudiante');
  const enter = () => {
    setRole(sel);
    setView('inicio');
    navigate('/app');
  };
  return (
    <div style={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', padding: 20 }}>
      <div className="modal" style={{ position: 'relative' }}>
        <h3>Entrar a Aula Viva</h3>
        <p className="m">Elige con qué rol quieres recorrer la demo.</p>
        <div className="role-pick">
          {ROLE_OPTS.map((r) => (
            <button key={r.key} className={`rp ${sel === r.key ? 'sel' : ''}`} onClick={() => setSel(r.key)}>
              <span className="e">{r.e}</span>
              <span><b>{r.t}</b><span>{r.d}</span></span>
            </button>
          ))}
        </div>
        <div className="field"><label>Correo institucional</label><input type="email" defaultValue="demo@institucion.edu" /></div>
        <div className="field"><label>Contraseña</label><input type="password" defaultValue="demo1234" /></div>
        <button className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} onClick={enter}>Entrar</button>
        <p style={{ fontSize: 12, color: 'var(--ink-faint)', textAlign: 'center', marginTop: 14 }}>Modo demo — cualquier dato entra directo al panel del rol elegido.</p>
      </div>
    </div>
  );
}
