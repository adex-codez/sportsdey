import Facebook from "@/logos/facebook.svg?react";
import Instagram from "@/logos/instagram.svg?react";
import Telegram from "@/logos/telegram.svg?react";
import X from "@/logos/x.svg?react";

const socials = [
	{
		id: 1,
		icon: Facebook,
	},
	{
		id: 2,
		icon: X,
	},
	{
		id: 1,
		icon: Instagram,
	},
	{
		id: 1,
		icon: Telegram,
	},
];
const Socials = () => {
	return (
		<div className="my-4 flex justify-center px-8 md:px-0">
			<div className="flex h-10 items-center gap-6 rounded-full bg-primary px-6 py-6">
				<p className="text-secondary text-sm md:text-base">
					For more update follow us on:
				</p>
				<div className="flex items-center gap-2">
					{socials.map(({ icon: Icon, id }) => (
						<div
							key={id}
							className="flex size-8 items-center justify-center rounded-full bg-white p-2"
						>
							<Icon />
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Socials;
