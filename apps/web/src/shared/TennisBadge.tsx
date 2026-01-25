import { useDispatch } from "react-redux";
import { useAppSelector } from "@/store/hook";
import { setActiveFilter } from "@/store/slices/tennisSlice";

interface TennisBadgeProps {
	label: "all" | "live" | "finished" | "upcoming";
	totalNumber: number;
}

const TennisBadge = ({ label, totalNumber }: TennisBadgeProps) => {
	const activeFilter = useAppSelector((state) => state.tennis.activeFilter);
	const dispatch = useDispatch();

	const handleFilterChange = () => {
		dispatch(setActiveFilter(label));
	};
	return (
		<button
			onClick={handleFilterChange}
			title="filter"
			type="button"
			className={`flex h-12 w-max cursor-pointer items-center justify-center gap-x-2 rounded-2xl px-4 text-xs capitalize ${activeFilter === label ? "bg-[#4BA53D] text-white" : "bg-white text-[#040C01]"}`}
		>
			{label}
			<span
				className={`flex h-6 w-6 items-center justify-center rounded-full text-[9px] text-white ${activeFilter === label ? "bg-[#456041]" : "bg-[#040C01]"}`}
			>
				{totalNumber}
			</span>
		</button>
	);
};

export default TennisBadge;
