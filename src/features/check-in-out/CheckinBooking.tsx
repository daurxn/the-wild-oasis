import styled from 'styled-components'
import BookingDataBox from '../../features/bookings/BookingDataBox'

import Row from '../../ui/Row'
import Heading from '../../ui/Heading'
import ButtonGroup from '../../ui/ButtonGroup'
import Button from '../../ui/Button'
import ButtonText from '../../ui/ButtonText'

import { useMoveBack } from '../../hooks/useMoveBack'
import { useBooking } from '../bookings/useBooking.ts'
import Spinner from '../../ui/Spinner.tsx'
import { useEffect, useState } from 'react'
import Checkbox from '../../ui/Checkbox.tsx'
import { formatCurrency } from '../../utils/helpers.ts'
import { useCheckin } from './useCheckin.ts'
import { useSettings } from '../settings/useSettings.ts'

const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`

function CheckinBooking() {
  const [confirmPaid, setConfirmPaid] = useState(false)
  const [addBreakfast, setAddBreakfast] = useState(false)

  const moveBack = useMoveBack()
  const { booking, isLoading } = useBooking()
  const { checkin, isCheckingIn } = useCheckin()
  const { settings, isLoading: isLoadingSettings } = useSettings()

  useEffect(() => {
    setConfirmPaid(booking?.is_paid ?? false)
  }, [booking?.is_paid])

  if (isLoading || isLoadingSettings) {
    return <Spinner />
  }

  if (!booking) return null

  const {
    id: bookingId,
    guests,
    total_price,
    num_guests,
    has_breakfast,
    num_nights,
  } = booking

  const optionalBreakfastPrice = settings
    ? settings.breakfast_price * num_nights * num_guests
    : 0

  function handleCheckin() {
    if (!confirmPaid) return

    if (addBreakfast) {
      checkin({
        bookingId,
        breakfast: {
          has_breakfast: true,
          extras_price: optionalBreakfastPrice,
          total_price: total_price + optionalBreakfastPrice,
        },
      })
    } else {
      checkin({ bookingId })
    }
  }

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Check in booking #{bookingId}</Heading>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      {!has_breakfast && (
        <Box>
          <Checkbox
            checked={addBreakfast}
            onChange={() => {
              setAddBreakfast(add => !add)
              setConfirmPaid(false)
            }}
            id="breakfast"
          >
            Want to add breakfast for {formatCurrency(optionalBreakfastPrice)}?
          </Checkbox>
        </Box>
      )}

      <Box>
        <Checkbox
          checked={confirmPaid}
          onChange={() => setConfirmPaid(confirmed => !confirmed)}
          id="confirm"
          disabled={confirmPaid || isCheckingIn}
        >
          I confirm that {guests.full_name} has paid the total amount of{' '}
          {!addBreakfast
            ? formatCurrency(total_price)
            : `${formatCurrency(total_price + optionalBreakfastPrice)} (${formatCurrency(total_price)} + ${formatCurrency(optionalBreakfastPrice)})`}
        </Checkbox>
      </Box>

      <ButtonGroup>
        <Button onClick={handleCheckin} disabled={!confirmPaid || isCheckingIn}>
          Check in booking #{bookingId}
        </Button>
        <Button variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  )
}

export default CheckinBooking
