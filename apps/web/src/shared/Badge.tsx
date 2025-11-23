import { useAppSelector } from '@/store/hook'
import { setActiveFilter } from '@/store/slices/basketballSlice'
import React from 'react'
import { useDispatch } from 'react-redux'


interface BadgeProps {
    label: "all" | "live"| "finished"|"upcoming"
    totalNumber: number
}

const Badge = ({label, totalNumber}: BadgeProps) => {
      const activeFilter = useAppSelector((state => state.basketball.activeFilter))
      const dispatch = useDispatch()

      const handleFilterChange = () => {
        dispatch(setActiveFilter(label))
      }
  return (


        <button onClick={handleFilterChange} title='filter' type='button' className={`cursor-pointer w-max px-4 capitalize flex justify-center gap-x-2 h-14 text-xs items-center rounded-2xl ${activeFilter === label ? "bg-[#4BA53D] text-white": "bg-white text-[#040C01]"}`}>
            {label}
            <span className={`w-6 text-[9px] flex justify-center items-center h-6 text-white rounded-full ${activeFilter === label ? "bg-[#456041]": "bg-[#040C01]"}`}>{totalNumber}</span>
        </button>
  
  )
}

export default Badge