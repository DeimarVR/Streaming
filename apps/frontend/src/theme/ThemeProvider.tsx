import { useEffect, type ReactNode } from 'react';
import { CONFIG, type InstitutionConfig } from '../config';
import './tokens.css';

export function ThemeProvider({
  config = CONFIG,
  children,
}: {
  config?: InstitutionConfig;
  children: ReactNode;
}) {
  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty('--brand', config.theme.brand);
    r.style.setProperty('--grad1', config.theme.grad1);
    r.style.setProperty('--grad2', config.theme.grad2);
    document.title = `${config.platform} — ${config.name}`;
  }, [config]);

  return <>{children}</>;
}
