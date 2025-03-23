import { getToday } from '../utils/helpers'
import supabase from './supabase'
import { Booking } from '../features/bookings/types'
import { PAGE_SIZE } from '../utils/constants.ts'

interface FetchBookingsParams {
  filter?: {
    field: string
    value: string
    method?: 'eq' | 'gte'
  } | null
  sortBy?: { field: string; direction: string }
  page?: number
}

export async function fetchBookings({
  filter,
  sortBy,
  page,
}: FetchBookingsParams) {
  let query = supabase
    .from('bookings')
    .select(
      'id, created_at, start_date, end_date, num_nights, num_guests, status, total_price, cabins(name), guests(full_name, email)',
      { count: 'exact' },
    )

  // FILTER
  if (filter) {
    query = query[filter.method ?? 'eq'](filter.field, filter.value)
  }

  // SORT
  if (sortBy) {
    query = query.order(sortBy.field, { ascending: sortBy.direction === 'asc' })
  }

  // PAGINATION
  if (page) {
    const from = (page - 1) * PAGE_SIZE
    const to = from + PAGE_SIZE - 1
    query = query.range(from, to)
  }

  const { data, error, count } = await query.overrideTypes<
    Array<Booking>,
    {
      merge: false
    }
  >()

  if (error) {
    console.error(error)
    throw new Error('Bookings could not be loaded')
  }

  return { data, count }
}

export async function getBooking(id: Booking['id']): Promise<Booking> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, cabins(*), guests(*)')
    .eq('id', id)
    .single()

  if (error) {
    console.error(error)
    throw new Error('Booking not found')
  }

  return data as Booking
}

// Returns all BOOKINGS that are were created after the given date. Useful to get bookings created in the last 30 days, for example.
export async function getBookingsAfterDate(date: string) {
  const { data, error } = await supabase
    .from('bookings')
    .select('created_at, total_price, extras_price')
    .gte('created_at', date)
    .lte('created_at', getToday({ end: true }))
    .overrideTypes<Array<Booking>, { merge: false }>()

  if (error) {
    console.error(error)
    throw new Error('Bookings could not get loaded')
  }

  return data
}

// Returns all STAYS that are were created after the given date
export async function getStaysAfterDate(date: string) {
  const { data, error } = await supabase
    .from('bookings')
    // .select('*')
    .select('*, guests(full_name)')
    .gte('start_date', date)
    .lte('start_date', getToday())
    .overrideTypes<Array<Booking>, { merge: false }>()

  if (error) {
    console.error(error)
    throw new Error('Bookings could not get loaded')
  }

  return data
}

// Activity means that there is a check in or a check out today
export async function getStaysTodayActivity() {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, guests(full_name, nationality, country_flag)')
    .or(
      `and(status.eq.unconfirmed,start_date.eq.${getToday()}),and(status.eq.checked-in,end_date.eq.${getToday()})`,
    )
    .order('created_at')
    .overrideTypes<Array<Booking>, { merge: false }>()

  // Equivalent to this. But by querying this, we only download the data we actually need, otherwise we would need ALL bookings ever created
  // (stay.status === 'unconfirmed' && isToday(new Date(stay.startDate))) ||
  // (stay.status === 'checked-in' && isToday(new Date(stay.endDate)))

  if (error) {
    console.error(error)
    throw new Error('Bookings could not get loaded')
  }
  return data
}

export async function updateBooking(id: number, obj: Partial<Booking>) {
  const { data, error } = await supabase
    .from('bookings')
    .update(obj)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error(error)
    throw new Error('Booking could not be updated')
  }
  return data
}

export async function deleteBooking(id: Booking['id']) {
  // REMEMBER RLS POLICIES
  const { data, error } = await supabase.from('bookings').delete().eq('id', id)

  if (error) {
    console.error(error)
    throw new Error('Booking could not be deleted')
  }
  return data
}
