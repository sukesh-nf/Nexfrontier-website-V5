/**
 * NexFrontier v4 Video Content Model
 *
 * Per Blueprint Part 4 sections 30-38:
 * - Every public video gets a customisable slug at /watch/<slug>
 * - Videos can appear embedded in multiple Question Spokes
 * - Video pages require meaningful supporting content to be published
 * - No fake YouTube URLs or fabricated metadata
 * - Publication gating: draft, review, published
 */

export type VideoStatus = 'draft' | 'review' | 'published';

export interface VideoArticle {
  id: string;
  status: VideoStatus;
  videoTitle: string;
  videoSlug: string;
  youtubeVideoId?: string;
  youtubeUrl?: string;
  summary: string;
  description: string;
  transcriptOrArticle?: string[];
  presenter: string;
  publishedDate?: string;
  updatedDate?: string;
  relatedQuestionIds: string[];
  relatedFrameworks: string[];
  seoTitle: string;
  metaDescription: string;
  canonicalPath: string;
  socialImage?: string;
  socialTitle?: string;
  legacySlugs?: string[];
}

/**
 * Video registry.
 * No videos exist yet. All entries are draft/development.
 * No YouTube URLs are fabricated.
 * This architecture supports future video content without changes.
 */
export const videoArticles: VideoArticle[] = [];

export function getPublishedVideos(): VideoArticle[] {
  return videoArticles.filter((v) => v.status === 'published');
}

export function getVideoBySlug(slug: string): VideoArticle | undefined {
  return videoArticles.find((v) => v.videoSlug === slug);
}

export function getPublishedVideo(slug: string): VideoArticle | undefined {
  return videoArticles.find((v) => v.videoSlug === slug && v.status === 'published');
}

export function getPublishedVideoSlugs(): string[] {
  return getPublishedVideos().map((v) => v.videoSlug);
}

export function getVideosForQuestion(questionId: string): VideoArticle[] {
  return getPublishedVideos().filter((v) => v.relatedQuestionIds.includes(questionId));
}
