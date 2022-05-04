//Components
import BackendLayout from '../../../components/BackendLayout'
import TeoriNav from '../../../components/TeoriNav'

export default function Teori({ subjects }) {
  console.log({ subjects })
  return (
    <>
    <BackendLayout>
      <TeoriNav />
    </BackendLayout>
    </>
  )
}
