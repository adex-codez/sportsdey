import { Skeleton } from "@/components/ui/skeleton";

export function GameDetailsSkeleton() {
	return (
		<div className="w-full space-y-3 bg-gray-50/50 pb-28 lg:pb-10">
			{/* Main Card Skeleton - Wrapper matches BasketBallDetailsPage */}
			<div className="py-4 lg:py-0">
				<div className="relative mx-auto h-64 w-full overflow-hidden rounded-t-2xl bg-gray-900">
					<div className="flex h-full w-full flex-col gap-y-6 p-4">
						{/* Top: Competition + Favorite Star */}
						<div className="relative flex items-center justify-center">
							<Skeleton className="h-4 w-52 bg-gray-700" />
							<Skeleton className="absolute right-0 h-7 w-7 rounded-full bg-gray-700" />
						</div>

						{/* Middle: Teams + Score */}
						<div className="flex items-center justify-center gap-6 px-4 md:gap-10">
							{/* Home Team */}
							<div className="flex max-w-[120px] flex-1 flex-col items-center md:max-w-none">
								<Skeleton className="mb-3 h-12 w-12 rounded-full bg-gray-700 md:h-16 md:w-16" />
								<Skeleton className="h-3 w-20 rounded bg-gray-700 md:w-28" />
							</div>

							{/* Score & Status */}
							<div className="flex flex-col items-center gap-3">
								<Skeleton className="h-10 w-28 rounded bg-gray-700 md:h-12 md:w-36" />
								<Skeleton className="h-4 w-20 rounded-full bg-green-600/20" />
							</div>

							{/* Away Team */}
							<div className="flex max-w-[120px] flex-1 flex-col items-center md:max-w-none">
								<Skeleton className="mb-3 h-12 w-12 rounded-full bg-gray-700 md:h-16 md:w-16" />
								<Skeleton className="h-3 w-20 rounded bg-gray-700 md:w-28" />
							</div>
						</div>

						{/* Bottom Tabs */}
						<div className="absolute bottom-0 left-0 flex h-10 w-full items-center gap-3 overflow-hidden bg-[#2C2C2C] px-4 md:h-11 md:gap-6">
							{[1, 2, 3, 4].map((i) => (
								<Skeleton
									key={i}
									className="h-5 w-16 rounded-full bg-gray-600 md:w-20"
								/>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Tab Content Below */}
			<div className="w-full space-y-5 px-4">
				{/* Score Summary */}
				<div className="w-full space-y-4 rounded-2xl p-5 shadow-sm">
					<div className="flex items-center justify-between border-gray-200 border-b pb-3">
						<Skeleton className="h-5 w-32 bg-gray-200" />
						<Skeleton className="h-5 w-12 rounded-full bg-gray-200" />
					</div>
					<div className="space-y-4">
						{[1, 2].map((i) => (
							<div key={i} className="flex items-center justify-between">
								<div className="flex items-center gap-3">
									<Skeleton className="h-10 w-10 rounded-full bg-gray-200" />
									<Skeleton className="h-4 w-28 rounded bg-gray-200" />
								</div>
								<div className="flex gap-4">
									{[1, 2, 3, 4, 5].map((j) => (
										<Skeleton key={j} className="h-7 w-8 rounded bg-gray-200" />
									))}
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Venue Info */}
				<div className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-sm">
					<Skeleton className="h-12 w-12 rounded-full bg-gray-200" />
					<div className="flex-1 space-y-2">
						<Skeleton className="h-4 w-32 rounded bg-gray-200" />
						<Skeleton className="h-3 w-48 rounded bg-gray-200" />
					</div>
				</div>

				{/* Extra Content Skeleton */}
				<div className="space-y-4">
					{[1].map((i) => (
						<div
							key={i}
							className="space-y-4 rounded-2xl bg-white p-5 shadow-sm"
						>
							<Skeleton className="h-5 w-40 rounded bg-gray-200" />
							<div className="space-y-3">
								{[1, 2].map((j) => (
									<div key={j} className="flex items-center justify-between">
										<Skeleton className="h-4 w-32 rounded bg-gray-200" />
										<Skeleton className="h-4 w-16 rounded bg-gray-200" />
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
