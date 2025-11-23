import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

const CalendarBadge = () => {
      const [currentDate, setCurrentDate] = useState(new Date());

  const formatDate = (date: any) => {
    const options = { weekday: 'short', day: 'numeric', month: 'long' };
    return date.toLocaleDateString('en-US', options);
  };

  const goToPreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  return (
      <div className="bg-white h-8 px-2 py-4 flex items-center justify-center rounded-full">
      <div className="w-full max-w-2xl rounded-full">

        <div className="flex items-center justify-between gap-x-1">

          <button
            onClick={goToPreviousDay}
            className="shrink-0 w-6 h-6 cursor-pointer flex items-center justify-center transition-colors duration-200 active:scale-95"
            aria-label="Previous day"
          >
            <ChevronLeft className="w-3 h-3 text-[#040C01]" />
          </button>


          <div className="flex-1 text-center">
            <p className="text-sm font-semibold text-[#040C01]">
              {formatDate(currentDate)}
            </p>
          </div>


          <button
            onClick={goToNextDay}
            className="shrink-0 cursor-pointer w-6 h-6 flex items-center justify-center transition-colors duration-200 active:scale-95"
            aria-label="Next day"
          >
            <ChevronRight className="w-3 h-3 text-[#040C01]" />
          </button>
        </div>
        </div>
        </div>

  )
}

export default CalendarBadge