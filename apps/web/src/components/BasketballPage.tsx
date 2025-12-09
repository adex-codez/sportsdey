import { apiRequest } from '@/lib/api';
import BasketballAccordionComponentCard from '@/shared/BasketballAccordionComponentCard';
import { useAppSelector } from '@/store/hook';
import type { RootState } from '@/store';
import type { BasketballScheduleData } from '@/types/api';
import type { League } from '@/types/basketball';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useMemo } from 'react';
import FixtureFilterHeaders from '@/shared/FixtureFilterHeaders';

const formatDate = (date: Date) => {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate()
  }
}

const BasketballPage = () => {
  const selectedDateString = useAppSelector((state: RootState) => state.date.selectedDate);
  const selectedDate = new Date(selectedDateString);
  const { year, month, day } = formatDate(selectedDate);

  const { data: scheduleData, isLoading } = useQuery({
    queryKey: ['basketball', 'schedule', year, month, day],
    queryFn: () => apiRequest<BasketballScheduleData>(`/api/basketball/schedule/${year}/${month}/${day}?language=en`),
  });



  const LEAGUE_METADATA: Record<string, { country: string; flag: string }> = {
    "NBA": { country: "USA", flag: "/USA.png" },
    "LNB": { country: "Argentina", flag: "/Argentina.png" },
    "Euroleague": { country: "Europe", flag: "/International.png" },
  };

  const dynamicLeague: League | null = scheduleData ? {
    id: `league-${scheduleData.league}`,
    country: LEAGUE_METADATA[scheduleData.league]?.country || "International",
    leagueName: scheduleData.league,
    flag: LEAGUE_METADATA[scheduleData.league]?.flag || "/placeholder.png",
    matches: scheduleData.games.map((game) => {
      const formatTime = (dateStr?: string) => {
        if (!dateStr) return undefined;
        try {
          return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        } catch {
          return undefined;
        }
      };

      return {
        id: game.id,
        team1: game.home.name,
        team2: game.away.name,
        score1: game.home.points ?? 0,
        score2: game.away.points ?? 0,
        status: game.status === 'closed' ? 'FT' : game.status,
        time: formatTime(game.scheduledTime || game.time) || "00:00"
      };
    })
  } : null;

  const leagues: League[] = dynamicLeague ? [dynamicLeague] : [];

  const counts = useMemo(() => {
    if (!scheduleData?.games) return { all: 0, live: 0, finished: 0, upcoming: 0 };
    const games = scheduleData.games;
    return {
      all: games.length,
      live: games.filter(g => !['closed', 'cancelled', 'scheduled', 'ns'].includes(g.status.toLowerCase())).length,
      finished: games.filter(g => ['closed', 'ft', 'aot'].includes(g.status.toLowerCase())).length,
      upcoming: games.filter(g => ['scheduled', 'ns'].includes(g.status.toLowerCase())).length
    };
  }, [scheduleData]);

  return (
    <div className='space-y-4 mb-32 lg:mb-0'>
      <div className='hidden w-full lg:block'>
        <FixtureFilterHeaders counts={counts} />
      </div>
      {isLoading && <div className="flex flex-col items-center justify-center space-y-2">
        <Loader2 className="animate-spin" width={24} height={24} />
        <p className="text-gray-500 text-sm">Loading matches...</p>
      </div>}
      {!isLoading && leagues.map((league, index) => (
        <BasketballAccordionComponentCard
          key={league.id || index}
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