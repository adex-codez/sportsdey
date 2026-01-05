import TennisPage from '@/components/tennis-section/TennisPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tennis/')({
  validateSearch: (search: Record<string, unknown>) => ({
    league: (search.league as string) || undefined,
  }),
  component: () => <div><TennisPage /></div>,
})


