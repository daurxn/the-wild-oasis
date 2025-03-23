import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchBookings } from '../../services/apiBookings.ts'
import { useSearchParams } from 'react-router-dom'
import { PAGE_SIZE } from '../../utils/constants.ts'

export function useBookings() {
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()

  // FILTER
  const filterValue = searchParams.get('status')
  const filter =
    !filterValue || filterValue === 'all'
      ? null
      : {
          field: 'status',
          value: filterValue,
        }

  // SORT
  const sortByRaw = searchParams.get('sortBy') || 'start_date-desc'
  const [field, direction] = sortByRaw.split('-')
  const sortBy = { field, direction }

  // PAGINATION
  const page = !searchParams.get('page') ? 1 : Number(searchParams.get('page'))

  const { isLoading, data, error } = useQuery({
    queryKey: ['bookings', filter, sortBy, page],
    queryFn: () => fetchBookings({ filter, sortBy, page }),
  })

  const { data: bookings, count } = data
    ? {
        ...data,
        count: data.count ?? 0,
      }
    : { data: [], count: 0 }

  // PREFETCH
  const pageCount = Math.ceil(count / PAGE_SIZE)

  console.log(pageCount)

  if (page < pageCount) {
    queryClient.prefetchQuery({
      queryKey: ['bookings', filter, sortBy, page + 1],
      queryFn: () => fetchBookings({ filter, sortBy, page: page + 1 }),
    })
  }

  if (page > 1) {
    queryClient.prefetchQuery({
      queryKey: ['bookings', filter, sortBy, page - 1],
      queryFn: () => fetchBookings({ filter, sortBy, page: page - 1 }),
    })
  }

  return { isLoading, error, bookings, count }
}
