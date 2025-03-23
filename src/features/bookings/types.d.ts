import { Cabin } from '../cabins/types'
import { Guest } from '../../entities/guest/types'

export interface Booking {
  id: number
  created_at: string
  cabin_price: number
  start_date: string
  end_date: string
  has_breakfast: boolean
  num_nights: number
  num_guests: number
  status: 'unconfirmed' | 'checked-in' | 'checked-out'
  total_price: number
  observations: string | null
  is_paid: boolean
  extras_price: number
  cabin_id: Cabin['id']
  guest_id: Guest['id']
  cabins: Pick<Cabin, 'name' | 'regular_price'>
  guests: Pick<
    Guest,
    'email' | 'full_name' | 'country_flag' | 'nationality' | 'national_id'
  >
}
