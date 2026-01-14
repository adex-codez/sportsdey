import { createFileRoute } from "@tanstack/react-router";
import { getNewsById } from "@/lib/news-server";
import { PortableText } from "@portabletext/react";
import { urlFor } from "@/lib/sanity";
import { useEffect } from "react";

export const Route = createFileRoute("/news/$newsId")({
	loader: ({ params }) => getNewsById({ data: params.newsId }),
	component: RouteComponent,
});

function RouteComponent() {
	const news = Route.useLoaderData();
	useEffect(() => {
		console.log(news.body);
	}, []);

	if (!news)
		return <div className="p-8 text-center uppercase">News not found</div>;

	return (
		<div className="mx-auto max-w-3xl rounded-xl bg-white p-4 shadow-sm">
			<div className="w-full pb-[65%] relative rounded-lg overflow-hidden">
				<img
					src={urlFor(news.image).url()}
					alt={news.title}
					className="absolute top-0 left-0 w-full h-full object-cover"
				/>
			</div>
			<h1 className="mb-4 text-3xl font-bold">{news.title}</h1>
			<p className="mb-8 text-sm text-gray-400">
				{new Date(news.publishedAt).toLocaleDateString()}
			</p>
			<div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
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
		</div>
	);
}
