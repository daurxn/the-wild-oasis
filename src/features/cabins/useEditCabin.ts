import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Cabin } from './types'
import { createEditCabin } from '../../services/apiCabins.ts'
import toast from 'react-hot-toast'

export function useEditCabin() {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      newCabinData,
      id,
    }: {
      newCabinData: Parameters<typeof createEditCabin>[0]
      id: Cabin['id']
    }) => createEditCabin(newCabinData, id),
    onSuccess: () => {
      toast.success('Cabin successfully edited')
      queryClient.invalidateQueries({
        queryKey: ['cabins'],
      })
    },
    onError: err => toast.error(err.message),
  })

  return { editCabin: mutate, isEditing: isPending }
}
