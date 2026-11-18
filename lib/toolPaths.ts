import type { Lang } from './lang';

export type Tool = 'cheque' | 'weekends' | 'alerts';

const BASE: Record<Tool, string> = {
  cheque: '/cheque-clearing-date',
  weekends: '/long-weekends',
  alerts: '/alerts',
};

export function toolPath(lang: Lang, tool: Tool, extra = ''): string {
  const pre = lang === 'hi' ? '/hi' : '';
  const path = `${pre}${BASE[tool]}${extra ? '/' + extra : ''}`;
  return path;
}

export function toolsHome(lang: Lang): string {
  return lang === 'hi' ? '/hi#tools' : '/#tools';
}
