import SportAccordionCard from '@/shared/BasketballAccordionComponentCard'
import type { League } from '@/types/basketball'
import { apiRequest } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { ErrorState } from '@/components/ErrorState';
import { useApiError } from '@/hooks/useApiError';
import { useAppSelector } from '@/store/hook';
import type { RootState } from '@/store';
import type { TennisScheduleData } from '@/types/api';
import TennisFixtureFilterHeaders from '@/shared/TennisFixtureFilterHeaders';
import { useMemo } from 'react';
import { getCountryFromCompetition } from '@/lib/countryUtils';

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const TennisPage = () => {
  const selectedDateString = useAppSelector((state: RootState) => state.date.selectedDate);
  const activeFilter = useAppSelector((state: RootState) => state.tennis.activeFilter);
  const selectedDate = new Date(selectedDateString);
  const formattedDate = formatDate(selectedDate);

  const { data: scheduleData, isLoading, error, isError, refetch } = useQuery({
    queryKey: ['tennis', 'schedule', formattedDate],
    queryFn: () => apiRequest<TennisScheduleData>(`/api/tennis/schedule/${formattedDate}?language=en`),
  });

  const { isNetworkError } = useApiError({ error, isError, refetch });


  const counts = useMemo(() => {
    if (!scheduleData?.competitions) return { all: 0, live: 0, finished: 0, upcoming: 0 };

    const allMatches = scheduleData.competitions.flatMap(comp => comp.matches);


    const isLive = (status: string) => {
      const lowerStatus = status.toLowerCase();

      return lowerStatus === 'live';
    };

    const isFinished = (status: string) => {
      const lowerStatus = status.toLowerCase();
      return ['closed', 'ended', 'interrupted'].includes(lowerStatus);
    };

    const isUpcoming = (status: string) => {
      const lowerStatus = status.toLowerCase();
      return ['scheduled', 'ns', 'not_started'].includes(lowerStatus);
    };

    return {
      all: allMatches.length,
      live: allMatches.filter(m => isLive(m.status)).length,
      finished: allMatches.filter(m => isFinished(m.status)).length,
      upcoming: allMatches.filter(m => isUpcoming(m.status)).length
    };
  }, [scheduleData]);



  const matchesFilter = (status: string) => {
    const lowerStatus = status.toLowerCase();

    switch (activeFilter) {
      case 'live':
        return lowerStatus === 'live';
      case 'finished':
        return ['closed', 'ended', 'interrupted'].includes(lowerStatus);
      case 'upcoming':
        return ['scheduled', 'ns', 'not_started'].includes(lowerStatus);
      case 'all':
      default:
        return true;
    }
  };

  const tennisLeagues: League[] = scheduleData?.competitions.map((comp) => {

    const { country, flag } = getCountryFromCompetition(comp.competition.name);

    return {
      id: comp.competition.id,
      country: country,
      leagueName: comp.competition.name,
      flag: flag,
      matches: comp.matches
        .filter(match => matchesFilter(match.status))
        .map((match) => {
          const formatTime = (dateStr: string) => {
            try {
              return new Date(dateStr).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              });
            } catch {
              return "00:00";
            }
          };


          let displayStatus: string | undefined;
          let displayTime: string | undefined;

          if (match.status === 'not_started' || match.status === 'scheduled' || match.status === 'ns') {

            displayTime = formatTime(match.start_time);
            displayStatus = undefined;
          } else if (match.status === 'cancelled') {
            displayStatus = 'Cancelled';
            displayTime = undefined;
          } else if (match.status === 'closed' || match.status === 'ended') {
            displayStatus = 'FT';
            displayTime = undefined;
          } else if (match.status === 'interrupted') {

            displayStatus = 'INT';
            displayTime = undefined;
          } else if (match.status === 'live') {

            displayStatus = 'Live';
            displayTime = undefined;
          } else {

            displayStatus = match.status;
            displayTime = undefined;
          }

          return {
            id: match.id,
            team1: match.home_team.competitor.name,
            team2: match.away_team.competitor.name,
            player1Sets: match.home_team.set_scores.map(set => ({
              games: set.games_won,
              tiebreak: set.tiebreak_score
            })),
            player2Sets: match.away_team.set_scores.map(set => ({
              games: set.games_won,
              tiebreak: set.tiebreak_score
            })),
            status: displayStatus,
            time: displayTime,
          };
        })
    };
  })
    .filter(league => league.matches.length > 0) || [];

  if (isError) {
    return (
      <div className='space-y-4 mb-32 lg:mb-0 pb-10'>
        <ErrorState
          message={isNetworkError ? 'Network Error' : 'Failed to load tennis schedule'}
          description={isNetworkError ? 'Please check your internet connection' : 'Unable to load tennis matches'}
          onRetry={refetch}
          isNetworkError={isNetworkError}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='space-y-4 mb-32 lg:mb-0 pb-10'>
        <div className="flex flex-col items-center justify-center space-y-2 py-20">
          <Loader2 className="animate-spin" width={24} height={24} />
          <p className="text-gray-500 text-sm">Loading tennis matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-4 mb-32 lg:mb-0'>
      <div className='hidden w-full lg:block'>
        <TennisFixtureFilterHeaders counts={counts} />
      </div>
      {tennisLeagues.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-gray-500 text-sm">
            {activeFilter === 'all'
              ? 'No tennis matches scheduled for this date'
              : activeFilter === 'live'
                ? 'No live matches at the moment'
                : activeFilter === 'finished'
                  ? 'No finished matches for this date'
                  : 'No upcoming matches for this date'
            }
          </p>
        </div>
      ) : (
        tennisLeagues.map((league) => (
          <SportAccordionCard
            key={league.id}
            country={league.country}
            league={league.leagueName}
            flag={league.flag}
            matches={league.matches}
            imageUrl={league.imageUrl}
          />
        ))
      )}
    </div>
  )
}

export default TennisPage