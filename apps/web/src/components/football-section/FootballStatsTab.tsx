"use client";

import { useEffect } from "react";
import type { FootballStatsResponse } from "@/types/football";

interface FootballStatsTabProps {
	stats?: FootballStatsResponse;
	isLoading?: boolean;
}

interface StatBarProps {
	label: string;
	homeValue: number;
	awayValue: number;
}

function StatBar({ label, homeValue, awayValue }: StatBarProps) {
	const total = homeValue + awayValue;
	const homePercentage = total > 0 ? (homeValue / total) * 100 : 50;
	const awayPercentage = total > 0 ? (awayValue / total) * 100 : 50;
	const hasValues = total > 0;

	return (
		<div className="border-gray-100 border-b py-3 last:border-b-0 dark:border-[#5A5F63]">
			<div className="mb-2 flex items-center justify-between">
				<span className="font-medium text-gray-600 text-xs dark:text-white">
					{homeValue}
				</span>
				<span className="font-semibold text-primary text-sm dark:text-white">
					{label}
				</span>
				<span className="font-medium text-gray-600 text-xs dark:text-white">
					{awayValue}
				</span>
			</div>
			<div className="flex items-center gap-1">
				<div className="flex h-2 flex-1 flex-row-reverse overflow-hidden rounded-full bg-gray-100">
					<div
						className={`h-full transition-all duration-300 ${hasValues ? "bg-[#1BAA04]" : ""}`}
						style={{ width: `${homePercentage}%` }}
					/>
				</div>
				<div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
					<div
						className={`h-full transition-all duration-300 ${hasValues ? "bg-[#1BAA04]" : ""}`}
						style={{ width: `${awayPercentage}%` }}
					/>
				</div>
			</div>
		</div>
	);
}

function FootballStatsTab({ stats, isLoading }: FootballStatsTabProps) {
	if (isLoading) {
		return (
			<div className="rounded-xl bg-white p-8 text-center dark:bg-card">
				<div className="animate-pulse space-y-4">
					<div className="mx-auto h-4 w-3/4 rounded bg-gray-200 dark:bg-card" />
					<div className="h-4 rounded bg-gray-200 dark:bg-card" />
					<div className="h-4 rounded bg-gray-200 dark:bg-card" />
					<div className="h-4 rounded bg-gray-200 dark:bg-card" />
				</div>
			</div>
		);
	}

	if (!stats) {
		return (
			<div className="rounded-xl border border-gray-100 bg-white p-8 text-center text-gray-400 italic dark:bg-card dark:text-white">
				Match statistics are not yet available.
			</div>
		);
	}

	const homeStats = stats.home.statistics;
	const awayStats = stats.away.statistics;

	return (
		<div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-0 dark:bg-card">
			<div className="border-gray-100 border-b bg-gray-50/50 px-6 py-4 dark:border-[#5A5F63] dark:bg-card">
				<h3 className="font-bold text-primary text-sm dark:text-white">
					Stats
				</h3>
			</div>

			<div className="px-6 py-2">
				<div className="flex items-center justify-between border-gray-100 border-b py-3 dark:border-[#5A5F63]">
					<span className="font-semibold text-primary text-sm dark:text-white">
						{stats.home.name}
					</span>
					<span className="font-semibold text-primary text-sm dark:text-white">
						{stats.away.name}
					</span>
				</div>
			</div>

			<div className="px-6 pb-4">
				<StatBar
					label="Yellow Cards"
					homeValue={homeStats.yellowCards}
					awayValue={awayStats.yellowCards}
				/>
				<StatBar
					label="Second Yellow Cards"
					homeValue={homeStats.secondYellowCards}
					awayValue={awayStats.secondYellowCards}
				/>
				<StatBar
					label="Red Cards"
					homeValue={homeStats.redCards}
					awayValue={awayStats.redCards}
				/>
			</div>
		</div>
	);
}

export default FootballStatsTab;
