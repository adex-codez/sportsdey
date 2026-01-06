"use client"

import { cn } from "@/lib/utils"
import type { FootballStanding } from '@/types/football'
import { getTeamLogo, getTeamInitials } from '@/utils/getTeamLogo'
import { useState } from 'react'

interface FootballStandingsTabProps {
    teams: FootballStanding[]
    className?: string
    homeTeam?: string
    awayTeam?: string
    isLoading?: boolean
}

function StandingsView({
    teams,
}: {
    teams: FootballStanding[]
}) {
    return (
        <div className="bg-white border-0 shadow-xs py-4 rounded-xl max-w-screen">
            <div className="overflow-x-auto max-w-[calc(100vw-2rem)] md:max-w-none no-scrollbar">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-primary text-[10px]">
                            <th className="text-center w-[50px] py-2 sticky left-0 bg-white z-20"></th>
                            <th className="text-left py-2 pr-4 sticky left-[50px] bg-white z-20 font-medium text-xs shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Standings</th>
                            <th className="text-center py-2 px-2 font-medium">P</th>
                            <th className="text-center py-2 px-2 font-medium">W</th>
                            <th className="text-center py-2 px-2 font-medium">D</th>
                            <th className="text-center py-2 px-2 font-medium">L</th>
                            <th className="text-center py-2 px-2 font-medium">GD</th>
                            <th className="text-center py-2 px-2 font-medium">PTS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teams.map((team, index) => {
                            const [logoError, setLogoError] = useState(false);
                            const logoUrl = getTeamLogo(team.name);

                            return (
                                <tr
                                    key={index}
                                    className={cn(
                                        "border-t border-[#C8C8C8]",
                                        team.isHighlighted ? "bg-[#EDF6EB]" : "bg-white",
                                    )}
                                >
                                    <td className={cn(
                                        "text-center w-[50px] py-2.5 text-[11.92px] sticky left-0 z-10",
                                        team.isHighlighted ? "text-[#1BAA04] bg-[#EDF6EB]" : "text-primary bg-white",
                                        [1, 2, 3, 4].includes(team.position) ? "border-l-4 border-[#1BBD2A]" : [5, 6].includes(team.position) ? "border-l-4 border-[#E5A400]" : ""
                                    )}>
                                        {team.position}
                                    </td>
                                    <td className={cn(
                                        "py-2.5 pr-4 font-medium text-[11.92px] whitespace-nowrap sticky left-[50px] z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]",
                                        team.isHighlighted ? "text-[#1BAA04] bg-[#EDF6EB]" : "text-primary bg-white"
                                    )}>
                                        <div className="flex items-center gap-2">
                                            {!logoError && logoUrl !== "/Profile.png" ? (
                                                <img
                                                    src={logoUrl}
                                                    alt={team.name}
                                                    className="size-6 object-contain"
                                                    onError={() => setLogoError(true)}
                                                />
                                            ) : (
                                                <div className="size-6 rounded-full bg-gray-100 flex items-center justify-center text-[9px] font-bold text-gray-400 border border-gray-200">
                                                    {getTeamInitials(team.name)}
                                                </div>
                                            )}
                                            <span>{team.name}</span>
                                        </div>
                                    </td>
                                    <td className={cn("py-2.5 px-2 text-[10.21px] text-center", team.isHighlighted ? "text-[#1BAA04]" : "text-primary")}>{team.statistics.P}</td>
                                    <td className={cn("py-2.5 px-2 text-[10.21px] text-center", team.isHighlighted ? "text-[#1BAA04]" : "text-primary")}>{team.statistics.W}</td>
                                    <td className={cn("py-2.5 px-2 text-[10.21px] text-center", team.isHighlighted ? "text-[#1BAA04]" : "text-primary")}>{team.statistics.D}</td>
                                    <td className={cn("py-2.5 px-2 text-[10.21px] text-center", team.isHighlighted ? "text-[#1BAA04]" : "text-primary")}>{team.statistics.L}</td>
                                    <td className={cn("py-2.5 px-2 text-[10.21px] text-center", team.isHighlighted ? "text-[#1BAA04]" : "text-primary")}>{team.statistics.GD}</td>
                                    <td className={cn("py-2.5 px-2 text-[10.21px] text-center", team.isHighlighted ? "text-[#1BAA04]" : "text-primary")}>{team.statistics.PTS}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function FootballStandingsTab({
    teams,
    className,
    homeTeam,
    awayTeam,
    isLoading
}: FootballStandingsTabProps) {
    const isTeamHighlighted = (teamName: string) => {
        if (!homeTeam && !awayTeam) return false;
        return teamName === homeTeam || teamName === awayTeam;
    }

    const enhancedTeams = teams.map(team => ({
        ...team,
        isHighlighted: isTeamHighlighted(team.name)
    }));

    if (isLoading) {
        return (
            <div className={cn("rounded-lg", className)}>
                <div className="bg-white rounded-xl p-8 text-center">
                    <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!teams || teams.length === 0) {
        return (
            <div className={cn("rounded-lg", className)}>
                <div className="bg-white rounded-xl p-8 text-center text-gray-400 italic">
                    No standings data available.
                </div>
            </div>
        );
    }

    return (
        <div className={cn("rounded-lg", className)}>
            <StandingsView teams={enhancedTeams} />
        </div>
    )
}

export default FootballStandingsTab
