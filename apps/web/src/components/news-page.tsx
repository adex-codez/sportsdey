import { useNewsData } from "@/hooks/use-news-data";
import { Loader2 } from "lucide-react";
import { PortableText } from "@portabletext/react";
import { urlFor } from "@/lib/sanity";
import { Link } from "@tanstack/react-router";
import type { Sport } from "@/lib/constants";
import { useEffect } from "react";

export const NewsPage = ({ sport }: { sport: Sport }) => {
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
		<div className="rounded-lg bg-white">
			{data?.length === 0 ? (
				<p className="text-center py-4 text-gray-500">No news found</p>
			) : (
				<p className="font-semibold text-base px-4 py-2 border-b border-gray-200">
					Latest News
				</p>
			)}
			<div className="px-4 py-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{data?.map((news: any) => (
					<Link
						to="/news/$newsId"
						params={{ newsId: news._id }}
						key={news._id}
						className="flex flex-col p-4 border border-gray-100 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow space-y-2 cursor-pointer"
					>
						<div className="w-full pb-[100%] relative rounded-lg overflow-hidden">
							<img
								src={urlFor(news.image).url()}
								alt={`${news.title}'s poster`}
								className="absolute top-0 left-0 w-full h-full object-cover object-center"
							/>
						</div>
						<p className="text-sm font-bold mb-2 line-clamp-2">{news.title}</p>
						<div className="text-sm text-gray-600 line-clamp-3">
							<PortableText
								value={news.body}
								components={{
									block: {
										normal: ({ children }: any) => {
											const text = children.join("").trim();
											if (!text) return <div className="h-4" />; // empty line spacer
											return <p className="mb-4 leading-relaxed">{children}</p>;
										},
									},
									marks: {
										link: ({ value, children }: any) => (
											<a
												href={value?.href}
												target="_blank"
												rel="noopener noreferrer"
												className="text-blue-600 underline"
											>
												{children}
											</a>
										),
									},
								}}
							/>
						</div>
						<p className="text-[10px] text-gray-400 mt-auto">
							{new Date(news.publishedAt).toLocaleDateString()}
						</p>
					</Link>
				))}
			</div>
		</div>
	);
};
