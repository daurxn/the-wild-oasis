import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createEditCabin } from '../../services/apiCabins.ts'
import toast from 'react-hot-toast'

export function useCreateCabin() {
  const queryClient = useQueryClient()
  const { mutate, isPending } = useMutation({
    mutationFn: createEditCabin,
    onSuccess: () => {
      toast.success('New cabin successfully created')
      queryClient.invalidateQueries({
        queryKey: ['cabins'],
      })
      // reset()
    },
    onError: err => toast.error(err.message),
  })

  return { createCabin: mutate, isCreating: isPending }
}
