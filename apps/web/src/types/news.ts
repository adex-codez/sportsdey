export interface NewsVideo {
	videoEmbedUrl: string;
	publishedAt: string;
	title: string;
}

export interface NewsResponse {
	nextPageToken?: string;
	prevPageToken?: string;
	videos: NewsVideo[];
}
