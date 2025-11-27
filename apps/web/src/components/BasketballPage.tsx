import BasketballAccordionComponentCard from '@/shared/BasketballAccordionComponentCard'
import FixtureFilterHeaders from '@/shared/FixtureFilterHeaders';
import { useAppSelector } from '@/store/hook';
import type { League, Match } from '@/types/basketball';
import React from 'react'

const BasketballPage = () => {
    const nbaMatches: Match[] = [
    { 
      id: 'nba-1',
      team1: "Detroit Pistons", 
      team2: "Chicago Bulls", 
      score1: 124, 
      score2: 113, 
      status: "FT" 
    },
    { 
      id: 'nba-2',
      team1: "Charlotte Hornets", 
      team2: "Milwaukee Bucks", 
      score1: 111, 
      score2: 100, 
      status: "FT" 
    },
    { 
      id: 'nba-3',
      team1: "New York Knicks", 
      team2: "Orlando Magic", 
      score1: 107, 
      score2: 124, 
      status: "FT" 
    },
    { 
      id: 'nba-4',
      team1: "Boston Celtics", 
      team2: "Memphis Grizzlies", 
      score1: 131, 
      score2: 95, 
      status: "FT" 
    },
    { 
      id: 'nba-5',
      team1: "Miami Heat", 
      team2: "Cleveland Cavaliers", 
      score1: 116, 
      score2: 130, 
      status: "FT" 
    },
    { 
      id: 'nba-6',
      team1: "Houstons Rockets", 
      team2: "Washington Wizards", 
      score1: 135, 
      score2: 113, 
      status: "FT" 
    },
    { 
      id: 'nba-7',
      team1: "New Orleans Pelicans", 
      team2: "Portland Trail Blazers", 
      score1: 117, 
      score2: 125, 
      status: "FT" 
    },
    { 
      id: 'nba-8',
      team1: "San Antonio Spurs", 
      team2: "Golden State Warriors", 
      score1: 120, 
      score2: 123, 
      status: "FT" 
    },
    { 
      id: 'nba-9',
      team1: "Dallas Mavericks", 
      team2: "Phoenix Suns", 
      score1: 114, 
      score2: 123, 
      status: "FT" 
    }
  ];

  const lnbMatches: Match[] = [
    { 
      id: 'lnb-1',
      team1: "Peñarol", 
      team2: "San Martín de Corrientes", 
      score1: 75, 
      score2: 72, 
      status: "FT" 
    }
  ];

  const euroleagueMatches: Match[] = [
    { 
      id: 'euro-1',
      team1: "Real Madrid", 
      team2: "Barcelona", 
      score1: 88, 
      score2: 92, 
      status: "FT" 
    },
    { 
      id: 'euro-2',
      team1: "Olympiacos", 
      team2: "Fenerbahce", 
      score1: 78, 
      score2: 81, 
      status: "FT" 
    }
  ];

  const leagues: League[] = [
    {
      id: 'usa-nba',
      country: 'USA',
      leagueName: 'NBA',
      flag: '/USA.png',
      matches: nbaMatches
    },
    {
      id: 'arg-lnb',
      country: 'Argentina',
      leagueName: 'LNB',
      flag: '/Argentina.png',
      matches: lnbMatches
    },
    {
      id: 'euro-league',
      country: 'Europe',
      leagueName: 'Euroleague',
      flag: '/International.png',
      matches: euroleagueMatches
    }
  ];

  return (
    <div className='space-y-4 mb-32 lg:mb-0'>
        {/* <div className='w-full'>
            <FixtureFilterHeaders/>
        </div> */}
        {leagues.map((league) => (
          <BasketballAccordionComponentCard
            key={league.id}
            country={league.country}
            league={league.leagueName}
            flag={league.flag}
            matches={league.matches}
            imageUrl={league.imageUrl}
          />
        ))}
    </div>
  )
}

export default BasketballPage