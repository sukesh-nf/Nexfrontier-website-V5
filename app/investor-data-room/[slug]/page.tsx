import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTopicBySlug, dataRoomTopics } from '@/data/data-room-registry';
import { RuntimeTopicPage } from '@/components/drm/RuntimeTopicPage';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return dataRoomTopics.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) {
    return { title: 'Not available', robots: { index: false, follow: false } };
  }
  return {
    title: `${topic.title} — Investor Data Room`,
    robots: { index: false, follow: false },
  };
}

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);

  if (!topic) {
    notFound();
  }

  // Always render the shell — access control is handled client-side.
  // This allows admin preview for inactive pages via ?preview=1.
  return (
    <RuntimeTopicPage
      slug={topic.slug}
      title={topic.title}
      question={topic.question}
    />
  );
}
