import ButtonIcon from '../../ui/ButtonIcon.tsx'
import { HiArrowRightOnRectangle } from 'react-icons/hi2'
import { useLogout } from './useLogout.ts'
import SpinnerMini from '../../ui/SpinnerMini.tsx'

function Logout() {
  const { logout, isPending } = useLogout()

  return (
    <ButtonIcon disabled={isPending} onClick={() => logout()}>
      {!isPending ? <HiArrowRightOnRectangle /> : <SpinnerMini />}
    </ButtonIcon>
  )
}

export default Logout
