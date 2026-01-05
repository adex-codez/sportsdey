import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface Player {
  name: string
  number: string
  pts: number
  fg: string
  threePt: string
  ft: string
  reb: number
  ast: number
  to: number
  stl: number
  blk: number
  oreb: number
  dreb: number
  pf: number
  min: string | number
  plusMinus: number
}

interface TeamTotals {
  pts: number
  fg: string
  threePt: string
  ft: string
  reb: number
  ast: number
  to: number
  stl: number
  blk: number
  oreb: number
  dreb: number
  pf: number
  min: string | number
  fgPct: number
  threePtPct: number
  ftPct: number
}

export interface TeamStatsData {
  teamName: string
  teamLogo?: string
  starters: Player[]
  bench: Player[]
  totals: TeamTotals
}

interface TeamStatsProps {
  teams: TeamStatsData[]
  className?: string
  isLoading?: boolean
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
]


function PlayerRow({ player }: { player: Player }) {
  return (
    <tr className="border-b border-[#C8C8C8] hover:bg-gray-300/50 transition-colors">
      <td className="py-2 px-3 text-left border-r border-[#C8C8C8] sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
        <span className="text-primary text-[11px]">{player.name}</span>
        <span className="ml-2 text-primary text-[11px]">#{player.number}</span>
      </td>
      <td className="py-2 px-2 text-center text-primary text-[11px]">{player.pts}</td>
      <td className="py-2 px-2 text-center text-primary text-[11px]">{player.fg}</td>
      <td className="py-2 px-2 text-center text-primary text-[11px]">{player.threePt}</td>
      <td className="py-2 px-2 text-center text-primary text-[11px]">{player.ft}</td>
      <td className="py-2 px-2 text-center text-primary text-[11px]">{player.reb}</td>
      <td className="py-2 px-2 text-center text-primary text-[11px]">{player.ast}</td>
      <td className="py-2 px-2 text-center text-primary text-[11px]">{player.to}</td>
      <td className="py-2 px-2 text-center text-primary text-[11px]">{player.stl}</td>
      <td className="py-2 px-2 text-center text-primary text-[11px]">{player.blk}</td>
      <td className="py-2 px-2 text-center text-primary text-[11px]">{player.oreb}</td>
      <td className="py-2 px-2 text-center text-primary text-[11px]">{player.dreb}</td>
      <td className="py-2 px-2 text-center text-primary text-[11px]">{player.pf}</td>
      <td className="py-2 px-2 text-center text-primary text-[11px]">{player.min}</td>
      <td
        className={cn(
          "py-2 px-2 text-center text-[11px]",
          player.plusMinus > 0 ? "text-emerald-400" : player.plusMinus < 0 ? "text-red-400" : "text-primary",
        )}
      >
        {player.plusMinus > 0 ? `+${player.plusMinus}` : player.plusMinus}
      </td>
    </tr>
  )
}

function SectionHeader({ title }: { title: string }) {
  return (
    <tr className="bg-white border-b border-t border-[#C8C8C8]">
      <td className="py-2 px-3 text-left font-semibold text-primary border-r border-[#C8C8C8] text-xs sticky left-0 bg-white z-10">{title}</td>
      {statColumns.map((col) => (
        <td key={col.key} className="py-2 px-2 text-center text-primary text-[10px] font-semibold">
          {col.label}
        </td>
      ))}
    </tr>
  )
}

function TeamTotalsRow({ totals }: { totals: TeamTotals }) {
  return (
    <>
      <tr className="bg-white font-semibold">
        <td className="py-2 px-3 text-left text-primary border-r border-[#C8C8C8] text-xs sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">TEAM</td>
        <td className="py-2 px-2 text-center font-semibold text-[10px]">{totals.pts}</td>
        <td className="py-2 px-2 text-center text-primary text-[10px]">{totals.fg}</td>
        <td className="py-2 px-2 text-center text-primary text-[10px]">{totals.threePt}</td>
        <td className="py-2 px-2 text-center text-primary text-[10px]">{totals.ft}</td>
        <td className="py-2 px-2 text-center text-primary text-[10px]">{totals.reb}</td>
        <td className="py-2 px-2 text-center text-primary text-[10px]">{totals.ast}</td>
        <td className="py-2 px-2 text-center text-primary text-[10px]">{totals.to}</td>
        <td className="py-2 px-2 text-center text-primary text-[10px]">{totals.stl}</td>
        <td className="py-2 px-2 text-center text-primary text-[10px]">{totals.blk}</td>
        <td className="py-2 px-2 text-center text-primary text-[10px]">{totals.oreb}</td>
        <td className="py-2 px-2 text-center text-primary text-[10px]">{totals.dreb}</td>
        <td className="py-2 px-2 text-center text-primary text-[10px]">{totals.pf}</td>
        <td className="py-2 px-2 text-center text-primary text-[10px]">{totals.min}</td>
        <td className="py-2 px-2 text-center text-primary text-[10px]">-</td>
      </tr>
      <tr className="border-b border-[#C8C8C8] font-semibold">
        <td className="py-2 px-3 border-r border-[#C8C8C8] sticky left-0 bg-white z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]" />
        <td className="py-2 px-2" />
        <td className="py-2 px-2 text-center text-[10px]">{totals.fgPct}%</td>
        <td className="py-2 px-2 text-center text-[10px]">{totals.threePtPct}%</td>
        <td className="py-2 px-2 text-center text-[10px]">{totals.ftPct}%</td>
        <td colSpan={10} />
      </tr>
    </>
  )
}

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function TeamStats({ teams, className, isLoading }: TeamStatsProps) {
  if (isLoading) {
    return (
      <div className={cn("bg-white rounded-lg p-4 space-y-4", className)}>
        <Skeleton className="h-6 w-32 bg-gray-100" />
        <div className="space-y-3">
          {[1, 2].map(i => (
            <div key={i} className="border border-[#C8C8C8] rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-6 rounded-full bg-gray-100" />
                <Skeleton className="h-4 w-40 bg-gray-100" />
              </div>
              <Skeleton className="h-32 w-full bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("bg-white rounded-lg", className)}>
      <h2 className="text-sm font-semibold text-primary py-3 px-2 border-b border-b-[#C8C8C8]">Team stats</h2>
      <Accordion type="multiple" className="w-full">
        {teams.map((team, idx) => (
          <AccordionItem key={idx} value={`item-${idx}`} className="border-b border-[#C8C8C8]">
            <AccordionTrigger className="px-3 py-3 hover:no-underline hover:bg-gray-50">
              <div className="flex items-center gap-x-2">
                {team.teamLogo && (
                  <img src={team.teamLogo || "/placeholder.svg"} alt={team.teamName} className="w-6 h-6 object-contain" />
                )}
                <h3 className="text-sm font-semibold text-primary">{team.teamName}</h3>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="overflow-x-auto pb-4 max-w-[calc(100vw-2rem)] md:max-w-none">
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
      <p className="text-xs text-zinc-500 mt-2 px-3 py-2">
        +/- denotes team&apos;s net points while the player is on the court
      </p>
    </div>
  )
}
