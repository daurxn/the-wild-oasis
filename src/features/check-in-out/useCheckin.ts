import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateBooking } from '../../services/apiBookings.ts'
import type { Booking } from '../bookings/types'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

export function useCheckin() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { mutate: checkin, isPending: isCheckingIn } = useMutation({
    mutationFn: ({
      bookingId,
      breakfast,
    }: {
      bookingId: Booking['id']
      breakfast?: Partial<Booking>
    }) =>
      updateBooking(bookingId, {
        status: 'checked-in',
        is_paid: true,
        ...breakfast,
      }),
    onSuccess: data => {
      toast.success(`Booking #${data.id} successfully checked in`)
      queryClient.invalidateQueries({ refetchType: 'active' })
      navigate('/')
    },
    onError: () => {
      toast.error('There was an error while checking in')
    },
  })

  return { checkin, isCheckingIn }
}
