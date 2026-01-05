import { Skeleton } from "@/components/ui/skeleton";

export function StandingsSkeleton() {
    return (
        <div className="bg-white border-0 shadow-xs py-4 rounded-xl max-w-screen animate-in fade-in duration-500">
            <div className="overflow-x-auto max-w-[calc(100vw-2rem)] md:max-w-none">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-primary text-[10px]">
                            <th className="text-center w-[50px] py-2"></th>
                            <th className="text-left py-2 pr-4 font-medium text-xs">Standings</th>
                            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                                <th key={i} className="text-center py-2 px-2 font-medium">
                                    <Skeleton className="h-3 w-6 mx-auto bg-gray-100" />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
                            <tr key={row} className="border-t border-[#C8C8C8]">
                                <td className="text-center w-[50px] py-2.5">
                                    <Skeleton className="h-4 w-4 mx-auto bg-gray-100" />
                                </td>
                                <td className="py-2.5 pr-4 whitespace-nowrap">
                                    <Skeleton className="h-4 w-32 bg-gray-100" />
                                </td>
                                {[1, 2, 3, 4, 5, 6, 7].map((col) => (
                                    <td key={col} className="py-2.5 px-2 text-center">
                                        <Skeleton className="h-3 w-6 mx-auto bg-gray-100" />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
