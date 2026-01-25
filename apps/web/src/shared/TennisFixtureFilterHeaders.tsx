import CalendarBadge from "./CalendarBadge";
import TennisBadge from "./TennisBadge";

interface TennisFixtureFilterHeadersProps {
	counts?: {
		all: number;
		live: number;
		finished: number;
		upcoming: number;
	};
}

const TennisFixtureFilterHeaders = ({
	counts,
}: TennisFixtureFilterHeadersProps) => {
	const data = [
		{ label: "all", count: counts?.all || 0 },
		{ label: "live", count: counts?.live || 0 },
		{ label: "finished", count: counts?.finished || 0 },
		{ label: "upcoming", count: counts?.upcoming || 0 },
	] as const;

	return (
		<div className="no-scrollbar mt-64 flex w-full items-start justify-between gap-x-2 overflow-x-auto lg:mt-0">
			<div className="hidden flex-shrink-0 items-center gap-x-2 lg:flex">
				{data.map((item, index) => (
					<TennisBadge
						totalNumber={item.count}
						label={item.label}
						key={index}
					/>
				))}
			</div>
			<div className="hidden flex-shrink-0 lg:flex">
				<CalendarBadge />
			</div>
		</div>
	);
};

export default TennisFixtureFilterHeaders;
