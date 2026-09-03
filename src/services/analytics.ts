/**
 * NexFrontier v4 Analytics Abstraction
 * Reusable event abstraction. No vendor is hardwired until confirmed.
 */

export type AnalyticsEventName =
  | 'main_cta_click'
  | 'hub_search'
  | 'hub_search_result_click'
  | 'hub_zero_result_search'
  | 'question_group_selection'
  | 'related_question_click'
  | 'youtube_play'
  | 'calculator_start'
  | 'calculator_stage_completion'
  | 'calculator_completion'
  | 'enterprise_value_report_request'
  | 'market_enquiry'
  | 'foundation_customer_request'
  | 'investor_information_request'
  | 'whitepaper_request'
  | 'reading_the_shift_subscription'
  | 'reading_search'
  | 'reading_search_zero_result'
  | 'reading_group_selected'
  | 'reading_question_opened'
  | 'reading_related_question_opened'
  | 'reading_subscription_started'
  | 'reading_subscription_completed'
  | 'video_page_opened'
  | 'video_play_started'
  | 'video_related_question_opened'
  | 'video_youtube_channel_clicked';

export interface AnalyticsEventProperties {
  [key: string]: string | number | boolean | undefined;
}

type AnalyticsSink = (name: AnalyticsEventName, properties?: AnalyticsEventProperties) => void;

let sink: AnalyticsSink | null = null;

export function setAnalyticsSink(impl: AnalyticsSink): void {
  sink = impl;
}

export function trackEvent(name: AnalyticsEventName, properties?: AnalyticsEventProperties): void {
  if (sink) {
    sink(name, properties);
    return;
  }
  if (process.env.NODE_ENV === 'development') {
    console.debug('[analytics]', name, properties ?? {});
  }
}
