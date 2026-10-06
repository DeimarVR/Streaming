export type InstitutionType = 'colegio' | 'universidad';

export interface InstitutionConfig {
  platform: string;
  name: string;
  type: InstitutionType;
  tagline: string;
  theme: { brand: string; grad1: string; grad2: string };
}

// Config por defecto (white-label). En producción se cargará por institución desde la API.
export const CONFIG: InstitutionConfig = {
  platform: 'Aula Viva',
  name: 'Institución Demo',
  type: 'colegio',
  tagline: 'Clases en vivo, grabadas y organizadas por rol.',
  theme: { brand: '#5B8CFF', grad1: '#6D5CF6', grad2: '#4F8BF7' },
};
