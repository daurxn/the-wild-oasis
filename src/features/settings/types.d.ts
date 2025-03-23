export interface Settings {
  id: number
  created_at: string
  min_booking_length: number
  max_booking_length: number
  max_guests_per_booking: number
  breakfast_price: number
}

export type NewSettings = Omit<Settings, 'id' | 'created_at'>
