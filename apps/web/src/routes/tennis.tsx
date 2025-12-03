import FixtureFilterHeaders from '@/shared/FixtureFilterHeaders'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/tennis')({
  component: () => <div className='w-full space-y-4'>
    <div className='hidden w-full lg:block'>
        <FixtureFilterHeaders/>
      </div>
    <Outlet />
    </div>
})