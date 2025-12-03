import React from 'react'
import BasketBallScoreCard from './BasketBallScoreCard'
import VenueGuide from './VenueGuide'
import { TeamStats } from './TeamStats'
import { sampleTeams } from './BasketBallDetailsPage'



const InfoTab = () => {
  return (
    <div className='w-full space-y-4'>
           <div className='w-full'>
          <BasketBallScoreCard team1={{
              name: 'Detroit Pistons',
              quarterScores: [28, 30, 26, 26],
              total: 122,

            }}
            team2={{
              name: 'Chicago Bulls',
              quarterScores: [30, 28, 24, 28],
              total: 120,
            
            }}
            quarters={[
              { id: 'q1', label: 'Q1' },
              { id: 'q2', label: 'Q2' },
              { id: 'q3', label: 'Q3' },
              { id: 'q4', label: 'Q4' }
            ]}/>
        </div>
        <div className='w-full'>
          <VenueGuide/>
        </div>
        <div className="w-full mx-auto">
          <TeamStats teams={sampleTeams}/>
        </div>
    </div>
  )
}

export default InfoTab