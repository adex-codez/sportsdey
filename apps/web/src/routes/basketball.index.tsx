import BasketballPage from '@/components/BasketballPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/basketball/')({
  validateSearch: (search: Record<string, unknown>) => ({
    league: (search.league as string) || undefined,
  }),
  component: () => <BasketballPage />
})