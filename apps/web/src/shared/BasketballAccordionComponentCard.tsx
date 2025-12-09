// src/components/BasketballAccordionComponentCard.tsx
import type { BasketballAccordionComponentCardProps, BasketballComponentHeaderProps, FavoritesState, MatchCardProps, SetScore } from '@/types/basketball';
import { Link, useRouter } from '@tanstack/react-router';
import { ChevronDown, ChevronRight, Star } from 'lucide-react';
import React, { useState } from 'react';


const BasketballComponentHeader: React.FC<BasketballComponentHeaderProps> = ({
  flag,
  country,
  league,
  isExpanded,
  onToggle,
  imageUrl
}) => {
  return (
    <div
      className='w-full flex justify-between items-center border-b px-5 py-4 cursor-pointer transition-colors'
      onClick={onToggle}
    >
      <div className='flex gap-x-3 items-center'>
        {flag ? (
          <img src={flag} alt={`${country} flag`} className='w-6 h-6 rounded-full' />
        ) : imageUrl ? (
          <img src={imageUrl} alt={`${country} flag`} className='w-6 h-6 rounded-full' />
        ) : (
          <img src={`/${country}.png`} alt={`${country} flag`} className='w-6 h-6 rounded-full' />
        )}
        <div className='inline-flex items-center gap-x-1 text-sm'>
          <p className='font-bold text-primary'>{country}</p>
          -
          <p className='text-primary font-bold'>{league}</p>
        </div>

      </div>
      <span className={`text-xs text-primary`}>{isExpanded ? <ChevronRight /> : <ChevronDown />}</span>
    </div>
  );
};

const MatchCard: React.FC<MatchCardProps> = ({
  team1,
  team2,
  score1,
  score2,
  player1Sets,
  player2Sets,
  status = "FT",
  isFavorite = false,
  time,
  onFavoriteToggle
}) => {
  const { state } = useRouter();
  const pathname = state.location.pathname;
  const isTennisRoute = pathname.includes('/tennis') || pathname.includes('tennis');


  const renderSetScore = (set: SetScore, isWinner: boolean) => {
    return (
      <span className={isWinner ? "font-semibold" : ""}>
        {set.games}
        {set.tiebreak !== undefined && <sup className="text-[9px] align-super ml-0.5 font-medium">{set.tiebreak}</sup>}
      </span>
    )
  }

  const calculateSetsWon = (playerSets: SetScore[], opponentSets: SetScore[]) => {
    let wins = 0
    for (let i = 0; i < playerSets.length; i++) {
      if (playerSets[i].games > opponentSets[i]?.games) wins++
    }
    return wins
  }

  return (
    <div className="grid cursor-pointer grid-cols-[50px_1fr_40px] items-center gap-x-4 px-5 py-3.5 border-b border-border hover:bg-muted/30 transition-colors last:border-b-0">
      <div className={`text-xs font-medium flex items-center justify-center w-[35px] h-[35px] rounded-[10px] ${status !== "FT" && status !== "scheduled" && status !== time ? "bg-[#0E8F1A] text-white" : "text-muted-foreground"}`}>
        {status === "scheduled" && time ? time : status}
      </div>

      {isTennisRoute && player1Sets && player2Sets ? (
        <div className="flex flex-col gap-1.5 text-sm">
          <div className="flex justify-between items-center">
            <span
              className={`text-foreground ${calculateSetsWon(player1Sets, player2Sets) > calculateSetsWon(player2Sets, player1Sets) ? "font-semibold" : ""}`}
            >
              {team1}
            </span>
            <div className="flex gap-3 min-w-20 justify-end font-mono text-foreground">
              {player1Sets.map((set, idx) => (
                <span key={idx} className="w-4 text-center">
                  {renderSetScore(set, set.games > (player2Sets[idx]?.games ?? 0))}
                </span>
              ))}
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span
              className={`text-foreground ${calculateSetsWon(player2Sets, player1Sets) > calculateSetsWon(player1Sets, player2Sets) ? "font-semibold" : ""}`}
            >
              {team2}
            </span>
            <div className="flex gap-3 min-w-20 justify-end font-mono text-foreground">
              {player2Sets.map((set, idx) => (
                <span key={idx} className="w-4 text-center">
                  {renderSetScore(set, set.games > (player1Sets[idx]?.games ?? 0))}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5 text-sm">
          <div className="flex justify-between items-center">
            <span className={`text-foreground ${(score1 ?? 0) > (score2 ?? 0) ? "font-semibold" : ""}`}>{team1}</span>
            <span className="text-foreground min-w-10 text-right font-semibold">{score1}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-foreground ${(score2 ?? 0) > (score1 ?? 0) ? "font-semibold" : ""}`}>{team2}</span>
            <span className="text-foreground min-w-10 text-right font-semibold">{score2}</span>
          </div>
        </div>
      )}

      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onFavoriteToggle?.();
        }}
        className={`text-xl border-none bg-transparent cursor-pointer transition-colors ${isFavorite ? 'text-yellow-400' : 'text-[#C8C8C8] hover:text-yellow-400'
          }`}
      >
        ★
      </button>
    </div>
  );
};

const SportAccordionCard: React.FC<BasketballAccordionComponentCardProps> = ({
  country,
  league,
  flag,
  matches,
  defaultExpanded = true,
  imageUrl
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const [favorites, setFavorites] = useState<FavoritesState>({});

  const toggleFavorite = (index: number): void => {
    setFavorites(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const { state } = useRouter();
  const pathname = state.location.pathname;
  const getRoutePath = () => {
    let routePath = ""
    if (pathname.includes('/basketball') || pathname.includes('basketball')) {
      routePath = `/basketball/$Id`;
    }
    if (pathname.includes('/tennis') || pathname.includes('tennis')) {
      routePath = `/tennis/$Id`;
    }
    return routePath
  }

  return (
    <div className='w-full bg-white rounded-2xl overflow-hidden shadow-sm'>
      <BasketballComponentHeader
        flag={flag}
        country={country}
        league={league}
        matchCount={matches?.length}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
        imageUrl={imageUrl}
      />

      {isExpanded && matches && (
        <div className="flex flex-col">
          {matches.map((match, index) => (
            <Link key={match.id || index} to={`${getRoutePath()}`} params={{ Id: match.id! }}>
              <MatchCard
                team1={match.team1}
                team2={match.team2}
                time={match.time}
                player1Sets={match.player1Sets}
                player2Sets={match.player2Sets}
                score1={match.score1}
                score2={match.score2}
                status={match.status ? match.status : match.time}
                isFavorite={favorites[index]}
                onFavoriteToggle={() => toggleFavorite(index)}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SportAccordionCard;
export { BasketballComponentHeader, MatchCard };