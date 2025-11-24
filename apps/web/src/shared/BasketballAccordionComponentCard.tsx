// src/components/BasketballAccordionComponentCard.tsx
import type { BasketballAccordionComponentCardProps, BasketballComponentHeaderProps, FavoritesState, MatchCardProps } from '@/types/basketball';
import { ChevronDown, ChevronRight } from 'lucide-react';
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
          <img src={flag} alt={`${country} flag`} className='w-6 h-6 rounded-full'/>
        ) : imageUrl ? (
          <img src={imageUrl} alt={`${country} flag`} className='w-6 h-6 rounded-full'/>
        ) : (
          <img src={`/${country}.png`} alt={`${country} flag`} className='w-6 h-6 rounded-full'/>
        )}
        <div className='inline-flex items-center gap-x-1 text-sm'>
          <p className='font-bold text-primary'>{country}</p>
          -
          <p className='text-primary font-bold'>{league}</p>
        </div>
   
      </div>
      <span className={`text-xs text-primary`}>{isExpanded ? <ChevronRight/> : <ChevronDown/>}</span>
    </div>
  );
};

const MatchCard: React.FC<MatchCardProps> = ({
  team1,
  team2,
  score1,
  score2,
  status = "FT",
  isFavorite = false,
  onFavoriteToggle
}) => {
    const isTeam1Winner = score1 > score2;
  const isTeam2Winner = score2 > score1;

  return (
    <div className="grid cursor-pointer grid-cols-[40px_1fr_40px] items-center gap-x-4 px-5 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors last:border-b-0">
      <div className="text-xs text-[#6C7073] font-medium">{status}</div>
      <div className="flex flex-col gap-2 text-xs">
        <div className="flex justify-between items-center">
          <span className={`text-primary ${isTeam1Winner ? 'font-bold' : 'font-normal'}`}>{team1}</span>
          <span className={`text-primary min-w-10 text-right ${isTeam1Winner ? 'font-bold' : 'font-normal'}`}>{score1}</span>
        </div>
        <div className="flex justify-between items-center">
         <span className={`text-primary ${isTeam2Winner ? 'font-bold' : 'font-normal'}`}>{team2}</span>
          <span className={`text-primary min-w-10 text-right ${isTeam2Winner ? 'font-bold' : 'font-normal'}`}>{score2}</span>
        </div>
      </div>
      <button 
        onClick={onFavoriteToggle}
        className={`text-xl border-none bg-transparent cursor-pointer transition-colors ${
          isFavorite ? 'text-yellow-400' : 'text-[#C8C8C8] hover:text-yellow-400'
        }`}
      >
        ★
      </button>
    </div>
  );
};

const BasketballAccordionComponentCard: React.FC<BasketballAccordionComponentCardProps> = ({
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
            <MatchCard 
              key={match.id || index} 
              team1={match.team1}
              team2={match.team2}
              score1={match.score1}
              score2={match.score2}
              status={match.status}
              isFavorite={favorites[index]}
              onFavoriteToggle={() => toggleFavorite(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BasketballAccordionComponentCard;
export { BasketballComponentHeader, MatchCard };