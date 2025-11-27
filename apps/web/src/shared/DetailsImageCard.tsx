import { TabNavigation } from '@/components/ui/tab-navigation';
import type { DetailsImageProps } from '@/types/basketball'
import React, { useState } from 'react'

interface DetailsImageCardProps extends DetailsImageProps{
  competitionName: string;
  competitionCountry: string;
  hostTeamName: string;
  guestTeamName: string;
  hostTeamLogo: string;
  guestTeamLogo: string;
  guestTeamScore: number;
  hostTeamScore: number;
  matchStatus: string;
  isFavorite?: boolean,
  onFavoriteToggle?: () => {};
}

const DetailsImageCard = ({competitionName,
  competitionCountry,
  hostTeamName,
  guestTeamName,
  hostTeamLogo,
  guestTeamLogo,
  guestTeamScore,
  hostTeamScore,
  isFavorite = false,
  onFavoriteToggle,
  matchStatus}: DetailsImageCardProps) => {
      const [activeTab, setActiveTab] = useState('info');

  const gameTabs = [
    { id: 'info', label: 'Info' },
    { id: 'standings', label: 'Standings' },
    { id: 'team-stats', label: 'Team Stats' },
    { id: 'videos', label: 'Videos' },
    { id: 'news', label: 'News' }
  ];
  return (
   <div className="h-64 w-full rounded-t-2xl rounded-b-0 bg-primary relative">
      <div className="w-full h-full">
        <div className="py-4 flex justify-center items-center relative">
          <span className="text-white text-xs md:text-sm font-semibold">
            {competitionCountry} - {competitionName}
          </span>
          <button
            onClick={onFavoriteToggle}
            className={`absolute right-4 text-xl border-none bg-transparent cursor-pointer transition-colors ${
              isFavorite ? 'text-yellow-400' : 'text-[#C8C8C8] hover:text-yellow-400'
            }`}
          >
            ★
          </button>
        </div>
        <div className='w-full flex justify-center md:gap-x-8 items-center px-4 md:px-6 mt-6'>

        <div className='w-full flex items-center lg:justify-end'>

            <button
            onClick={onFavoriteToggle}
            className={`text-xl border-none bg-transparent cursor-pointer transition-colors ${
              isFavorite ? 'text-yellow-400' : 'text-[#C8C8C8] hover:text-yellow-400'
            }`}
          >
            ★
          </button>
            <div className='flex flex-col items-center mx-4'>
              <img src={hostTeamLogo} alt={hostTeamName} className='w-16 h-16 object-contain mx-auto'/>
              <span className='text-white text-[10px] md:text-sm font-normal mt-2 block text-center'>{hostTeamName}</span>
            </div>

        </div>
        <div className='w-full'>

            <div className='flex flex-col items-center gap-y-4'>
              <span className='text-white text-base md:text-3xl font-semibold'>{hostTeamScore} - {guestTeamScore}</span>
              <span className='text-[#1BAA04] text-xs md:text-sm font-medium mt-2 capitalize block text-center'>{matchStatus}</span>
              </div>
        </div>
        <div className='flex flex-row-reverse items-center w-full lg:justify-end'>
   
             <button
            onClick={onFavoriteToggle}
            className={`text-xl border-none bg-transparent cursor-pointer transition-colors ${
              isFavorite ? 'text-yellow-400' : 'text-[#C8C8C8] hover:text-yellow-400'
            }`}
          >
            ★
          </button>
            <div className='flex flex-col items-center mx-4'>
              <img src={guestTeamLogo} alt={guestTeamName} className='w-16 h-16 object-contain mx-auto'/>
              <span className='text-white text-[10px] md:text-sm font-normal mt-2 block text-center'>{guestTeamName}</span>
            </div>
        </div>
         </div>
      </div>
    
        <TabNavigation 
            tabs={gameTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            className="absolute bottom-0 left-0 w-full h-[34px] md:h-[39.6px] bg-[#2C2C2C]"/>
    </div>
  )
}

export default DetailsImageCard