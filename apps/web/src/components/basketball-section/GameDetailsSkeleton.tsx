import { Skeleton } from "@/components/ui/skeleton";

export function GameDetailsSkeleton() {
    return (
        <div className="w-full space-y-3 pb-28 lg:pb-10 bg-gray-50/50">
            {/* Main Card Skeleton - Wrapper matches BasketBallDetailsPage */}
            <div className='py-4 lg:py-0'>
                <div className="h-64 w-full rounded-t-2xl bg-gray-900 relative overflow-hidden mx-auto">
                    <div className="w-full h-full flex flex-col gap-y-6 p-4">
                        {/* Top: Competition + Favorite Star */}
                        <div className="flex items-center justify-center relative">
                            <Skeleton className="h-4 w-52 bg-gray-700" />
                            <Skeleton className="absolute right-0 h-7 w-7 rounded-full bg-gray-700" />
                        </div>

                        {/* Middle: Teams + Score */}
                        <div className="flex items-center justify-center gap-6 md:gap-10 px-4">
                            {/* Home Team */}
                            <div className="flex flex-col items-center flex-1 max-w-[120px] md:max-w-none">
                                <Skeleton className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gray-700 mb-3" />
                                <Skeleton className="h-3 w-20 md:w-28 bg-gray-700 rounded" />
                            </div>

                            {/* Score & Status */}
                            <div className="flex flex-col items-center gap-3">
                                <Skeleton className="h-10 w-28 md:h-12 md:w-36 bg-gray-700 rounded" />
                                <Skeleton className="h-4 w-20 bg-green-600/20 rounded-full" />
                            </div>

                            {/* Away Team */}
                            <div className="flex flex-col items-center flex-1 max-w-[120px] md:max-w-none">
                                <Skeleton className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gray-700 mb-3" />
                                <Skeleton className="h-3 w-20 md:w-28 bg-gray-700 rounded" />
                            </div>
                        </div>

                        {/* Bottom Tabs */}
                        <div className="absolute bottom-0 left-0 w-full h-10 md:h-11 bg-[#2C2C2C] flex items-center px-4 gap-3 md:gap-6 overflow-hidden">
                            {[1, 2, 3, 4].map((i) => (
                                <Skeleton
                                    key={i}
                                    className="h-5 w-16 md:w-20 bg-gray-600 rounded-full"
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Content Below */}
            <div className="w-full px-4 space-y-5">
                {/* Score Summary */}
                <div className="w-full rounded-2xl p-5 shadow-sm space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                        <Skeleton className="h-5 w-32 bg-gray-200" />
                        <Skeleton className="h-5 w-12 bg-gray-200 rounded-full" />
                    </div>
                    <div className="space-y-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="w-10 h-10 rounded-full bg-gray-200" />
                                    <Skeleton className="h-4 w-28 bg-gray-200 rounded" />
                                </div>
                                <div className="flex gap-4">
                                    {[1, 2, 3, 4, 5].map((j) => (
                                        <Skeleton key={j} className="h-7 w-8 bg-gray-200 rounded" />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Venue Info */}
                <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
                    <Skeleton className="w-12 h-12 rounded-full bg-gray-200" />
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-32 bg-gray-200 rounded" />
                        <Skeleton className="h-3 w-48 bg-gray-200 rounded" />
                    </div>
                </div>

                {/* Extra Content Skeleton */}
                <div className="space-y-4">
                    {[1].map((i) => (
                        <div key={i} className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
                            <Skeleton className="h-5 w-40 bg-gray-200 rounded" />
                            <div className="space-y-3">
                                {[1, 2].map((j) => (
                                    <div key={j} className="flex items-center justify-between">
                                        <Skeleton className="h-4 w-32 bg-gray-200 rounded" />
                                        <Skeleton className="h-4 w-16 bg-gray-200 rounded" />
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