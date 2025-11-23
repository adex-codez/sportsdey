import Badge from "./Badge"
import CalendarBadge from "./CalendarBadge";

const FixtureFilterHeaders = () => {
  const data: { label: "all" | "live" | "finished" | "upcoming"; count: number }[] = [
    {label: "all", count: 9},
    {label: "live", count: 2},
    {label: "finished", count: 4},
    {label: "upcoming", count: 3},
  ]
  
  return (
    <div className='w-full flex items-start justify-between gap-x-2'>
      <div className="flex items-center gap-x-2">

      {
        data.map((item, index)=> ( <Badge totalNumber={item.count} label={item.label} key={index}/>))
      }
      </div>
      <div className="">
        <CalendarBadge/>
      </div>
       
    </div>
  )
}

export default FixtureFilterHeaders