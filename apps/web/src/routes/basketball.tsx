import ImportantUpdate from '@/shared/ImportantUpdate'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/basketball')({
  component: () => <div className='w-full space-y-4 pb-28'>
    <Outlet />
    <ImportantUpdate />
  </div>
})