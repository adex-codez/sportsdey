import DetailsImageCard from '@/shared/DetailsImageCard'
import type { TeamStanding } from '@/types/basketball';

import { type BasketballGameDetails, type BasketballStanding, type BasketballGameStats } from '@/types/api';
import { apiRequest } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { TeamStats } from './TeamStats';
import ImportantUpdate from '@/shared/ImportantUpdate';
import { useState } from 'react';
import InfoTab from './InfoTab';
import StandingsTab from './StandingsTab';
import { VideosTab } from './VideosTab';
import { useParams } from '@tanstack/react-router';
import { Loader2 } from 'lucide-react';
import { GameDetailsSkeleton } from './GameDetailsSkeleton';



const BasketBallDetailsPage = () => {
  const { Id } = useParams({ from: '/basketball/$Id' });
  const [activeTab, setActiveTab] = useState('info');

  const { data: gameDetails, isLoading: isGameLoading } = useQuery({
    queryKey: ['basketball', 'game', Id],
    queryFn: () => apiRequest<BasketballGameDetails>(`/api/basketball/game/${Id}`),
    enabled: !!Id,
  });

  const { data: gameStats, isLoading: isStatsLoading } = useQuery({
    queryKey: ['basketball', 'game', Id, 'stats'],
    queryFn: () => apiRequest<BasketballGameStats>(`/api/basketball/game/${Id}/stats`),
    enabled: !!Id,
  });

  const mapPlayer = (player: any) => {
    const s = player.statistics;
    const pts = (2 * s.field_goals_made) + s.three_points_made + s.free_throws_made;
    return {
      name: player.full_name,
      number: '-',
      pts,
      fg: `${s.field_goals_made}/${s.field_goals_att}`,
      threePt: `${s.three_points_made}/${s.three_points_att}`,
      ft: `${s.free_throws_made}/${s.free_throws_att}`,
      reb: s.rebounds || (s.offensive_rebounds + s.defensive_rebounds),
      ast: s.assists,
      to: s.turnovers,
      stl: s.steals,
      blk: s.blocks,
      oreb: s.offensive_rebounds,
      dreb: s.defensive_rebounds,
      pf: s.personal_fouls,
      min: s.minutes_played || "0",
      plusMinus: s.pls_min || 0
    };
  };

  const mapTeamToStats = (teamDetails: any) => {
    if (!teamDetails?.statistics) return {
      teamName: teamDetails?.name || '',
      teamLogo: "/Profile.png",
      starters: [],
      bench: [],
      totals: { pts: 0, fg: '-', threePt: '-', ft: '-', reb: 0, ast: 0, to: 0, stl: 0, blk: 0, oreb: 0, dreb: 0, pf: 0, min: 0, fgPct: 0, threePtPct: 0, ftPct: 0 }
    };

    const s = teamDetails.statistics;
    const totals = {
      pts: teamDetails.points,
      fg: `${s.field_goals_made}/${s.field_goals_att}`,
      fgPct: s.field_goals_pct,
      threePt: `${s.three_points_made}/${s.three_points_att}`,
      threePtPct: s.three_points_pct,
      ft: `${s.free_throws_made}/${s.free_throws_att}`,
      ftPct: s.free_throws_pct,
      reb: s.rebounds || (s.offensive_rebounds + s.defensive_rebounds),
      oreb: s.offensive_rebounds,
      dreb: s.defensive_rebounds,
      ast: s.assists,
      stl: s.steals,
      blk: s.blocks,
      to: s.turnovers,
      pf: 0,
      min: 240
    };

    return {
      teamName: teamDetails.name,
      teamLogo: "/Profile.png",
      starters: teamDetails.starters?.map(mapPlayer) || [],
      bench: teamDetails.bench?.map(mapPlayer) || [],
      totals
    };
  };

  const mappedTeamStats = gameStats ? [
    mapTeamToStats(gameStats.home),
    mapTeamToStats(gameStats.away)
  ] : [];


  const gameTabs = [
    { id: 'info', label: 'Info' },
    { id: 'standings', label: 'Standings' },
    { id: 'team-stats', label: 'Team Stats' },
    { id: 'videos', label: 'Videos' },
    { id: 'news', label: 'News' }
  ];

  const [standingsLimit, setStandingsLimit] = useState(13);

  const { data: standingsData, isLoading: isStandingsLoading } = useQuery({
    queryKey: ['basketball', 'standings', '2025', 'western', standingsLimit],
    queryFn: () => apiRequest<BasketballStanding[]>(`/api/basketball/standings/2025?conference=western&limit=${standingsLimit}&offset=0`),
  });

  const teamStandings: TeamStanding[] = standingsData?.map((team, index) => ({
    position: index + 1,
    name: team.name,
    played: team.played,
    wins: team.wins,
    losses: team.losses,
    streak: String(team.streak),
    gamesBehind: String(team.gb),
    diff: String(team.diff),
    pct: String(team.win_pct),
    lastFiveResults: []
  })) || [];


  const renderTabContent = () => {
    switch (activeTab) {
      case 'info':
        return (
          <InfoTab gameDetails={gameDetails} teamStats={mappedTeamStats} />
        );

      case 'standings':
        return (
          isStandingsLoading ? <div className="text-center text-gray-500">Loading standings...</div> :
            <StandingsTab
              teams={teamStandings}
              onSeeAllClick={standingsLimit <= 13 ? () => setStandingsLimit(30) : undefined}
            />
        );

      case 'team-stats':
        return (
          <TeamStats teams={mappedTeamStats} isLoading={isStatsLoading} />
        );

      case 'videos':
        return (
          <VideosTab
            homeTeam={gameDetails?.home.name || ''}
            awayTeam={gameDetails?.away.name || ''}
          />
        );

      case 'news':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Latest News</h3>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition cursor-pointer">
                  <h4 className="text-white font-medium mb-1">Post-Game Analysis: Bulls Dominate</h4>
                  <p className="text-gray-400 text-sm mb-2">
                    Chicago Bulls showcase stellar performance in their victory over Detroit Pistons...
                  </p>
                  <p className="text-gray-500 text-xs">2 hours ago</p>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isGameLoading) {
    return <div className='w-full'>
      <div className='w-full h-screen max-w-full space-y-3 pb-28 lg:pb-10 flex items-center justify-center md:hidden'>
        <Loader2 className="animate-spin" width={48} height={48} />

      </div>
      <div className='hidden md:block'>
        <GameDetailsSkeleton />
      </div>
    </div>
  }

  return (
    <div className='w-full max-w-screen space-y-3 pb-28 lg:pb-10'>
      <div className='py-4 lg:py-0'>
        {gameDetails && (
          <DetailsImageCard
            gameTabs={gameTabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            competitionCountry={gameDetails.venue.name || "International"}
            competitionName={gameDetails.season.name}
            hostTeamName={gameDetails.home.name}
            hostTeamLogo='/Profile.png'
            matchStatus={gameDetails.status === 'closed' ? 'FT' : gameDetails.status}
            hostTeamScore={gameDetails.home.points}
            guestTeamScore={gameDetails.away.points}
            guestTeamLogo='/Profile.png'
            guestTeamName={gameDetails.away.name}
          />
        )}
      </div>
      <div>
        {renderTabContent()}
      </div>
      <div><ImportantUpdate /></div>
    </div>
  )
}

export default BasketBallDetailsPage