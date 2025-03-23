import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateBooking } from '../../services/apiBookings.ts'
import type { Booking } from '../bookings/types'
import toast from 'react-hot-toast'

export function useCheckout() {
  const queryClient = useQueryClient()

  const { mutate: checkout, isPending: isCheckingOut } = useMutation({
    mutationFn: (bookingId: Booking['id']) =>
      updateBooking(bookingId, {
        status: 'checked-out',
      }),
    onSuccess: data => {
      toast.success(`Booking #${data.id} successfully checked out`)
      queryClient.invalidateQueries({ refetchType: 'active' })
    },
    onError: () => {
      toast.error('There was an error while checking out')
    },
  })

  return { checkout, isCheckingOut }
}
