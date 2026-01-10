import { useCurrentFilter } from '@/hooks/use-current-filter'
import React from 'react'


interface BadgeProps {
    label: "all" | "live"| "finished"|"upcoming"
    totalNumber: number
}

const Badge = ({label, totalNumber}: BadgeProps) => {
      const { currentFilter: activeFilter, changeCurrentFilter } = useCurrentFilter()

      const handleFilterChange = () => {
        changeCurrentFilter(label)
      }
  return (
        <button onClick={handleFilterChange} title='filter' type='button' className={`cursor-pointer w-max px-4 capitalize flex justify-center gap-x-2 h-12 text-xs items-center rounded-2xl ${activeFilter === label ? "bg-[#4BA53D] text-white": "bg-white text-[#040C01]"}`}>
            {label}
            <span className={`w-6 text-[9px] flex justify-center items-center h-6 text-white rounded-full ${activeFilter === label ? "bg-[#456041]": "bg-[#040C01]"}`}>{totalNumber}</span>
        </button>
  )
}

export default Badge