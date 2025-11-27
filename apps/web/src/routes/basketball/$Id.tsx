import BasketBallDetailsPage from '@/components/basketball-section/BasketBallDetailsPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/basketball/$Id')({
  component: RouteComponent,
})

function RouteComponent() {
    const {Id} = Route.useParams()
  return <div><BasketBallDetailsPage/></div>
}
