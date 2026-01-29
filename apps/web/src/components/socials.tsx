import Facebook from "@/logos/facebook.svg?react";
import Instagram from "@/logos/instagram.svg?react";
import Telegram from "@/logos/telegram.svg?react";
import X from "@/logos/x.svg?react";

export const socials = [
	{
		id: 1,
		icon: Facebook,
		link: "https://www.facebook.com/sportsdey247",
	},
	{
		id: 2,
		icon: X,
		link: "https://X.com/sportsdey247",
	},
	{
		id: 3,
		icon: Instagram,
		link: "https://Instagram.com/Sportsdey247",
	},
	{
		id: 4,
		icon: Telegram,
		link: "https://t.me/sportsdey2",
	},
];
const Socials = () => {
	return (
		<div className="my-4 hidden justify-center px-8 md:px-0 lg:flex">
			<div className="flex h-10 items-center gap-6 rounded-full bg-primary px-6 py-6 dark:bg-card">
				<p className="text-secondary text-sm md:text-base dark:text-white">
					For more update follow us on:
				</p>
				<div className="flex items-center gap-2">
					{socials.map(({ icon: Icon, id, link }) => (
						<a
							key={id}
							href={link}
							target="_blank"
							rel="noopener noreferrer"
							className="flex size-8 items-center justify-center rounded-full bg-white p-2 dark:bg-white"
						>
							<Icon />
						</a>
					))}
				</div>
			</div>
		</div>
	);
};

export default Socials;
