import BasketballPage from '@/components/BasketballPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/basketball')({
  component: BasketballComponent,
})

function BasketballComponent() {
  return <div className='w-full'>
    <BasketballPage/>
  </div>
}
