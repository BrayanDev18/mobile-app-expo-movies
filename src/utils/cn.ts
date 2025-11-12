export const cn = (...classes: (string | undefined | boolean | null)[]) =>
  classes.filter(Boolean).join(' ');
