import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/tennis')({
  component: () => <div className='w-full space-y-4'>
    <Outlet />
  </div>
})