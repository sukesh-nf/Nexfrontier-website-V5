import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  spokeArticles, questionGroups,
  type QuestionGroupSlug,
} from '@/data/spokes';

export type QuestionState = 'exploring' | 'available';

export interface HubQuestion {
  id: string;
  question: string;
  group: QuestionGroupSlug;
  slug?: string;
  state: QuestionState;
}

function buildQuestionSet(): HubQuestion[] {
  return spokeArticles
    .filter((a) => a.status !== 'archived')
    .map((a) => ({
      id: a.id,
      question: a.question,
      group: a.group,
      slug: a.status === 'published' ? a.slug : undefined,
      state: a.status === 'published' ? 'available' as const : 'exploring' as const,
    }));
}

export function ReadingTheShiftHub() {
  const questions = buildQuestionSet();
  const publishedCount = questions.filter((q) => q.state === 'available').length;

  return (
    <div className="nf-rts-hub">
      {/* Status line */}
      <p className="nf-rts-status-line">
        {publishedCount > 0
          ? `${publishedCount} answer${publishedCount === 1 ? '' : 's'} available now. More questions will become active as articles are published.`
          : 'These are the questions NexFrontier is actively exploring. Answers will be published progressively.'}
      </p>

      {/* Question groups */}
      <div className="nf-rts-groups">
        {questionGroups.map((group) => {
          const groupQuestions = questions.filter((q) => q.group === group.slug);
          if (groupQuestions.length === 0) return null;

          return (
            <section key={group.slug} className="nf-rts-group">
              <div className="nf-rts-group-header">
                <h2 className="nf-rts-group-title">{group.name}</h2>
                <p className="nf-rts-group-purpose">{group.purpose}</p>
              </div>
              <div className="nf-rts-questions">
                {groupQuestions.map((q) => (
                  <QuestionRow key={q.id} question={q} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function QuestionRow({ question }: { question: HubQuestion }) {
  const isAvailable = question.state === 'available' && question.slug;

  if (isAvailable) {
    return (
      <Link
        href={`/reading-the-shift/${question.slug}`}
        className="nf-rts-question nf-rts-question--available"
      >
        <div className="nf-rts-question-content">
          <h3 className="nf-rts-question-text">{question.question}</h3>
          <span className="nf-rts-badge nf-rts-badge--available">Available</span>
        </div>
        <ArrowRight size={18} className="nf-rts-question-arrow" />
      </Link>
    );
  }

  return (
    <div className="nf-rts-question nf-rts-question--exploring">
      <div className="nf-rts-question-content">
        <h3 className="nf-rts-question-text">{question.question}</h3>
        <span className="nf-rts-badge nf-rts-badge--exploring">Exploring</span>
      </div>
    </div>
  );
}
