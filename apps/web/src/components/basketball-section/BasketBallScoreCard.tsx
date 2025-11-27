import type { QuarterScoreTableProps } from "@/types/basketball";

const BasketBallScoreCard = ({ team1, team2, quarters }: QuarterScoreTableProps) => {
       const isTeam1Winner = team1.total > team2.total;
  const isTeam2Winner = team1.total < team2.total;
  return (
    <div className="w-full bg-white border-0 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="w-full px-4 py-2 flex items-center justify-between border-b border-gray-200">
        <div className="w-full">

        <span className="text-primary font-semibold text-sm">Scoring</span>
        </div>
        <div className="flex gap-x-4">
          {quarters.map((q) => (
            <span key={q.id} className="text-primary font-semibold text-xs w-4 md:w-10 lg:w-14 text-center">
              {q.label}
            </span>
          ))}
          <span className="text-primary font-semibold text-xs w-8 md:w-10 lg:w-14 text-center">T</span>
        </div>
      </div>

      {/* Team 1 Scores */}
      <div className="bg-white text-[11px] flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="text-primary text-[11px] font-medium">{team1.name}</span>
        </div>
        <div className="flex gap-4">
          {team1.quarterScores.map((score, idx) => (
            <span key={idx} className="text-primary text-xs w-4 md:w-10 lg:w-14 text-center">
              {score}
            </span>
          ))}
          <span className={`text-primary text-xs ${isTeam1Winner ? "font-bold" : "font-normal"} w-8 md:w-10 lg:w-14 text-center`}>
            {team1.total}
          </span>
        </div>
      </div>

      <div className="flex text-[11px] items-center justify-between px-4 py-3 bg-white">
        <div className="flex items-center gap-3">
          <span className="text-primary font-medium">{team2.name}</span>
        </div>
        <div className="flex gap-4">
          {team2.quarterScores.map((score, idx) => (
            <span key={idx} className="text-primary text-xs w-4 md:w-10 lg:w-14 text-center">
              {score}
            </span>
          ))}
          <span className={`text-primary text-xs ${isTeam2Winner ? "font-bold" : "font-normal"} w-8 md:w-10 lg:w-14 text-center`}>
            {team2.total}
          </span>
        </div>
      </div>
    </div>
  );
}

export default BasketBallScoreCard