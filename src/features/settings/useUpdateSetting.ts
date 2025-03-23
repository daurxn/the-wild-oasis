import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { updateSetting as updateSettingApi } from '../../services/apiSettings.ts'

export function useUpdateSetting() {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: updateSettingApi,
    onSuccess: () => {
      toast.success('Setting successfully edited')
      queryClient.invalidateQueries({
        queryKey: ['settings'],
      })
    },
    onError: err => toast.error(err.message),
  })

  return { updateSetting: mutate, isUpdating: isPending }
}
