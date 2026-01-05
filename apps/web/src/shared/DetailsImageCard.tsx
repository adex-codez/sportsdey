import { TabNavigation } from "@/components/ui/tab-navigation";
import type { DetailsImageProps } from "@/types/basketball";

interface DetailsImageCardProps extends DetailsImageProps {
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
  onFavoriteToggle?: () => void;
  isHomeFavorite?: boolean;
  onToggleHomeFavorite?: () => void;
  isAwayFavorite?: boolean;
  onToggleAwayFavorite?: () => void;
  activeTab: string
  setActiveTab: (id: string) => void
  gameTabs: { id: string; label: string }[]
  isUpcoming?: boolean;
  countdownText?: string;
  scheduledDate?: string;
  scheduledTime?: string;
}

const DetailsImageCard = ({ competitionName,
  competitionCountry,
  hostTeamName,
  guestTeamName,
  hostTeamLogo,
  guestTeamLogo,
  guestTeamScore,
  hostTeamScore,
  isFavorite = false,
  onFavoriteToggle,
  isHomeFavorite = false,
  onToggleHomeFavorite,
  isAwayFavorite = false,
  onToggleAwayFavorite,
  activeTab,
  setActiveTab,
  gameTabs,
  matchStatus,
  isUpcoming = false,
  countdownText,
  scheduledDate,
  scheduledTime }: DetailsImageCardProps) => {

  return (
    <div className="h-64 w-full rounded-t-2xl rounded-b-0 bg-primary relative">
      <div className="w-full h-full">
        <div className="py-4 flex justify-center items-center relative">
          <span className="
    text-white text-xs md:text-sm font-semibold
    max-w-[65%]          
    sm:max-w-[75%]
    truncate            
    block
  ">
            {competitionCountry} - {competitionName}
          </span>
          <button
            onClick={onFavoriteToggle}
            className={`absolute right-4 text-xl border-none bg-transparent cursor-pointer transition-colors ${isFavorite ? 'text-yellow-400' : 'text-[#C8C8C8] hover:text-yellow-400'
              }`}
          >
            ★
          </button>
        </div>
        <div className='w-full flex justify-center md:gap-x-8 items-center px-4 md:px-6 mt-6'>

          <div className='w-full flex items-center lg:justify-end'>

            <button
              onClick={onToggleHomeFavorite}
              className={`text-xl border-none bg-transparent cursor-pointer transition-colors ${isHomeFavorite ? 'text-yellow-400' : 'text-[#C8C8C8] hover:text-yellow-400'
                }`}
            >
              ★
            </button>
            <div className='flex flex-col items-center mx-4'>
              <img src={hostTeamLogo} alt={hostTeamName} className='w-16 h-16 object-contain mx-auto' />
              <span className='text-white text-[10px] md:text-sm font-normal mt-2 block text-center h-8 md:h-auto flex items-start justify-center'>{hostTeamName}</span>
            </div>

          </div>
          <div className='w-full'>

            <div className='flex flex-col items-center gap-y-1.5'>
              {isUpcoming ? (
                <>
                  {scheduledDate && (
                    <span className="text-white text-xs md:text-sm font-medium">
                      {scheduledDate}
                    </span>
                  )}
                  {scheduledTime && (
                    <span className="text-white text-base md:text-2xl font-bold">
                      {scheduledTime}
                    </span>
                  )}
                  {countdownText && (
                    <span className="text-[10px] text-center md:text-sm space-y-1 font-semibold text-[#1BAA04] mt-1">
                      Starts in <br />
                      {countdownText}
                    </span>
                  )}
                </>
              ) : (
                <>
                  <span className={`text-base md:text-3xl font-semibold transition-colors duration-300 ${matchStatus?.toLowerCase() === 'live'
                    ? 'text-[#0E8F1A] animate-pulse'
                    : 'text-white'
                    }`}>
                    {hostTeamScore} - {guestTeamScore}
                  </span>
                  <span className={`text-xs md:text-sm font-medium mt-2 capitalize block text-center transition-colors duration-300 ${matchStatus?.toLowerCase() === 'live'
                    ? 'text-[#0E8F1A]'
                    : 'text-[#1BAA04]'
                    }`}>
                    {matchStatus}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className='flex flex-row-reverse items-center w-full lg:justify-end'>

            <button
              onClick={onToggleAwayFavorite}
              className={`text-xl border-none bg-transparent cursor-pointer transition-colors ${isAwayFavorite ? 'text-yellow-400' : 'text-[#C8C8C8] hover:text-yellow-400'
                }`}
            >
              ★
            </button>
            <div className='flex flex-col items-center mx-4'>
              <img src={guestTeamLogo} alt={guestTeamName} className='w-16 h-16 object-contain mx-auto' />
              <span className='text-white text-[10px] md:text-sm font-normal mt-2 block text-center h-8 md:h-auto flex items-start justify-center'>{guestTeamName}</span>
            </div>
          </div>
        </div>
      </div>

      <TabNavigation
        tabs={gameTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="absolute bottom-0 left-0 w-full h-[34px] md:h-[39.6px] bg-[#2C2C2C]" />
    </div>
  )
}

export default DetailsImageCard
