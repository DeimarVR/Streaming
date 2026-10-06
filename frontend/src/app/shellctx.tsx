import { createContext, useContext } from 'react';

export interface ShellApi {
  openGrade: (id: string) => void;
  openAddStudent: () => void;
  openStartClass: () => void;
  openStudent: (id: string) => void;
}

export const ShellContext = createContext<ShellApi | null>(null);

export function useShell() {
  const c = useContext(ShellContext);
  if (!c) throw new Error('useShell debe usarse dentro de <AppShell>');
  return c;
}
