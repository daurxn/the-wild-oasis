import styled from 'styled-components'
import { createContext, useContext, useState } from 'react'
import { HiEllipsisVertical } from 'react-icons/hi2'
import { createPortal } from 'react-dom'
import { useOutsideClick } from '../hooks/useOutsideClick.ts'

const Menu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
  }
`

const StyledList = styled.ul<{ position: Position | null }>`
  position: fixed;

  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-md);

  right: ${({ position }) => position?.x}px;
  top: ${({ position }) => position?.y}px;
`

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.2rem 2.4rem;
  font-size: 1.4rem;
  transition: all 0.2s;

  display: flex;
  align-items: center;
  gap: 1.6rem;

  &:hover {
    background-color: var(--color-grey-50);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }
`

interface Position {
  x: number
  y: number
}

interface MenusContextValues {
  openId: string
  close: () => void
  open: (id: string) => void
  position: null | Position
  setPosition: (position: Position) => void
}

const MenusContext = createContext<MenusContextValues | undefined>(undefined)

function Menus({ children }: { children: React.ReactNode }) {
  const [openId, setOpenId] = useState('')
  const [position, setPosition] = useState<Position | null>(null)

  const close = () => setOpenId('')
  const open = setOpenId

  return (
    <MenusContext.Provider
      value={{ openId, close, open, position, setPosition }}
    >
      {children}
    </MenusContext.Provider>
  )
}

interface HasId {
  id: string
}

function Toggle({ id }: HasId) {
  const { openId, close, open, setPosition } = useContext(MenusContext)!

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()

    const targetButton =
      e.target instanceof Element ? e.target.closest('button') : null

    if (!targetButton) {
      console.warn('Click event not on a button')
      return
    }

    const rect = targetButton.getBoundingClientRect()
    setPosition({
      x: window.innerWidth - rect.width - rect.x,
      y: rect.y + rect.height + 8,
    })

    if (openId === '' || openId !== id) {
      open(id)
    } else {
      close()
    }
  }

  return (
    <StyledToggle onClick={handleClick}>
      <HiEllipsisVertical />
    </StyledToggle>
  )
}

function List({ id, children }: HasId & { children: React.ReactNode }) {
  const { openId, position, close } = useContext(MenusContext)!
  // const ref = useOutsideClick(close)
  const ref = useOutsideClick<HTMLUListElement>(close, false)

  if (openId !== id) return null

  return createPortal(
    <StyledList position={position} ref={ref}>
      {children}
    </StyledList>,
    document.body,
  )
}

interface ButtonProps {
  children: React.ReactNode
  icon: React.ReactNode
  onClick?: (...args: never[]) => void
  disabled?: boolean
}

function Button({ children, icon, onClick, disabled = false }: ButtonProps) {
  const { close } = useContext(MenusContext)!

  function handleClick() {
    onClick?.()
    close()
  }

  return (
    <li>
      <StyledButton onClick={handleClick} disabled={disabled}>
        {icon} <span>{children}</span>
      </StyledButton>
    </li>
  )
}

Menus.Menu = Menu
Menus.Toggle = Toggle
Menus.List = List
Menus.Button = Button

export default Menus
