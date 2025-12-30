const avatarColors: Record<string, string> = {
  A: '#ef4444',
  B: '#f97316',
  C: '#f59e0b',
  D: '#84cc16',
  E: '#22c55e',
  F: '#14b8a6',
  G: '#06b6d4',
  H: '#0ea5e9',
  I: '#3b82f6',
  J: '#6366f1',
  K: '#8b5cf6',
  L: '#d946ef',
  M: '#ec4899',
  N: '#f43f5e',
  O: '#e11d48',
  P: '#be123c',
  Q: '#881337',
  R: '#4f46e5',
  S: '#1d4ed8',
  T: '#0f766e',
  U: '#0284c7',
  V: '#0ea5e9',
  W: '#14b8a6',
  X: '#65a30d',
  Y: '#ca8a04',
  Z: '#e11d48',
};

export const getAvatarColor = (name: string) => {
  const first = name?.trim()?.[0]?.toUpperCase();
  return avatarColors[first] || '#64748b';
};
