import { PortableText } from "@portabletext/react";
import { Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useNewsData } from "@/hooks/use-news-data";
import { urlFor } from "@/lib/sanity";

export const NewsPage = ({ sport }: { sport: string }) => {
	const { data, isLoading } = useNewsData(sport);
	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center space-y-2">
				<Loader2 className="animate-spin" width={24} height={24} />
				<p className="text-gray-500 text-sm">Loading news...</p>
			</div>
		);
	}

	return (
		<div className="rounded-lg bg-white dark:bg-card/60">
			{data?.length === 0 ? (
				<p className="py-4 text-center text-gray-500 dark:text-white">
					No news found
				</p>
			) : (
				<p className="border-gray-200 border-b px-4 py-2 font-semibold text-base dark:border-[#5A5F63]">
					Latest News
				</p>
			)}
			<div className="grid grid-cols-1 gap-4 px-4 py-2 md:grid-cols-2 lg:grid-cols-3">
				{data?.map((news: any) => (
					<Link
						to="/news/$slug"
						params={{ slug: news.slug?.current }}
						key={news._id}
						className="flex cursor-pointer flex-col space-y-2 rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-0 dark:bg-card"
					>
						<div className="relative w-full overflow-hidden rounded-lg pb-[100%]">
							{news.image ? (
								<img
									src={urlFor(news.image).url()}
									alt={`${news.title}'s poster`}
									className="absolute top-0 left-0 h-full w-full object-cover object-center"
								/>
							) : (
								<div className="absolute top-0 left-0 h-full w-full bg-gray-100" />
							)}
						</div>
						<p className="mb-2 line-clamp-2 font-bold text-sm">{news.title}</p>
						<div className="line-clamp-3 text-gray-600 text-sm dark:text-gray-400">
							<PortableText value={news.body} />
						</div>
						<p className="mt-auto text-[10px] text-gray-400">
							{new Date(news.publishedAt).toLocaleDateString()}
						</p>
					</Link>
				))}
			</div>
		</div>
	);
};
