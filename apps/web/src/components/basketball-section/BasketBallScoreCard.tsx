import type { QuarterScoreTableProps } from "@/types/basketball";

const BasketBallScoreCard = ({
	team1,
	team2,
	quarters,
}: QuarterScoreTableProps) => {
	const isTeam1Winner = team1.total > team2.total;
	const isTeam2Winner = team1.total < team2.total;
	return (
		<div className="w-full overflow-hidden rounded-xl border-0 bg-white">
			<div className="flex w-full items-center justify-between border-gray-200 border-b px-4 py-2">
				<div className="w-full">
					<span className="font-semibold text-primary text-sm">Scoring</span>
				</div>
				<div className="flex gap-x-4">
					{quarters.map((q) => (
						<span
							key={q.id}
							className="w-4 text-center font-semibold text-primary text-xs md:w-10 lg:w-14"
						>
							{q.label}
						</span>
					))}
					<span className="w-8 text-center font-semibold text-primary text-xs md:w-10 lg:w-14">
						T
					</span>
				</div>
			</div>

			<div className="flex items-center justify-between bg-white px-4 py-3 text-[11px]">
				<div className="flex items-center gap-3">
					<span className="font-medium text-[11px] text-primary">
						{team1.name}
					</span>
				</div>
				<div className="flex gap-4">
					{team1.quarterScores.map((score, idx) => (
						<span
							key={idx}
							className="w-4 text-center text-primary text-xs md:w-10 lg:w-14"
						>
							{score}
						</span>
					))}
					<span
						className={`text-primary text-xs ${isTeam1Winner ? "font-bold" : "font-normal"} w-8 text-center md:w-10 lg:w-14`}
					>
						{team1.total}
					</span>
				</div>
			</div>

			<div className="flex items-center justify-between bg-white px-4 py-3 text-[11px]">
				<div className="flex items-center gap-3">
					<span className="font-medium text-primary">{team2.name}</span>
				</div>
				<div className="flex gap-4">
					{team2.quarterScores.map((score, idx) => (
						<span
							key={idx}
							className="w-4 text-center text-primary text-xs md:w-10 lg:w-14"
						>
							{score}
						</span>
					))}
					<span
						className={`text-primary text-xs ${isTeam2Winner ? "font-bold" : "font-normal"} w-8 text-center md:w-10 lg:w-14`}
					>
						{team2.total}
					</span>
				</div>
			</div>
		</div>
	);
};

export default BasketBallScoreCard;
