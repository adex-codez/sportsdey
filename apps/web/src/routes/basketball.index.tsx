import BasketballPage from '@/components/BasketballPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/basketball/')({
  component: () => <BasketballPage />
})