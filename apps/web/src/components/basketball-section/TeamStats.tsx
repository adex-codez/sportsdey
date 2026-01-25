import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface Player {
	name: string;
	number: string;
	pts: number;
	fg: string;
	threePt: string;
	ft: string;
	reb: number;
	ast: number;
	to: number;
	stl: number;
	blk: number;
	oreb: number;
	dreb: number;
	pf: number;
	min: string | number;
	plusMinus: number;
}

interface TeamTotals {
	pts: number;
	fg: string;
	threePt: string;
	ft: string;
	reb: number;
	ast: number;
	to: number;
	stl: number;
	blk: number;
	oreb: number;
	dreb: number;
	pf: number;
	min: string | number;
	fgPct: number;
	threePtPct: number;
	ftPct: number;
}

export interface TeamStatsData {
	teamName: string;
	teamLogo?: string;
	starters: Player[];
	bench: Player[];
	totals: TeamTotals;
}

interface TeamStatsProps {
	teams: TeamStatsData[];
	className?: string;
	isLoading?: boolean;
}

const statColumns = [
	{ key: "pts", label: "PTS" },
	{ key: "fg", label: "FG" },
	{ key: "threePt", label: "3PT" },
	{ key: "ft", label: "FT" },
	{ key: "reb", label: "REB" },
	{ key: "ast", label: "AST" },
	{ key: "to", label: "TO" },
	{ key: "stl", label: "STL" },
	{ key: "blk", label: "BLK" },
	{ key: "oreb", label: "OREB" },
	{ key: "dreb", label: "DREB" },
	{ key: "pf", label: "PF" },
	{ key: "min", label: "MIN" },
	{ key: "plusMinus", label: "+/-" },
];

function PlayerRow({ player }: { player: Player }) {
	return (
		<tr className="border-[#C8C8C8] border-b transition-colors hover:bg-gray-300/50">
			<td className="sticky left-0 z-10 border-[#C8C8C8] border-r bg-white px-3 py-2 text-left shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
				<span className="text-[11px] text-primary">{player.name}</span>
				<span className="ml-2 text-[11px] text-primary">#{player.number}</span>
			</td>
			<td className="px-2 py-2 text-center text-[11px] text-primary">
				{player.pts}
			</td>
			<td className="px-2 py-2 text-center text-[11px] text-primary">
				{player.fg}
			</td>
			<td className="px-2 py-2 text-center text-[11px] text-primary">
				{player.threePt}
			</td>
			<td className="px-2 py-2 text-center text-[11px] text-primary">
				{player.ft}
			</td>
			<td className="px-2 py-2 text-center text-[11px] text-primary">
				{player.reb}
			</td>
			<td className="px-2 py-2 text-center text-[11px] text-primary">
				{player.ast}
			</td>
			<td className="px-2 py-2 text-center text-[11px] text-primary">
				{player.to}
			</td>
			<td className="px-2 py-2 text-center text-[11px] text-primary">
				{player.stl}
			</td>
			<td className="px-2 py-2 text-center text-[11px] text-primary">
				{player.blk}
			</td>
			<td className="px-2 py-2 text-center text-[11px] text-primary">
				{player.oreb}
			</td>
			<td className="px-2 py-2 text-center text-[11px] text-primary">
				{player.dreb}
			</td>
			<td className="px-2 py-2 text-center text-[11px] text-primary">
				{player.pf}
			</td>
			<td className="px-2 py-2 text-center text-[11px] text-primary">
				{player.min}
			</td>
			<td
				className={cn(
					"px-2 py-2 text-center text-[11px]",
					player.plusMinus > 0
						? "text-emerald-400"
						: player.plusMinus < 0
							? "text-red-400"
							: "text-primary",
				)}
			>
				{player.plusMinus > 0 ? `+${player.plusMinus}` : player.plusMinus}
			</td>
		</tr>
	);
}

function SectionHeader({ title }: { title: string }) {
	return (
		<tr className="border-[#C8C8C8] border-t border-b bg-white">
			<td className="sticky left-0 z-10 border-[#C8C8C8] border-r bg-white px-3 py-2 text-left font-semibold text-primary text-xs">
				{title}
			</td>
			{statColumns.map((col) => (
				<td
					key={col.key}
					className="px-2 py-2 text-center font-semibold text-[10px] text-primary"
				>
					{col.label}
				</td>
			))}
		</tr>
	);
}

