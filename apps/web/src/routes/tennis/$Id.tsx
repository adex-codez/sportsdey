import { createFileRoute } from '@tanstack/react-router'
import TennisDetailsPage from '@/components/tennis-section/TennisDetailsPage'

export const Route = createFileRoute('/tennis/$Id')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      country: (search.country as string) || undefined,
    }
  },
})

function RouteComponent() {
  return <div><TennisDetailsPage /></div>
}
