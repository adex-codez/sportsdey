import { createFileRoute } from "@tanstack/react-router";
import { getNewsById } from "@/lib/news-server";
import { PortableText } from "@portabletext/react";
import { urlFor } from "@/lib/sanity";

export const Route = createFileRoute("/news/$newsId")({
	loader: ({ params }) => getNewsById({ data: params.newsId }),
	component: RouteComponent,
});

function RouteComponent() {
	const news = Route.useLoaderData();

	if (!news)
		return <div className="p-8 text-center uppercase">News not found</div>;

	return (
		<div className="mx-auto max-w-4xl rounded-xl bg-white p-4 shadow-sm">
			<img
				src={urlFor(news.image).url()}
				alt={news.title}
				className="mb-6 h-[400px] w-full rounded-lg object-cover"
			/>
			<h1 className="mb-4 text-3xl font-bold">{news.title}</h1>
			<p className="mb-8 text-sm text-gray-400">
				{new Date(news.publishedAt).toLocaleDateString()}
			</p>
			<div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
				<PortableText value={news.body} />
			</div>
		</div>
	);
}
