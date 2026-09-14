import { Icon } from "./Icon";

/**
 * Shown after a submit that cannot succeed because nothing is wired up behind
 * it. Deliberately not a fake success screen: a demo that pretends to log you
 * in teaches the client the wrong thing about what has been built.
 */
export function NotConnectedNotice({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  /** Optional way out, so a blocked form is never a dead end. */
  action?: React.ReactNode;
}) {
  return (
    <div
      role="status"
      className="flex items-start gap-3.5 rounded-xl border border-gold-200 bg-gold-50 p-4"
    >
      <Icon name="secure" className="mt-0.5 h-5 w-5 text-gold-ink" />
      <div>
        <p className="text-sm font-bold text-heading">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-ink-muted">{body}</p>
        {action && <div className="mt-3">{action}</div>}
      </div>
    </div>
  );
}
