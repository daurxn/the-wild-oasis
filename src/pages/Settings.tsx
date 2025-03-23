import Heading from '../ui/Heading'
import Row from '../ui/Row.tsx'
import UpdateSettingsForm from '../features/settings/UpdateSettingsForm.tsx'

function Settings() {
  return (
    <Row>
      <Heading as="h1">Update hotel settings</Heading>
      <UpdateSettingsForm />
    </Row>
  )
}

export default Settings
