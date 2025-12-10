"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import type { FilterType, MatchResult, TeamStanding } from '@/types/basketball'



interface StandingsTableProps {
  teams: TeamStanding[]
  className?: string
  onSeeAllClick?: () => void
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
    { id: "home", label: "Home" },
    { id: "away", label: "Away" },
    { id: "forms", label: "Forms" },
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

function ResultIndicator({ result }: { result: MatchResult }) {
  const colors = {
    W: "bg-[#4EAC31]",
    L: "bg-[#EB3343]",
    D: "bg-[#EF8031]",
  }

  return (
    <div
      className={cn(
        "w-[21px] h-[21px] rounded-full flex items-center justify-center text-[8px] md:text-xs font-medium text-white",
        colors[result],
      )}
    >
      {result}
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
  return (
    <div className="bg-white border-0 shadow-xs py-4 rounded-xl max-w-screen">
      <div className="overflow-x-auto max-w-[calc(100vw-2rem)] md:max-w-none">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-primary text-[10px]">
              <th className="text-center w-[50px] py-2 sticky left-0 bg-white z-20"></th>
              <th className="text-left py-2 pr-4 sticky left-[50px] bg-white z-20 font-medium text-xs shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Standings</th>
              <th className="text-center py-2 px-2 font-medium">P</th>
              <th className="text-center py-2 px-2 font-medium">W</th>
              <th className="text-center py-2 px-2 font-medium">L</th>
              <th className="text-center py-2 px-2 font-medium">Str</th>
              <th className="text-center py-2 px-2 font-medium">GB</th>
              <th className="text-center py-2 px-2 font-medium">DIFF</th>
              <th className="text-center py-2 px-2 font-medium">PCT</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr
                key={team.position}
                className={cn(
                  "border-t border-[#C8C8C8]",
                  team.isHighlighted ? "text-[#1F960C] bg-[#EDF6EB]" : "text-primary",
                )}
              >
                <td className={cn("text-center w-[50px] py-2.5 text-[11.92px] sticky left-0 z-10", team.isHighlighted ? "text-[#1F960C] bg-[#EDF6EB]" : "text-primary bg-white", [1, 2, 3].includes(team.position) ? "border-l-4 border-[#1BBD2A]" : [4, 5].includes(team.position) ? "border-l-4 border-[#E5A400]" : "")}>
                  {team.position}
                </td>
                <td className={cn("py-2.5 pr-4 font-medium text-[11.92px] whitespace-nowrap sticky left-[50px] z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]", team.isHighlighted ? "bg-[#EDF6EB]" : "bg-white")}>{team.name}</td>
                <td className="py-2.5 px-2 text-[10.21px] text-center">{team.played}</td>
                <td className="py-2.5 px-2 text-[10.21px] text-center">{team.wins}</td>
                <td className="py-2.5 px-2 text-[10.21px] text-center">{team.losses}</td>
                <td className="py-2.5 px-2 text-[10.21px] text-center">{team.streak}</td>
                <td className="py-2.5 px-2 text-[10.21px] text-center">{team.gamesBehind}</td>
                <td className="py-2.5 px-2 text-[10.21px] text-center">{team.diff}</td>
                <td className="py-2.5 px-2 text-[10.21px] text-center">{team.pct}</td>
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

function FormsView({
  teams,
  onSeeAllClick,
}: {
  teams: TeamStanding[]
  onSeeAllClick?: () => void
}) {
  return (
    <div className="w-full py-4">
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="border-b border-[#C8C8C8] py-4 px-4">
          <span className="text-xs font-medium text-primary">Last 5 Meetings</span>
        </div>
        <div className="divide-y divide-[#C8C8C8] w-full [divide]">
          {teams.map((team) => (
            <div key={team.position} className="flex items-center justify-between px-4 py-3">
              <span className={cn("text-[11.92px] font-medium", team.isHighlighted ? "text-[#1F960C]" : "text-primary")}>
                {team.name}
              </span>
              <div className="flex gap-1.5">
                {team.lastFiveResults?.map((result, index) => (
                  <ResultIndicator key={index} result={result} />
                ))}
              </div>
            </div>
          ))}
          {onSeeAllClick && (
            <button
              onClick={onSeeAllClick}
              className="w-full underline text-center text-[10px] cursor-pointer text-primary hover:text-primary py-3 mt-2"
            >
              See all forms
            </button>
          )}
        </div>
      </div>

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
  awayTeam
}: StandingsTableProps & {
  conference: 'western' | 'eastern'
  onConferenceChange: (conference: 'western' | 'eastern') => void
  homeTeam?: string
  awayTeam?: string
}) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all")

  // Helper to check if a team should be highlighted
  const isTeamHighlighted = (teamName: string) => {
    if (!homeTeam && !awayTeam) return false;
    return teamName === homeTeam || teamName === awayTeam;
  }

  // Enhance teams with highlighting before passing to views
  const enhancedTeams = teams.map(team => ({
    ...team,
    isHighlighted: isTeamHighlighted(team.name)
  }));

  return (
    <div className={cn("rounded-lg", className)}>
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

      {/* <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} /> */}

      {/* {activeFilter === "forms" ? (
        <FormsView teams={enhancedTeams} onSeeAllClick={onSeeAllClick} />
      ) : ( */}
      <StandingsView teams={enhancedTeams} onSeeAllClick={onSeeAllClick} />
      {/* )} */}
    </div>
  )
}

export default StandingsTab