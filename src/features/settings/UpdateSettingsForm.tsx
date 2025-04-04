import Form from '../../ui/Form'
import FormRow from '../../ui/FormRow'
import Input from '../../ui/Input'
import { useSettings } from './useSettings.ts'
import Spinner from '../../ui/Spinner.tsx'
import { useUpdateSetting } from './useUpdateSetting.ts'
import type { NewSettings } from './types'

function UpdateSettingsForm() {
  const { isLoading, settings } = useSettings()

  const {
    min_booking_length,
    max_booking_length,
    max_guests_per_booking,
    breakfast_price,
  } = settings ?? {}
  const { isUpdating, updateSetting } = useUpdateSetting()

  if (isLoading) {
    return <Spinner />
  }

  function handleUpdate(
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof NewSettings,
  ) {
    const { value } = e.target

    if (!value) {
      return
    }

    updateSetting({ [key]: value })
  }

  return (
    <Form>
      <FormRow label="Minimum nights/booking">
        <Input
          type="number"
          id="min-nights"
          defaultValue={min_booking_length}
          disabled={isUpdating}
          onBlur={e => handleUpdate(e, 'min_booking_length')}
        />
      </FormRow>
      <FormRow label="Maximum nights/booking">
        <Input
          type="number"
          id="max-nights"
          defaultValue={max_booking_length}
          disabled={isUpdating}
          onBlur={e => handleUpdate(e, 'max_booking_length')}
        />
      </FormRow>
      <FormRow label="Maximum guests/booking">
        <Input
          type="number"
          id="max-guests"
          defaultValue={max_guests_per_booking}
          disabled={isUpdating}
          onBlur={e => handleUpdate(e, 'max_guests_per_booking')}
        />
      </FormRow>
      <FormRow label="Breakfast price">
        <Input
          type="number"
          id="breakfast-price"
          defaultValue={breakfast_price}
          disabled={isUpdating}
          onBlur={e => handleUpdate(e, 'breakfast_price')}
        />
      </FormRow>
    </Form>
  )
}

export default UpdateSettingsForm
