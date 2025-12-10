import Badge from "./Badge"
import CalendarBadge from "./CalendarBadge";

interface FixtureFilterHeadersProps {
  counts?: {
    all: number;
    live: number;
    finished: number;
    upcoming: number;
  }
}

const FixtureFilterHeaders = ({ counts }: FixtureFilterHeadersProps) => {
  const data = [
    { label: "all", count: counts?.all || 0 },
    { label: "live", count: counts?.live || 0 },
    { label: "finished", count: counts?.finished || 0 },
    { label: "upcoming", count: counts?.upcoming || 0 },
  ] as const;

  return (
    <div className='w-full mt-64 lg:mt-0 flex items-start justify-between gap-x-2 '>
      <div className="hidden lg:flex items-center gap-x-2">

        {
          data.map((item, index) => (<Badge totalNumber={item.count} label={item.label} key={index} />))
        }
      </div>
      <div className="hidden lg:flex">
        <CalendarBadge />
      </div>

    </div>
  )
}

export default FixtureFilterHeaders