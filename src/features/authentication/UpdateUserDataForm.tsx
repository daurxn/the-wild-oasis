import { useState } from 'react'

import Button from '../../ui/Button'
import FileInput from '../../ui/FileInput'
import Form from '../../ui/Form'
import FormRow from '../../ui/FormRow'
import Input from '../../ui/Input'

import { useUser } from './useUser'
import { useUpdateUser } from './useUpdateUser.ts'

function UpdateUserDataForm() {
  // We don't need the loading state, and can immediately use the user data, because we know that it has already been loaded at this point

  const { user } = useUser()
  const {
    email,
    user_metadata: { full_name: currentFullName },
  } = user!

  const { updateUser, isUpdating } = useUpdateUser()

  const [fullName, setFullName] = useState(currentFullName)
  const [avatar, setAvatar] = useState<File | null>(null)

  if (!user) return null

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!fullName) return

    updateUser(
      { full_name: fullName, avatar },
      {
        onSuccess: () => {
          setAvatar(null)
          const form = e.target as HTMLFormElement
          form.reset()
        },
      },
    )
  }

  function handleCancel() {
    setFullName(currentFullName)
    setAvatar(null)
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormRow label="Email address">
        <Input value={email} disabled />
      </FormRow>
      <FormRow label="Full name">
        <Input
          type="text"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          id="fullName"
          disabled={isUpdating}
        />
      </FormRow>
      <FormRow label="Avatar image">
        <FileInput
          id="avatar"
          accept="image/*"
          onChange={e => e.target.files && setAvatar(e.target.files[0])}
          disabled={isUpdating}
        />
      </FormRow>
      <FormRow>
        <div>
          <Button
            disabled={isUpdating}
            onClick={handleCancel}
            type="reset"
            variation="secondary"
          >
            Cancel
          </Button>
          <Button disabled={isUpdating}>Update account</Button>
        </div>
      </FormRow>
    </Form>
  )
}

export default UpdateUserDataForm
