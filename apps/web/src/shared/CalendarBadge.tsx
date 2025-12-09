import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/store'
import { setDate } from '@/store/slices/dateSlice'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'

const CalendarBadge = () => {
  const dispatch = useDispatch();
  const selectedDateString = useSelector((state: RootState) => state.date.selectedDate);
  const selectedDate = new Date(selectedDateString);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'long' };
    return date.toLocaleDateString('en-US', options);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      dispatch(setDate(date.toISOString()));
    }
  };

  const goToPreviousDay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    dispatch(setDate(newDate.toISOString()));
  };

  const goToNextDay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    dispatch(setDate(newDate.toISOString()));
  };

  return (
    <Popover>
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

            <PopoverTrigger asChild>
              <div className="flex-1 text-center cursor-pointer hover:bg-gray-100 px-2 rounded-md transition-colors">
                <p className="text-sm font-semibold text-[#040C01]">
                  {formatDate(selectedDate)}
                </p>
              </div>
            </PopoverTrigger>

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
      <PopoverContent className="w-auto p-0" align="center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}

export default CalendarBadge