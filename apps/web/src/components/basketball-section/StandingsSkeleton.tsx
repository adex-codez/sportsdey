import { Skeleton } from "@/components/ui/skeleton";

export function StandingsSkeleton() {
	return (
		<div className="fade-in max-w-screen animate-in rounded-xl border-0 bg-white py-4 shadow-xs duration-500">
			<div className="max-w-[calc(100vw-2rem)] overflow-x-auto md:max-w-none">
				<table className="w-full text-sm">
					<thead>
						<tr className="text-[10px] text-primary">
							<th className="w-[50px] py-2 text-center" />
							<th className="py-2 pr-4 text-left font-medium text-xs">
								Standings
							</th>
							{[1, 2, 3, 4, 5, 6, 7].map((i) => (
								<th key={i} className="px-2 py-2 text-center font-medium">
									<Skeleton className="mx-auto h-3 w-6 bg-gray-100" />
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{[1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
							<tr key={row} className="border-[#C8C8C8] border-t">
								<td className="w-[50px] py-2.5 text-center">
									<Skeleton className="mx-auto h-4 w-4 bg-gray-100" />
								</td>
								<td className="whitespace-nowrap py-2.5 pr-4">
									<Skeleton className="h-4 w-32 bg-gray-100" />
								</td>
								{[1, 2, 3, 4, 5, 6, 7].map((col) => (
									<td key={col} className="px-2 py-2.5 text-center">
										<Skeleton className="mx-auto h-3 w-6 bg-gray-100" />
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
