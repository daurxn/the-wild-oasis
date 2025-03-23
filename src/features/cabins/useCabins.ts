import { useQuery } from '@tanstack/react-query'
import { fetchCabins } from '../../services/apiCabins.ts'

export function useCabins() {
  const {
    isLoading,
    data: cabins,
    error,
  } = useQuery({
    queryKey: ['cabins'],
    queryFn: fetchCabins,
  })

  return { isLoading, error, cabins }
}
