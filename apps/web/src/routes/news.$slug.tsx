import { PortableText } from "@portabletext/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import BannerCarousel from "@/components/BannerCarousel";
import type { BannerData } from "@/lib/banners-server";
import { getBanners } from "@/lib/banners-server";
import { getNewsBySlug } from "@/lib/news-server";
import { urlFor } from "@/lib/sanity";

interface NewsAuthor {
	_id: string;
	name: string;
	slug: { current: string };
	image: any;
}

interface NewsItem {
	_id: string;
	title: string;
	publishedAt: string;
	image: any;
	slug: { current: string };
	body: any;
	author: NewsAuthor;
}

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
	loader: async ({ params }) => {
		const [news, banners] = await Promise.all([
			getNewsBySlug({ data: params.slug }),
			getBanners(),
		]);
		return { news, banners };
	},
	head: ({ loaderData }) => {
		const siteUrl = import.meta.env.VITE_PUBLIC_URL || "http://localhost:3001";
		const data = loaderData.news as NewsItem | null;
		const title = data?.title || "News | SportsDey";
		const description = getDescription(data?.body);
		const image = `${siteUrl}/news/${data?.slug?.current}/og`;

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
					content: `${siteUrl}/news/${data?.slug?.current}`,
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
	const { news, banners } = Route.useLoaderData() as {
		news: NewsItem | null;
		banners: BannerData[];
	};
	useEffect(() => {
		console.log(news);
	}, []);
	if (!news)
		return <div className="p-8 text-center uppercase">News not found</div>;

	return (
		<div className="mx-auto max-w-3xl rounded-xl bg-white p-4 shadow-sm dark:bg-card">
			{banners.length > 0 && (
				<div className="mb-4 w-full overflow-hidden rounded-xl">
					<BannerCarousel banners={banners} />
				</div>
			)}
			<Link
				to="/news"
				className="mb-4 inline-flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900 dark:text-white"
			>
				<ArrowLeft size={26} />
			</Link>
			<div className="relative w-full overflow-hidden rounded-lg pb-[65%]">
				{news.image ? (
					<img
						src={urlFor(news.image).url()}
						alt={news.title}
						className="absolute top-0 left-0 h-full w-full object-cover"
					/>
				) : (
					<div className="absolute top-0 left-0 h-full w-full bg-gray-100" />
				)}
			</div>
			<h1 className="mb-4 font-bold text-3xl">{news.title}</h1>
			<p className="mb-6 text-gray-400 text-sm">
				{new Date(news.publishedAt).toLocaleDateString()}
			</p>
			{news.author && (
				<Link
					to="/authors/$slug"
					params={{ slug: news.author.slug?.current }}
					className="mb-6 flex max-w-fit items-center gap-3 rounded-lg p-3 transition-colors hover:bg-gray-100 dark:bg-card/60 hover:dark:bg-[#5A5F63]"
				>
					<div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
						{news.author.image ? (
							<img
								src={urlFor(news.author.image).width(80).height(80).url()}
								alt={news.author.name}
								className="h-full w-full object-contain"
							/>
						) : (
							<div className="h-full w-full bg-gray-200" />
						)}
					</div>
					<span className="font-medium text-gray-900 dark:text-white">
						{news.author.name}
					</span>
				</Link>
			)}
			<div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
				<PortableText
					value={news.body}
					components={{
						block: {
							normal: ({ children }: any) => {
								const text = children.join("").trim();
								if (!text) return <div className="h-4" />;
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
