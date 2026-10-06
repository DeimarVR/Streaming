import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export type Role = 'estudiante' | 'profesor' | 'director' | 'acudiente';
export interface Grade { subject: string; item: string; value: number; date: string }
export interface Student { id: string; name: string; course: string; attendance: number; color: string; isMe?: boolean; grades: Grade[] }
export interface ChatMsg { who: string; time: string; txt: string }

export const TEACHER_SUBJECT = 'Matemáticas';
// Marcela dicta Matemáticas a varios grupos y es directora de grupo de 9°B.
export const HOMEROOM_GROUP = '9°B';
export const TEACHER_COURSES: { id: string; group: string; subject: string }[] = [
  { id: '9b', group: '9°B', subject: 'Matemáticas' },
  { id: '10a', group: '10°A', subject: 'Matemáticas' },
  { id: '11a', group: '11°A', subject: 'Matemáticas' },
];

export const USERS: Record<Role, { name: string; sub: string; color: string }> = {
  estudiante: { name: 'Sofía Martínez', sub: 'Estudiante · 9°B', color: '#B4438F' },
  profesor: { name: 'Marcela Ríos', sub: 'Docente · Matemáticas', color: '#1F9E6E' },
  director: { name: 'Jorge Peláez', sub: 'Dirección', color: '#E0813B' },
  acudiente: { name: 'Carmen Díaz', sub: 'Acudiente de Sofía', color: '#B4438F' },
};

const mathGrades = (a: number, b: number): Grade[] => [
  { subject: 'Matemáticas', item: 'Taller de ecuaciones', value: a, date: '12 sep' },
  { subject: 'Matemáticas', item: 'Quiz funciones', value: b, date: '5 sep' },
];

const INITIAL_STUDENTS: Student[] = [
  { id: 'sofia', name: 'Sofía Martínez', course: '9°B', attendance: 100, color: '#B4438F', isMe: true, grades: [
    { subject: 'Matemáticas', item: 'Taller de ecuaciones', value: 4.8, date: '12 sep' },
    { subject: 'Matemáticas', item: 'Quiz funciones', value: 4.5, date: '5 sep' },
    { subject: 'Biología', item: 'Ensayo célula', value: 4.5, date: '10 sep' },
    { subject: 'Inglés', item: 'Reading unit 4', value: 4.2, date: '8 sep' },
    { subject: 'Historia', item: 'Mapa conceptual', value: 3.9, date: '6 sep' },
    { subject: 'Química', item: 'Laboratorio 2', value: 4.6, date: '9 sep' },
  ] },
  { id: 'andres', name: 'Andrés Gómez', course: '9°B', attendance: 96, color: '#3B39D6', grades: mathGrades(4.5, 4.2) },
  { id: 'laura', name: 'Laura Vega', course: '9°B', attendance: 88, color: '#E0813B', grades: mathGrades(4.1, 3.8) },
  { id: 'diego', name: 'Diego Ruiz', course: '9°B', attendance: 72, color: '#1E8FB8', grades: mathGrades(3.4, 3.1) },
  { id: 'camila', name: 'Camila Torres', course: '9°B', attendance: 94, color: '#C0392B', grades: mathGrades(4.6, 4.7) },
  { id: 'mateo', name: 'Mateo Rincón', course: '10°A', attendance: 91, color: '#3B39D6', grades: mathGrades(4.0, 4.3) },
  { id: 'valentina', name: 'Valentina Cruz', course: '10°A', attendance: 98, color: '#1F9E6E', grades: mathGrades(4.7, 4.9) },
  { id: 'tomas', name: 'Tomás Quintero', course: '10°A', attendance: 83, color: '#7D4FBF', grades: mathGrades(3.6, 3.9) },
  { id: 'isabella', name: 'Isabella Mora', course: '11°A', attendance: 95, color: '#B4438F', grades: mathGrades(4.4, 4.2) },
  { id: 'samuel', name: 'Samuel Nieto', course: '11°A', attendance: 79, color: '#E0813B', grades: mathGrades(3.9, 3.5) },
];

