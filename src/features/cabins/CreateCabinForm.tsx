import { SubmitErrorHandler, SubmitHandler, useForm } from 'react-hook-form'
import type { Cabin } from './types'
import Input from '../../ui/Input'
import Form from '../../ui/Form'
import Button from '../../ui/Button'
import FileInput from '../../ui/FileInput'
import Textarea from '../../ui/Textarea'
import FormRow from '../../ui/FormRow.tsx'
import { useCreateCabin } from './useCreateCabin.ts'
import { useEditCabin } from './useEditCabin.ts'

interface FormValues {
  name: string
  maxCapacity: number
  regularPrice: number
  discount: number
  description: string
  image: string | FileList
}

interface Props {
  cabinToEdit?: Cabin
  onCloseModal?: () => void
}

function CreateCabinForm({ cabinToEdit, onCloseModal }: Props) {
  const { createCabin, isCreating } = useCreateCabin()
  const { editCabin, isEditing } = useEditCabin()
  const isEditSession = Boolean(cabinToEdit)
  const isWorking = isCreating || isEditing

  const { register, handleSubmit, reset, getValues, formState } =
    useForm<FormValues>({
      defaultValues: cabinToEdit
        ? {
            name: cabinToEdit.name,
            maxCapacity: cabinToEdit.max_capacity,
            regularPrice: cabinToEdit.regular_price,
            discount: cabinToEdit.discount,
            description: cabinToEdit.description,
            image: cabinToEdit.image,
          }
        : {},
    })
  const { errors } = formState

  const onSubmit: SubmitHandler<FormValues> = function (data) {
    const image = typeof data.image === 'string' ? data.image : data.image[0]

    if (isEditSession) {
      editCabin(
        {
          newCabinData: {
            name: data.name,
            max_capacity: data.maxCapacity,
            regular_price: data.regularPrice,
            discount: data.discount,
            description: data.description,
            image,
          },
          id: cabinToEdit!.id,
        },
        {
          onSuccess: () => {
            reset()
            onCloseModal?.()
          },
        },
      )
    } else {
      createCabin(
        {
          name: data.name,
          max_capacity: data.maxCapacity,
          regular_price: data.regularPrice,
          discount: data.discount,
          description: data.description,
          image,
        },
        {
          onSuccess: () => {
            reset()
            onCloseModal?.()
          },
        },
      )
    }
  }

  const onError: SubmitErrorHandler<FormValues> = function (errors) {
    console.log(errors)
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? 'modal' : 'regular'}
    >
      <FormRow label="Cabin name" error={errors.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isWorking}
          {...register('name', { required: 'This field is required' })}
        />
      </FormRow>

      <FormRow label="Maximum capacity" error={errors.maxCapacity?.message}>
        <Input
          type="number"
          id="maxCapacity"
          disabled={isWorking}
          {...register('maxCapacity', {
            required: 'This field is required',
            min: {
              value: 1,
              message: 'Capacity should be at least 1',
            },
          })}
        />
      </FormRow>

      <FormRow label="Regular price" error={errors.regularPrice?.message}>
        <Input
          type="number"
          id="regularPrice"
          disabled={isWorking}
          {...register('regularPrice', {
            required: 'This field is required',
            min: {
              value: 1,
              message: 'Capacity should be at least 1',
            },
          })}
        />
      </FormRow>

      <FormRow label="Discount" error={errors.discount?.message}>
        <Input
          type="number"
          id="discount"
          defaultValue={0}
          disabled={isWorking}
          {...register('discount', {
            required: 'This field is required',
            validate: value =>
              Number(value) <= Number(getValues().regularPrice) ||
              'Discount should be less than regular price',
          })}
        />
      </FormRow>

      <FormRow
        label="Description for website"
        error={errors.description?.message}
      >
        <Textarea
          id="description"
          defaultValue=""
          disabled={isWorking}
          {...register('description', { required: 'This field is required' })}
        />
      </FormRow>

      <FormRow label="Cabin photo">
        <FileInput
          id="image"
          accept="image/*"
          disabled={isWorking}
          {...register('image', {
            required: isEditSession ? false : 'This field is required',
          })}
        />
      </FormRow>

      <FormRow>
        <>
          {/* type is an HTML attribute! */}
          <Button
            variation="secondary"
            type="reset"
            onClick={() => onCloseModal?.()}
          >
            Cancel
          </Button>
          <Button disabled={isWorking}>
            {isEditSession ? 'Edit cabin' : 'Create new cabin'}
          </Button>
        </>
      </FormRow>
    </Form>
  )
}

export default CreateCabinForm
