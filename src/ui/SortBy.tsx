import Select from './Select.tsx'
import { useSearchParams } from 'react-router-dom'

interface Props<T> {
  options: { value: T; label: string }[]
}

function SortBy<T extends string>({ options }: Props<T>) {
  const [searchParams, setSearchParams] = useSearchParams()
  const currentSortBy = searchParams.get('sortBy') || ''

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    searchParams.set('sortBy', e.target.value)
    setSearchParams(searchParams)
  }

  return (
    <Select
      options={options}
      value={currentSortBy}
      type="white"
      onChange={handleChange}
    />
  )
}

export default SortBy
