"use client"

import type { FootballStatsResponse } from '@/types/football'

interface FootballStatsTabProps {
    stats?: FootballStatsResponse['data']
    isLoading?: boolean
}

interface StatBarProps {
    label: string
    homeValue: number
    awayValue: number
}

function StatBar({ label, homeValue, awayValue }: StatBarProps) {
    const total = homeValue + awayValue;
    const homePercentage = total > 0 ? (homeValue / total) * 100 : 50;
    const awayPercentage = total > 0 ? (awayValue / total) * 100 : 50;

    return (
        <div className="py-3 border-b border-gray-100 last:border-b-0">
            <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-600 font-medium">{homeValue}</span>
                <span className="text-sm font-semibold text-primary">{label}</span>
                <span className="text-xs text-gray-600 font-medium">{awayValue}</span>
            </div>
            <div className="flex items-center gap-1">
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden flex flex-row-reverse">
                    <div
                        className="h-full bg-[#1BAA04] transition-all duration-300"
                        style={{ width: `${homePercentage}%` }}
                    />
                </div>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[#1BAA04] transition-all duration-300"
                        style={{ width: `${awayPercentage}%` }}
                    />
                </div>
            </div>
        </div>
    );
}

function FootballStatsTab({ stats, isLoading }: FootballStatsTabProps) {
    console.log({ stats });
    if (isLoading) {
        return (
            <div className="bg-white rounded-xl p-8 text-center">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="bg-white rounded-xl p-8 text-center text-gray-400 italic border border-gray-100">
                Match statistics are not yet available.
            </div>
        );
    }

    const homeStats = stats.home.statistics;
    const awayStats = stats.away.statistics;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50/50 border-b border-gray-100">
                <h3 className="font-bold text-sm text-primary">Stats</h3>
            </div>

            <div className="px-6 py-2">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="text-sm font-semibold text-primary">{stats.home.name}</span>
                    <span className="text-sm font-semibold text-primary">{stats.away.name}</span>
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

export default FootballStatsTab
