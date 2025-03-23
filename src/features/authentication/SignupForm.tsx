import Button from '../../ui/Button'
import Form from '../../ui/Form'
import FormRow from '../../ui/FormRow'
import Input from '../../ui/Input'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useSignup } from './useSignup.ts'

interface FormValues {
  full_name: string
  email: string
  password: string
  passwordConfirm: string
}

function SignupForm() {
  const { register, formState, getValues, handleSubmit, reset } =
    useForm<FormValues>()
  const { errors } = formState
  const { signup, isPending } = useSignup()

  const onSubmit: SubmitHandler<FormValues> = function ({
    full_name,
    email,
    password,
  }) {
    signup({ full_name, email, password }, { onSettled: () => reset() })
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow label="Full name" error={errors.full_name?.message}>
        <Input
          type="text"
          id="full_name"
          disabled={isPending}
          {...register('full_name', { required: 'This field is required' })}
        />
      </FormRow>

      <FormRow label="Email address" error={errors.email?.message}>
        <Input
          type="email"
          id="email"
          disabled={isPending}
          {...register('email', {
            required: 'This field is required',
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: 'Please provide a valid email address',
            },
          })}
        />
      </FormRow>

      <FormRow
        label="Password (min 8 characters)"
        error={errors.password?.message}
      >
        <Input
          type="password"
          id="password"
          disabled={isPending}
          {...register('password', {
            required: 'This field is required',
            minLength: { value: 8, message: 'Password needs a minimum of 8 ' },
          })}
        />
      </FormRow>

      <FormRow label="Repeat password" error={errors.passwordConfirm?.message}>
        <Input
          type="password"
          id="passwordConfirm"
          disabled={isPending}
          {...register('passwordConfirm', {
            required: 'This field is required',
            validate: value =>
              value === getValues().password || 'Passwords need to match',
          })}
        />
      </FormRow>

      <FormRow>
        <div>
          <Button
            variation="secondary"
            type="reset"
            disabled={isPending}
            onClick={() => reset()}
          >
            Cancel
          </Button>
          <Button>Create new user</Button>
        </div>
      </FormRow>
    </Form>
  )
}

export default SignupForm
