import TennisPage from '@/components/tennis-section/TennisPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tennis/')({
  component: () => <div><TennisPage/></div>,
})


