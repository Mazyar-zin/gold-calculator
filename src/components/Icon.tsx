import type { ReactNode } from 'react'

type IconName = 'calculator' | 'history' | 'settings' | 'refresh' | 'trash' | 'chevron' | 'spark' | 'percent' | 'menu' | 'close' | 'chart' | 'swap' | 'compare' | 'download' | 'wifiOff' | 'check'

export function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  }

  const paths: Record<IconName, ReactNode> = {
    calculator: <><rect x="5" y="2.5" width="14" height="19" rx="3"/><path d="M8 6.5h8M8 11h2M14 11h2M8 15h2M14 15h2M8 19h2M14 19h2"/></>,
    history: <><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 4v4h4M12 7v5l3 2"/></>,
    settings: <><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21h-4v-.1A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3v-4h.1A1.7 1.7 0 0 0 4.6 8.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3h4v.1A1.7 1.7 0 0 0 15.4 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.4.3.74.62 1 .99.25.34.4.76.4 1.11v1.8c0 .35-.15.77-.4 1.11-.26.37-.6.7-1 .99Z"/></>,
    refresh: <><path d="M20 11a8 8 0 1 0-2.34 5.66"/><path d="M20 5v6h-6"/></>,
    trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"/></>,
    chevron: <path d="m9 18 6-6-6-6"/>,
    spark: <><path d="m12 3 1.4 4.1L17.5 8.5l-4.1 1.4L12 14l-1.4-4.1-4.1-1.4 4.1-1.4L12 3Z"/><path d="m18 14 .8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8L18 14Z"/></>,
    percent: <><path d="M19 5 5 19"/><circle cx="7.5" cy="7.5" r="2.2"/><circle cx="16.5" cy="16.5" r="2.2"/></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
    chart: <><path d="M4 19V5M4 19h16"/><path d="m7 15 4-4 3 2 4-6"/></>,
    swap: <><path d="M7 7h11l-3-3M17 17H6l3 3"/></>,
    compare: <><path d="M8 5v14M16 5v14M4 9h8M12 15h8"/></>,
    download: <><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></>,
    wifiOff: <><path d="m3 3 18 18"/><path d="M8.5 8.5A9 9 0 0 1 21 10"/><path d="M3 10a14 14 0 0 1 3.2-2.2"/><path d="M5.5 14a9 9 0 0 1 6.5-2.7c1 0 2 .2 2.9.5"/><path d="M8.5 17.5a5 5 0 0 1 5.2-1.2"/><circle cx="12" cy="20" r=".8" fill="currentColor" stroke="none"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
  }

  return <svg {...common}>{paths[name]}</svg>
}
