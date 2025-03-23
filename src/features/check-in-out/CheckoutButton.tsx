import Button from '../../ui/Button'
import type { Booking } from '../bookings/types'
import { useCheckout } from './useCheckout.ts'

function CheckoutButton({ bookingId }: { bookingId: Booking['id'] }) {
  const { checkout, isCheckingOut } = useCheckout()

  return (
    <Button
      variation="primary"
      size="small"
      onClick={() => checkout(bookingId)}
      disabled={isCheckingOut}
    >
      Check out
    </Button>
  )
}

export default CheckoutButton
