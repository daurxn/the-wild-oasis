import styled from 'styled-components'

const StyledSelect = styled.select<{ type: string }>`
  font-size: 1.4rem;
  padding: 0.8rem 1.2rem;
  border: 1px solid
    ${props =>
      props.type === 'white'
        ? 'var(--color-grey-100)'
        : 'var(--color-grey-300)'};
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-0);
  font-weight: 500;
  box-shadow: var(--shadow-sm);
`

interface Props<T> {
  options: { value: T; label: string }[]
  value: T
  type: string
  onChange: (newValue: React.ChangeEvent<HTMLSelectElement>) => void
}

function Select<T extends string>({
  options,
  value,
  type,
  onChange,
}: Props<T>) {
  return (
    <StyledSelect value={value} onChange={onChange} type={type}>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </StyledSelect>
  )
}

export default Select
