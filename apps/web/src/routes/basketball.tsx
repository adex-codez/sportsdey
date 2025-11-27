import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/basketball')({
  component: () => <div className='w-full'><Outlet /></div>
})