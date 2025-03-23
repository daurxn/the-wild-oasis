import supabase, { supabaseUrl } from './supabase.ts'
import { Cabin } from '../features/cabins/types'

export async function fetchCabins(): Promise<Cabin[]> {
  const { data, error } = await supabase.from('cabins').select('*')

  if (error) {
    console.error(error)
    throw new Error('Cabins could not be loaded')
  }

  return data
}

export async function createEditCabin(
  newCabin: Omit<Cabin, 'id' | 'created_at' | 'image'> & {
    image: File | string
  },
  id?: Cabin['id'],
) {
  // Check if this is an edit with an existing image path
  const hasImagePath =
    typeof newCabin.image === 'string' &&
    (newCabin.image as string).startsWith(supabaseUrl)

  // Prepare image data based on type
  let imageName = ''
  let imagePath = ''

  if (hasImagePath) {
    // For edits with existing image, use the existing path
    imagePath = newCabin.image as string
  } else {
    // For new uploads, create a new path
    imageName = `${Math.random()}-${(newCabin.image as File).name.replaceAll('/', '')}`
    imagePath = `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`
  }

  // 1. Create/edit cabin
  let data

  // A) CREATE
  if (!id) {
    const { data: createdCabin, error } = await supabase
      .from('cabins')
      .insert([{ ...newCabin, image: imagePath }])
      .select()
      .single()

    if (error) {
      console.error(error)
      throw new Error('Cabin could not be created')
    }

    data = createdCabin
  }

  // B) EDIT
  if (id) {
    const { data: updatedCabin, error } = await supabase
      .from('cabins')
      .update({ ...newCabin, image: imagePath })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error(error)
      throw new Error('Cabin could not be updated')
    }

    data = updatedCabin
  }

  // 2. Upload image - only if it's a File and not a path string
  if (!hasImagePath) {
    const { error: storageError } = await supabase.storage
      .from('cabin-images')
      .upload(imageName, newCabin.image as File)

    // 3. Delete the cabin IF there was an error uploading image
    if (storageError) {
      await supabase.from('cabins').delete().eq('id', data?.id)
      console.error(storageError)
      throw new Error(
        'Cabin image could not be uploaded and the cabin was not created',
      )
    }
  }

  return data
}

export async function deleteCabin(id: Cabin['id']) {
  const { data, error } = await supabase.from('cabins').delete().eq('id', id)

  if (error) {
    console.error(error)
    throw new Error('Cabin could not be deleted')
  }

  return data
}
