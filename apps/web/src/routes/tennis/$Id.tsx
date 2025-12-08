import { createFileRoute } from '@tanstack/react-router'
import TennisDetailsPage from '@/components/tennis-section/TennisDetailsPage'

export const Route = createFileRoute('/tennis/$Id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div><TennisDetailsPage /></div>
}
