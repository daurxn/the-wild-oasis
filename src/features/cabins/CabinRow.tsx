import { HiPencil, HiSquare2Stack, HiTrash } from 'react-icons/hi2'
import styled from 'styled-components'
import ConfirmDelete from '../../ui/ConfirmDelete.tsx'
import Menus from '../../ui/Menus.tsx'
import Modal from '../../ui/Modal.tsx'
import Table from '../../ui/Table.tsx'
import { formatCurrency } from '../../utils/helpers.ts'
import CreateCabinForm from './CreateCabinForm.tsx'
import type { Cabin } from './types'
import { useCreateCabin } from './useCreateCabin.ts'
import { useDeleteCabin } from './useDeleteCabin.ts'

const Img = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
`

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: 'Sono';
`

const Price = styled.div`
  font-family: 'Sono';
  font-weight: 600;
`

const Discount = styled.div`
  font-family: 'Sono';
  font-weight: 500;
  color: var(--color-green-700);
`

interface Props {
  cabin: Cabin
}

function CabinRow({ cabin }: Props) {
  const { isDeleting, deleteCabin } = useDeleteCabin()
  const { createCabin } = useCreateCabin()

  const {
    id: cabinId,
    name,
    max_capacity,
    regular_price,
    discount,
    description,
    image,
  } = cabin

  function handleDuplicate() {
    createCabin({
      name: `Copy of ${name}`,
      max_capacity,
      regular_price,
      discount,
      description,
      image,
    })
  }

  return (
    <Table.Row>
      <Img src={image} />
      <Cabin>{name}</Cabin>
      <div>Fits up to {max_capacity} guests</div>
      <Price>{formatCurrency(regular_price)}</Price>
      {discount ? (
        <Discount>{formatCurrency(discount)}</Discount>
      ) : (
        <span>&mdash;</span>
      )}

      <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={cabinId.toString()} />

            <Menus.List id={cabinId.toString()}>
              <Menus.Button icon={<HiSquare2Stack />} onClick={handleDuplicate}>
                Duplicate
              </Menus.Button>

              <Modal.Open opens="edit">
                <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
              </Modal.Open>

              <Modal.Open opens="delete">
                <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
              </Modal.Open>
            </Menus.List>

            <Modal.Window name="edit">
              <CreateCabinForm cabinToEdit={cabin} />
            </Modal.Window>
            <Modal.Window name="delete">
              <ConfirmDelete
                resourceName="cabins"
                disabled={isDeleting}
                onConfirm={() => deleteCabin(cabinId)}
                onCloseModal={close}
              />
            </Modal.Window>
          </Menus.Menu>
        </Modal>

        <Menus.Menu>
          <Menus.Toggle id={cabinId.toString()} />

          <Menus.List id={cabinId.toString()}>
            <Menus.Button icon={<HiSquare2Stack />} onClick={handleDuplicate}>
              Duplicate
            </Menus.Button>
            <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
            <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
          </Menus.List>
        </Menus.Menu>
      </div>
    </Table.Row>
  )
}

export default CabinRow
