import BasketBallScoreCard from './BasketBallScoreCard'
import VenueGuide from './VenueGuide'
import { TeamStats, type TeamStatsData } from './TeamStats'
import type { BasketballGameDetails } from '@/types/api'


const InfoTab = ({ gameDetails, teamStats }: { gameDetails?: BasketballGameDetails; teamStats?: TeamStatsData[] }) => {
  if (!gameDetails) return null;

  return (
    <div className='w-full space-y-4'>
      <div className='w-full'>
        <BasketBallScoreCard team1={{
          name: gameDetails.home.name,
          quarterScores: gameDetails.home.score?.reduce((acc, curr) => {
            acc[curr.quarter - 1] = curr.points;
            return acc;
          }, [0, 0, 0, 0] as number[]) || [0, 0, 0, 0],
          total: gameDetails.home.points ?? 0,

        }}
          team2={{
            name: gameDetails.away.name,
            quarterScores: gameDetails.away.score?.reduce((acc, curr) => {
              acc[curr.quarter - 1] = curr.points;
              return acc;
            }, [0, 0, 0, 0] as number[]) || [0, 0, 0, 0],
            total: gameDetails.away.points ?? 0,

          }}
          quarters={[
            { id: 'q1', label: 'Q1' },
            { id: 'q2', label: 'Q2' },
            { id: 'q3', label: 'Q3' },
            { id: 'q4', label: 'Q4' }
          ]} />
      </div>
      <div className='w-full'>
        <VenueGuide venueName={gameDetails.venue.name} />
      </div>
      <div className="w-full mx-auto">
        <TeamStats teams={teamStats || []} />
      </div>
    </div>
  )
}

export default InfoTab