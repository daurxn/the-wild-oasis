import supabase, { supabaseUrl } from './supabase.ts'

interface SignupParams {
  full_name: string
  email: string
  password: string
}

export async function signup({ full_name, email, password }: SignupParams) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name, avatar: '' } },
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

interface LoginParams {
  email: string
  password: string
}

export async function login({ email, password }: LoginParams) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession()

  if (!session.session) return null

  const { data, error } = await supabase.auth.getUser()

  if (error) throw new Error(error.message)

  return data.user
}

export async function logout() {
  const { error } = await supabase.auth.signOut()

  if (error) throw new Error(error.message)
}

interface UpdateCurrentUserParams {
  password?: string
  full_name?: string
  avatar?: File | null
}

export async function updateCurrentUser({
  password,
  full_name,
  avatar,
}: UpdateCurrentUserParams) {
  // 1. Update password OR full_name
  const updateData: {
    password?: string
    data?: {
      full_name?: string
    }
  } = {}

  if (password) updateData.password = password
  if (full_name) updateData.data = { full_name }

  const { data, error } = await supabase.auth.updateUser(updateData)

  if (error) throw new Error(error.message)
  if (!avatar) return data

  // 2. Upload the avatar image
  const fileName = `avatar-${data.user?.id}-${Math.random()}`

  const { error: storageError } = await supabase.storage
    .from('avatars')
    .upload(fileName, avatar)

  if (storageError) throw new Error(storageError.message)

  // 3. Update avatar in the user
  const { data: updatedUser, error: error2 } = await supabase.auth.updateUser({
    data: {
      avatar: `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`,
    },
  })

  if (error2) throw new Error(error2.message)

  return updatedUser
}
