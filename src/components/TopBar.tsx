import type { ReactNode } from 'react'
import { Icon } from './Icon'

interface Props {
  title: string
  onMenu: () => void
  action?: ReactNode
}

export function TopBar({ title, onMenu, action }: Props) {
  return (
    <header className="topbar">
      <button className="menu-button" type="button" onClick={onMenu} aria-label="باز کردن منو">
        <Icon name="menu" size={21} />
      </button>

      <h1>{title}</h1>

      <div className="topbar-action">
        {action ?? <span className="topbar-spacer" />}
      </div>
    </header>
  )
}
