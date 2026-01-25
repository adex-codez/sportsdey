import { cn } from "@/lib/utils";

interface TennisPlayerScore {
	name: string;
	periodScores: (number | string)[];
	pts?: string | number;
	s?: string | number;
}

interface TennisScoreTableProps {
	players: TennisPlayerScore[];
	className?: string;
}

const TennisScoreTable = ({ players, className }: TennisScoreTableProps) => {
	return (
		<div
			className={cn("w-full overflow-hidden rounded-lg bg-white", className)}
		>
			<div className="w-full max-w-[calc(100vw-2rem)] overflow-x-auto md:max-w-none">
				<table className="w-full min-w-[300px] text-sm">
					<thead>
						<tr className="border-[#C8C8C8] border-b">
							<th className="w-1/2 px-4 py-4 pr-8 text-left font-semibold text-primary">
								Players
							</th>
							<th className="px-3 py-4 text-center font-semibold text-primary">
								1
							</th>
							<th className="px-3 py-4 text-center font-semibold text-primary">
								2
							</th>
							<th className="px-3 py-4 text-center font-semibold text-primary">
								3
							</th>
							<th className="px-3 py-4 text-center font-semibold text-primary">
								4
							</th>
							<th className="px-3 py-4 text-center font-semibold text-primary">
								5
							</th>
							<th className="px-3 py-4 text-center font-semibold text-primary">
								PTS
							</th>
							<th className="px-3 py-4 text-center font-semibold text-primary">
								S
							</th>
						</tr>
					</thead>
					<tbody>
						{players.map((player, idx) => (
							<tr
								key={idx}
								className={cn(
									"border-[#E5E5E5] border-b last:border-b-0",
									idx % 2 === 0 ? "bg-white" : "bg-white",
								)}
							>
								<td className="whitespace-nowrap px-4 py-4 text-left font-medium text-primary">
									{player.name}
								</td>
								{player.periodScores.map((score, sIdx) => (
									<td
										key={sIdx}
										className="px-3 py-4 text-center font-medium text-primary"
									>
										{score}
									</td>
								))}

								{Array.from({ length: 5 - player.periodScores.length }).map(
									(_, i) => (
										<td key={`empty-${i}`} className="px-3 py-4 text-center" />
									),
								)}
								<td className="px-3 py-4 text-center font-medium text-primary">
									{player.pts}
								</td>
								<td className="px-3 py-4 text-center font-medium text-primary">
									{player.s}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default TennisScoreTable;
