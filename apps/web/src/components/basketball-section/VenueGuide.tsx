
const VenueGuide = ({ venueName }: { venueName: string }) => {
  return (
    <div className="w-full rounded-full h-10 bg-white">
      <div className="w-full h-full flex items-center justify-between px-4">
        <p className="text-xs md:text-sm font-semibold text-primary">Venue Guide</p>
        <p className="text-[#040C01] text-[10px]">{venueName}</p>
      </div>
    </div>
  )
}

export default VenueGuide