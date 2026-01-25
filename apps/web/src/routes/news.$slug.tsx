import { PortableText } from "@portabletext/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { getNewsBySlug } from "@/lib/news-server";
import { urlFor } from "@/lib/sanity";
import { formatRelativeTime } from "@/lib/utils";
import { ShareButton } from "@/components/ShareButton";

function getDescription(body: any): string {
	if (!Array.isArray(body)) return "Read the latest news on SportsDey";
	const block = body.find((b: any) => b._type === "block" && b.children);
	if (block?.children) {
		const text = block.children.map((c: any) => c.text).join(" ");
		return text.slice(0, 160) + (text.length > 160 ? "..." : "");
	}
	return "Read the latest news on SportsDey";
}

export const Route = createFileRoute("/news/$slug")({
	loader: ({ params }) => getNewsBySlug({ data: params.slug }),
	head: ({ loaderData }) => {
		const siteUrl = import.meta.env.VITE_PUBLIC_URL || "http://localhost:3001";
		const title = loaderData?.title || "News | SportsDey";
		const description = getDescription(loaderData?.body);
		const image = loaderData?.image ? urlFor(loaderData.image).width(1200).height(630).url() : `${siteUrl}/news/${loaderData?.slug?.current}/og`;

		return {
			meta: [
				{
					title,
				},
				{
					name: "description",
					content: description,
				},
				{
					property: "og:title",
					content: title,
				},
				{
					property: "og:description",
					content: description,
				},
				{
					property: "og:image",
					content: image,
				},
				{
					property: "og:type",
					content: "article",
				},
				{
					property: "og:url",
					content: `${siteUrl}/news/${loaderData?.slug?.current}`,
				},
				{
					name: "twitter:card",
					content: "summary_large_image",
				},
				{
					name: "twitter:title",
					content: title,
				},
				{
					name: "twitter:description",
					content: description,
				},
				{
					name: "twitter:image",
					content: image,
				},
			],
		};
	},
	component: RouteComponent,
});

function RouteComponent() {
	const news = Route.useLoaderData();

	if (!news)
		return <div className="p-8 text-center uppercase">News not found</div>;

	return (
		<div className="mx-auto max-w-3xl rounded-xl bg-white p-4 shadow-sm">
			<Link
				to="/news"
				className="mb-4 inline-flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900"
			>
				<ArrowLeft size={26} />
			</Link>
			<div className="relative w-full overflow-hidden rounded-lg pb-[65%]">
				<img
					src={urlFor(news.image).url()}
					alt={news.title}
					className="absolute top-0 left-0 h-full w-full object-cover"
				/>
			</div>
			<h1 className="mb-4 font-bold text-3xl">{news.title}</h1>
			<div className="flex items-center justify-between mb-8">
				<p className="text-gray-400 text-sm">
					{formatRelativeTime(news.publishedAt)}
				</p>
				<ShareButton
					url={window.location.href}
					title={news.title}
					className="bg-gray-50 hover:bg-gray-100"
				/>
			</div>
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