function TeamTotalsRow({ totals }: { totals: TeamTotals }) {
	return (
		<>
			<tr className="bg-white font-semibold">
				<td className="sticky left-0 z-10 border-[#C8C8C8] border-r bg-white px-3 py-2 text-left text-primary text-xs shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
					TEAM
				</td>
				<td className="px-2 py-2 text-center font-semibold text-[10px]">
					{totals.pts}
				</td>
				<td className="px-2 py-2 text-center text-[10px] text-primary">
					{totals.fg}
				</td>
				<td className="px-2 py-2 text-center text-[10px] text-primary">
					{totals.threePt}
				</td>
				<td className="px-2 py-2 text-center text-[10px] text-primary">
					{totals.ft}
				</td>
				<td className="px-2 py-2 text-center text-[10px] text-primary">
					{totals.reb}
				</td>
				<td className="px-2 py-2 text-center text-[10px] text-primary">
					{totals.ast}
				</td>
				<td className="px-2 py-2 text-center text-[10px] text-primary">
					{totals.to}
				</td>
				<td className="px-2 py-2 text-center text-[10px] text-primary">
					{totals.stl}
				</td>
				<td className="px-2 py-2 text-center text-[10px] text-primary">
					{totals.blk}
				</td>
				<td className="px-2 py-2 text-center text-[10px] text-primary">
					{totals.oreb}
				</td>
				<td className="px-2 py-2 text-center text-[10px] text-primary">
					{totals.dreb}
				</td>
				<td className="px-2 py-2 text-center text-[10px] text-primary">
					{totals.pf}
				</td>
				<td className="px-2 py-2 text-center text-[10px] text-primary">
					{totals.min}
				</td>
				<td className="px-2 py-2 text-center text-[10px] text-primary">-</td>
			</tr>
			<tr className="border-[#C8C8C8] border-b font-semibold">
				<td className="sticky left-0 z-10 border-[#C8C8C8] border-r bg-white px-3 py-2 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]" />
				<td className="px-2 py-2" />
				<td className="px-2 py-2 text-center text-[10px]">{totals.fgPct}%</td>
				<td className="px-2 py-2 text-center text-[10px]">
					{totals.threePtPct}%
				</td>
				<td className="px-2 py-2 text-center text-[10px]">{totals.ftPct}%</td>
				<td colSpan={10} />
			</tr>
		</>
	);
}

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

export function TeamStats({ teams, className, isLoading }: TeamStatsProps) {
	if (isLoading) {
		return (
			<div className={cn("space-y-4 rounded-lg bg-white p-4", className)}>
				<Skeleton className="h-6 w-32 bg-gray-100" />
				<div className="space-y-3">
					{[1, 2].map((i) => (
						<div
							key={i}
							className="space-y-3 rounded-lg border border-[#C8C8C8] p-4"
						>
							<div className="flex items-center gap-2">
								<Skeleton className="h-6 w-6 rounded-full bg-gray-100" />
								<Skeleton className="h-4 w-40 bg-gray-100" />
							</div>
							<Skeleton className="h-32 w-full bg-gray-100" />
						</div>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className={cn("rounded-lg bg-white", className)}>
			<h2 className="border-b border-b-[#C8C8C8] px-2 py-3 font-semibold text-primary text-sm">
				Team stats
			</h2>
			<Accordion type="multiple" className="w-full">
				{teams.map((team, idx) => (
					<AccordionItem
						key={idx}
						value={`item-${idx}`}
						className="border-[#C8C8C8] border-b"
					>
						<AccordionTrigger
							className="px-3 py-3 hover:bg-gray-50 hover:no-underline"
							isCollapsible={true}
						>
							<div className="flex items-center gap-x-2">
								{team.teamLogo && (
									<img
										src={team.teamLogo || "/placeholder.svg"}
										alt={team.teamName}
										className="h-6 w-6 object-contain"
									/>
								)}
								<h3 className="font-semibold text-primary text-sm">
									{team.teamName}
								</h3>
							</div>
						</AccordionTrigger>
						<AccordionContent>
							<div className="max-w-[calc(100vw-2rem)] overflow-x-auto pb-4 md:max-w-none">
								<table className="w-full text-sm">
									<tbody>
										<SectionHeader title="Starters" />
										{team.starters.map((player, idx) => (
											<PlayerRow key={`starter-${idx}`} player={player} />
										))}
										<SectionHeader title="Bench" />
										{team.bench.map((player, idx) => (
											<PlayerRow key={`bench-${idx}`} player={player} />
										))}
										<TeamTotalsRow totals={team.totals} />
									</tbody>
								</table>
							</div>
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
			<p className="mt-2 px-3 py-2 text-xs text-zinc-500">
				+/- denotes team&apos;s net points while the player is on the court
			</p>
		</div>
	);
}
