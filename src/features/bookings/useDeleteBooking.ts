import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteBooking as deleteBookingApi } from '../../services/apiBookings'
import toast from 'react-hot-toast'

export function useDeleteBooking() {
  const queryClient = useQueryClient()

  const { isPending, mutate } = useMutation({
    mutationFn: deleteBookingApi,
    onSuccess: () => {
      toast.success('Booking successfully deleted')

      queryClient.invalidateQueries({
        queryKey: ['bookings'],
      })
    },
    onError: err => toast.error(err.message),
  })

  return { isDeleting: isPending, deleteBooking: mutate }
}
