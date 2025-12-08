
import { cn } from "@/lib/utils"

interface TennisPlayerScore {
    name: string
    periodScores: (number | string)[]
    pts?: string | number
    s?: string | number
}

interface TennisScoreTableProps {
    players: TennisPlayerScore[]
    className?: string
    onSeeAllClick?: () => void
}

const TennisScoreTable = ({ players, className, onSeeAllClick }: TennisScoreTableProps) => {
    return (
        <div className={cn("bg-white rounded-lg overflow-hidden w-full", className)}>
            <div className="w-full overflow-x-auto max-w-[calc(100vw-2rem)] md:max-w-none">
                <table className="w-full text-sm min-w-[300px]">
                    <thead>
                        <tr className="border-b border-[#C8C8C8]">
                            <th className="text-left py-4 px-4 font-semibold text-primary w-1/2 pr-8">Players</th>
                            <th className="text-center py-4 px-3 font-semibold text-primary">1</th>
                            <th className="text-center py-4 px-3 font-semibold text-primary">2</th>
                            <th className="text-center py-4 px-3 font-semibold text-primary">3</th>
                            <th className="text-center py-4 px-3 font-semibold text-primary">4</th>
                            <th className="text-center py-4 px-3 font-semibold text-primary">5</th>
                            <th className="text-center py-4 px-3 font-semibold text-primary">PTS</th>
                            <th className="text-center py-4 px-3 font-semibold text-primary">S</th>
                        </tr>
                    </thead>
                    <tbody>
                        {players.map((player, idx) => (
                            <tr key={idx} className={cn("border-b border-[#E5E5E5] last:border-b-0", idx % 2 === 0 ? "bg-white" : "bg-white")}>
                                <td className="py-4 px-4 text-left font-medium text-primary whitespace-nowrap">
                                    {player.name}
                                </td>
                                {player.periodScores.map((score, sIdx) => (
                                    <td key={sIdx} className="text-center py-4 px-3 text-primary font-medium">
                                        {score}
                                    </td>
                                ))}

                                {Array.from({ length: 5 - player.periodScores.length }).map((_, i) => (
                                    <td key={`empty-${i}`} className="text-center py-4 px-3"></td>
                                ))}
                                <td className="text-center py-4 px-3 font-medium text-primary">{player.pts}</td>
                                <td className="text-center py-4 px-3 font-medium text-primary">{player.s}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {onSeeAllClick && (
                <div className="w-full flex justify-center py-3 border-t border-[#C8C8C8]">
                    <button
                        onClick={onSeeAllClick}
                        className="text-[10px] underline cursor-pointer text-primary hover:text-primary font-medium"
                    >
                        See all Standings
                    </button>
                </div>
            )}
        </div>
    )
}

export default TennisScoreTable
