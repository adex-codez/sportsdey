import type { FootballMatchInfoType } from "@/types/football";
import { useEffect } from "react";

type H2HFormProps = {
   homeH2H: FootballMatchInfoType["homeH2H"]; 
   awayH2H: FootballMatchInfoType["awayH2H"]; 
   homeName: FootballMatchInfoType["competitors"]["home"]["name"]; 
   awayName: FootballMatchInfoType["competitors"]["away"]["name"]; 
}

export const H2HForm = ({ homeH2H, awayH2H, homeName, awayName }: H2HFormProps) => {
  useEffect(() => {
    console.log(homeH2H, awayH2H) 
  }, [homeH2H, awayH2H]);
  if(!homeH2H || !awayH2H) return null;
   return (
      <div className="rounded-2xl bg-white">
				<div className="flex px-4 py-2 font-semibold">
					<p className="truncate"> Form(Most Recent at Right)</p>
				</div>
				<div className="flex items-center justify-between border-gray-200 border-t px-4 py-2">
					<p className="min-w-0 overflow-hidden truncate text-primary">
						{homeName}
					</p>
					<div className="flex items-center gap-3">
						{homeH2H?.map((match) => (
							<div
								key={match.id}
								className="flex size-6 p-2 items-center justify-center rounded-full text-xs font-normal cursor-pointer text-white"
								style={{
									backgroundColor:
										match.result === "win"
											? "#4EAC31"
											: match.result === "loss"
												? "#EB3343"
												: "#EF8031",
								}}
							>
								{match.result === "win" ? "W" : match.result === "loss" ? "L" : "D"}
							</div>
						))}
					</div>
				</div>
				<div className="flex items-center justify-between border-gray-200 border-t px-4 py-2">
					<p className="min-w-0 overflow-hidden truncate text-primary">
						{awayName}
					</p>

					<div>
						<div className="flex items-center gap-3">
							{awayH2H?.map((match) => (
								<div
									key={match.id}
									className="flex cursor-pointer p-2 size-6 items-center justify-center rounded-full text-xs font-normal text-white"
									style={{
										backgroundColor:
											match.result === "win"
												? "#4EAC31"
												: match.result === "loss"
													? "#EB3343"
													: "#EF8031",
									}}
								>
									{match.result === "win" ? "W" : match.result === "loss" ? "L" : "D"}
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
   );
};