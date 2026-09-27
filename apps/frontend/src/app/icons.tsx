const ICONS: Record<string, string> = {
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  cast: '<circle cx="12" cy="12" r="2.4"/><path d="M6 8a9 9 0 0 0 0 8M18 8a9 9 0 0 1 0 8M3.5 5.5a13 13 0 0 0 0 13M20.5 5.5a13 13 0 0 1 0 13"/>',
  chart: '<path d="M4 4v16h16"/><rect x="7.5" y="11" width="2.6" height="6" rx="1"/><rect x="12" y="7.5" width="2.6" height="9.5" rx="1"/><rect x="16.5" y="13" width="2.6" height="4" rx="1"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="16" rx="2.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/>',
  play: '<circle cx="12" cy="12" r="9"/><path d="M10 8.3l5.2 3.7-5.2 3.7z" fill="currentColor" stroke="none"/>',
  users: '<circle cx="9" cy="8" r="3.2"/><path d="M3.6 20a5.4 5.4 0 0 1 10.8 0"/><path d="M16 5.2a3.2 3.2 0 0 1 0 6M18 20a5.4 5.4 0 0 0-3-4.9"/>',
  book: '<path d="M5 4.6A1.6 1.6 0 0 1 6.6 3H19v15.4H6.6A1.6 1.6 0 0 0 5 20z"/><path d="M5 20a1.6 1.6 0 0 1 1.6-1.6H19"/>',
  folder: '<path d="M3.5 7.4A1.5 1.5 0 0 1 5 5.9h3.8l2 2.2H19a1.5 1.5 0 0 1 1.5 1.5v8.9A1.5 1.5 0 0 1 19 20H5a1.5 1.5 0 0 1-1.5-1.5z"/>',
  doc: '<path d="M6.5 3h7l4 4v14h-11z"/><path d="M13.5 3v4h4M9.5 12h5M9.5 16h5"/>',
  check: '<rect x="3.5" y="3.5" width="17" height="17" rx="3.5"/><path d="M8 12.4l2.6 2.6 5-5.6"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M4 7.5l8 5.5 8-5.5"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M12 2.6v2.2M12 19.2v2.2M21.4 12h-2.2M4.8 12H2.6M18.4 5.6l-1.5 1.5M7.1 16.9l-1.5 1.5M18.4 18.4l-1.5-1.5M7.1 7.1 5.6 5.6"/>',
  moon: '<path d="M20 14.6A8 8 0 1 1 9.4 4 6.5 6.5 0 0 0 20 14.6z"/>',
  logout: '<path d="M14 4H6.5A2.5 2.5 0 0 0 4 6.5v11A2.5 2.5 0 0 0 6.5 20H14"/><path d="M17 8.5l3.5 3.5-3.5 3.5M20.5 12H9.5"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20.5 20.5 16.5 16.5"/>',
  bell: '<path d="M6.5 9a5.5 5.5 0 0 1 11 0c0 4.5 2 5.6 2 5.6h-15S6.5 13.5 6.5 9z"/><path d="M10.2 19.5a2 2 0 0 0 3.6 0"/>',
};

export function Icon({ n }: { n: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: ICONS[n] || '' }} />
  );
}