export const initials = (name: string) => name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
export const fmt = (n: number | null) => (n == null ? '—' : n.toFixed(1));
export const gradeColor = (v: number | null) => {
  if (v == null || isNaN(v)) return 'var(--ink-faint)';
  return v >= 4 ? 'var(--ok)' : v >= 3 ? 'var(--warn)' : 'var(--live)';
};
export function avg(grades: Grade[], subject?: string): number | null {
  const g = grades.filter((x) => !subject || x.subject === subject);
  if (!g.length) return null;
  return g.reduce((a, b) => a + b.value, 0) / g.length;
}

interface ToastData { msg: string; icon: string; id: number }

interface DemoCtx {
  role: Role; setRole: (r: Role) => void;
  view: string; setView: (v: string) => void;
  students: Student[];
  addGrade: (id: string, g: Grade) => void;
  addStudent: (name: string, attendance: number) => void;
  findStudent: (id: string) => Student | undefined;
  classEndsAt: number | null; startClass: (min: number) => void; ensureClass: () => void; endClass: () => void;
  chat: ChatMsg[]; sendChat: (txt: string) => void;
  toast: ToastData | null; showToast: (msg: string, icon?: string) => void;
}

const Ctx = createContext<DemoCtx | null>(null);
const COLORS = ['#3B39D6', '#1F9E6E', '#E0813B', '#B4438F', '#1E8FB8', '#C0392B', '#7D4FBF'];

export function DemoProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('estudiante');
  const [view, setView] = useState('inicio');
  const [students, setStudents] = useState<Student[]>(() => JSON.parse(JSON.stringify(INITIAL_STUDENTS)));
  const [classEndsAt, setClassEndsAt] = useState<number | null>(null);
  const [chat, setChat] = useState<ChatMsg[]>([
    { who: 'Andrés', time: '07:04', txt: '¿La fórmula sirve si b es negativo?' },
    { who: 'Prof. Marcela', time: '07:05', txt: 'Sí Andrés, el signo entra dentro de la fórmula 👍' },
    { who: 'Sofía', time: '07:06', txt: '¿Queda grabada la clase?' },
    { who: 'Prof. Marcela', time: '07:06', txt: 'Toda queda grabada, la subo al terminar' },
  ]);
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = useCallback((msg: string, icon = '✓') => {
    const id = Date.now();
    setToast({ msg, icon, id });
    window.setTimeout(() => setToast((t) => (t && t.id === id ? null : t)), 2600);
  }, []);
  const findStudent = useCallback((id: string) => students.find((s) => s.id === id), [students]);
  const addGrade = useCallback((id: string, g: Grade) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, grades: [...s.grades, g] } : s)));
  }, []);
  const addStudent = useCallback((name: string, attendance: number) => {
    setStudents((prev) => [...prev, { id: 's' + Date.now(), name, course: HOMEROOM_GROUP, attendance: Math.min(100, Math.max(0, attendance)), color: COLORS[prev.length % COLORS.length], grades: [] }]);
  }, []);
  const startClass = useCallback((min: number) => setClassEndsAt(Date.now() + min * 60000), []);
  const ensureClass = useCallback(() => setClassEndsAt((v) => v ?? Date.now() + 45 * 60000), []);
  const endClass = useCallback(() => setClassEndsAt(null), []);
  const sendChat = useCallback((txt: string) => setChat((prev) => [...prev, { who: 'Tú', time: 'ahora', txt }]), []);

  const value = useMemo(
    () => ({ role, setRole, view, setView, students, addGrade, addStudent, findStudent, classEndsAt, startClass, ensureClass, endClass, chat, sendChat, toast, showToast }),
    [role, view, students, classEndsAt, chat, toast, addGrade, addStudent, findStudent, startClass, ensureClass, endClass, sendChat, showToast],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDemo() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useDemo debe usarse dentro de <DemoProvider>');
  return c;
}
