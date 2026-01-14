import TennisBadge from "./TennisBadge"
import CalendarBadge from "./CalendarBadge";

interface TennisFixtureFilterHeadersProps {
    counts?: {
        all: number;
        live: number;
        finished: number;
        upcoming: number;
    }
}

const TennisFixtureFilterHeaders = ({ counts }: TennisFixtureFilterHeadersProps) => {
    const data = [
        { label: "all", count: counts?.all || 0 },
        { label: "live", count: counts?.live || 0 },
        { label: "finished", count: counts?.finished || 0 },
        { label: "upcoming", count: counts?.upcoming || 0 },
    ] as const;

    return (
        <div className='w-full mt-64 lg:mt-0 flex items-start justify-between gap-x-2 overflow-x-auto no-scrollbar'>
            <div className="hidden lg:flex items-center gap-x-2 flex-shrink-0">

                {
                    data.map((item, index) => (<TennisBadge totalNumber={item.count} label={item.label} key={index} />))
                }
            </div>
            <div className="hidden lg:flex flex-shrink-0">
                <CalendarBadge />
            </div>

        </div>
    )
}

export default TennisFixtureFilterHeaders
