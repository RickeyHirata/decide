export const releaseFlags = {
  public_guest_pilot: false,
  public_repost: false,
  decision_watch: false,
  public_follow_emphasis: false,
  opinion_poll: false,
  question_remix: false,
  history_search: false,
} as const;

export function requireFeature(name: keyof typeof releaseFlags): void {
  if (!releaseFlags[name]) throw new Error('FEATURE_DISABLED');
}
