import Heading from '../ui/Heading'
import Row from '../ui/Row'
import DashboardLayout from '../features/dashboard/DashboardLayout.tsx'
import DashboardFilter from '../features/dashboard/DashboardFilter.tsx'

function Dashboard() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Dashboard</Heading>
        <DashboardFilter />
      </Row>
      <DashboardLayout />
    </>
  )
}

export default Dashboard
