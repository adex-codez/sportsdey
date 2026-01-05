"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import type { FilterType, TeamStanding } from '@/types/basketball'
import { StandingsSkeleton } from "./StandingsSkeleton"



interface StandingsTableProps {
  teams: TeamStanding[]
  className?: string
  onSeeAllClick?: () => void
  isLoading?: boolean
}

function FilterTabs({
  activeFilter,
  onFilterChange,
}: {
  activeFilter: FilterType
  onFilterChange: (filter: FilterType) => void
}) {
  const filters: { id: FilterType; label: string }[] = [
    { id: "all", label: "All" },
  ]

  return (
    <div className="flex mb-4 gap-x-3">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={cn(
            "w-[73px] cursor-pointer md:w-[146px] h-10 rounded-full text-sm font-medium transition-colors",
            activeFilter === filter.id ? "bg-[#1BAA04] text-white" : "bg-white text-primary",
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}

function StandingsView({
  teams,
  onSeeAllClick,
}: {
  teams: TeamStanding[]
  onSeeAllClick?: () => void
}) {
  const hasData = (key: keyof TeamStanding) => {
    return teams.some(team => {
      const val = team[key];
      return val !== undefined && val !== null && val !== "";
    });
  };

  const showP = hasData('played');
  const showW = hasData('wins');
  const showL = hasData('losses');
  const showStr = hasData('streak');
  const showGB = hasData('gamesBehind');
  const showDiff = hasData('diff');
  const showPct = hasData('pct');

  return (
    <div className="bg-white border-0 shadow-xs py-4 rounded-xl max-w-screen">
      <div className="overflow-x-auto max-w-[calc(100vw-2rem)] md:max-w-none no-scrollbar">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-primary text-[10px]">
              <th className="text-center w-[50px] py-2 sticky left-0 bg-white z-20"></th>
              <th className="text-left py-2 pr-4 sticky left-[50px] bg-white z-20 font-medium text-xs shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Standings</th>
              {showP && <th className="text-center py-2 px-2 font-medium">P</th>}
              {showW && <th className="text-center py-2 px-2 font-medium">W</th>}
              {showL && <th className="text-center py-2 px-2 font-medium">L</th>}
              {showStr && <th className="text-center py-2 px-2 font-medium">Str</th>}
              {showGB && <th className="text-center py-2 px-2 font-medium">GB</th>}
              {showDiff && <th className="text-center py-2 px-2 font-medium">DIFF</th>}
              {showPct && <th className="text-center py-2 px-2 font-medium">PCT</th>}
            </tr>
          </thead>
          <tbody>
            {teams.map((team, index) => (
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
                  [1, 2, 3].includes(index + 1) ? "border-l-4 border-[#1BBD2A]" : [4, 5].includes(index + 1) ? "border-l-4 border-[#E5A400]" : ""
                )}>
                  {index + 1}
                </td>
                <td className={cn(
                  "py-2.5 pr-4 font-medium text-[11.92px] whitespace-nowrap sticky left-[50px] z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]",
                  team.isHighlighted ? "text-[#1BAA04] bg-[#EDF6EB]" : "text-primary bg-white"
                )}>
                  {team.name}
                </td>
                {showP && <td className={cn("py-2.5 px-2 text-[10.21px] text-center", team.isHighlighted ? "text-[#1BAA04]" : "text-primary")}>{team.played}</td>}
                {showW && <td className={cn("py-2.5 px-2 text-[10.21px] text-center", team.isHighlighted ? "text-[#1BAA04]" : "text-primary")}>{team.wins}</td>}
                {showL && <td className={cn("py-2.5 px-2 text-[10.21px] text-center", team.isHighlighted ? "text-[#1BAA04]" : "text-primary")}>{team.losses}</td>}
                {showStr && <td className={cn("py-2.5 px-2 text-[10.21px] text-center", team.isHighlighted ? "text-[#1BAA04]" : "text-primary")}>{team.streak}</td>}
                {showGB && <td className={cn("py-2.5 px-2 text-[10.21px] text-center", team.isHighlighted ? "text-[#1BAA04]" : "text-primary")}>{team.gamesBehind}</td>}
                {showDiff && <td className={cn("py-2.5 px-2 text-[10.21px] text-center", team.isHighlighted ? "text-[#1BAA04]" : "text-primary")}>{team.diff}</td>}
                {showPct && <td className={cn("py-2.5 px-2 text-[10.21px] text-center", team.isHighlighted ? "text-[#1BAA04]" : "text-primary")}>{team.pct}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {onSeeAllClick && (
        <button
          onClick={onSeeAllClick}
          className="w-full text-center text-[10px] underline cursor-pointer text-primary hover:text-primary py-3 mt-2"
        >
          See all Standings
        </button>
      )}
    </div>
  )
}

function StandingsTab({
  teams,
  className,
  onSeeAllClick,
  conference,
  onConferenceChange,
  homeTeam,
  awayTeam,
  hideConference,
  isLoading
}: StandingsTableProps & {
  conference: 'western' | 'eastern'
  onConferenceChange: (conference: 'western' | 'eastern') => void
  homeTeam?: string
  awayTeam?: string
  hideConference?: boolean
}) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all")

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
        <StandingsSkeleton />
      </div>
    );
  }

  return (
    <div className={cn("rounded-lg", className)}>
      {/* {!hideConference && (
        <div className="flex gap-x-3 mb-4">
          <button
            onClick={() => onConferenceChange('western')}
            className={cn(
              "px-4 py-2 rounded-full text-xs font-medium transition-colors border",
              conference === 'western'
                ? "bg-[#1BAA04] text-white border-[#1BAA04]"
                : "bg-white text-primary border-gray-200 hover:bg-gray-50"
            )}
          >
            Western Conference
          </button>
          <button
            onClick={() => onConferenceChange('eastern')}
            className={cn(
              "px-4 py-2 rounded-full text-xs font-medium transition-colors border",
              conference === 'eastern'
                ? "bg-[#1BAA04] text-white border-[#1BAA04]"
                : "bg-white text-primary border-gray-200 hover:bg-gray-50"
            )}
          >
            Eastern Conference
          </button>
        </div>
      )} */}

      <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      <StandingsView teams={enhancedTeams} onSeeAllClick={onSeeAllClick} />
    </div>
  )
}

export default StandingsTab