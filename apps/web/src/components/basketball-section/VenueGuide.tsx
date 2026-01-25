const VenueGuide = ({ venueName }: { venueName: string }) => {
	return (
		<div className="h-10 w-full rounded-full bg-white">
			<div className="flex h-full w-full items-center justify-between px-4">
				<p className="font-semibold text-primary text-xs md:text-sm">
					Venue Guide
				</p>
				<p className="text-[#040C01] text-[10px]">{venueName}</p>
			</div>
		</div>
	);
};

export default VenueGuide;
