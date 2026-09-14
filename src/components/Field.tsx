"use client";

import { useId, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Icon } from "./Icon";

export const fieldClass =
  "w-full rounded-xl border border-line bg-surface px-4 py-3 text-base text-ink transition-colors duration-200 placeholder:text-ink-faint focus:border-teal focus:outline-none";

/**
 * Labelled field. The label is always visible — placeholder-as-label disappears
 * the moment someone starts typing, which is exactly when they need it.
 */
export function Field({
  label,
  htmlFor,
  required = false,
  hint,
  optionalLabel,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  /** Shown instead of the required marker when a field is genuinely optional. */
  optionalLabel?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={htmlFor}
        className="flex items-baseline gap-2 text-sm font-bold text-heading"
      >
        {label}
        {required && (
          <span aria-hidden="true" className="text-coral-ink">
            *
          </span>
        )}
        {optionalLabel && (
          <span className="text-xs font-medium text-ink-faint">
            {optionalLabel}
          </span>
        )}
      </label>
      {children}
      {hint && <p className="text-xs leading-relaxed text-ink-faint">{hint}</p>}
    </div>
  );
}

/**
 * Password input with a reveal toggle.
 *
 * The toggle matters for long passphrases — which is what the hint asks people
 * to use — and it is a real button with a changing accessible name, not an
 * icon that only communicates by shape.
 */
export function PasswordField({
  label,
  name,
  autoComplete,
  hint,
  minLength,
}: {
  label: string;
  name: string;
  autoComplete: "current-password" | "new-password";
  hint?: string;
  minLength?: number;
}) {
  const t = useTranslations("auth");
  const id = useId();
  const [visible, setVisible] = useState(false);

  return (
    <Field label={label} htmlFor={id} required hint={hint}>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          required
          minLength={minLength}
          autoComplete={autoComplete}
          dir="ltr"
          className={`${fieldClass} pe-12`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? t("hidePassword") : t("showPassword")}
          aria-pressed={visible}
          className="absolute inset-y-0 end-0 grid w-12 place-items-center rounded-e-xl text-ink-faint transition-colors hover:text-heading"
        >
          <Icon name={visible ? "eyeOff" : "eye"} className="h-5 w-5" />
        </button>
      </div>
    </Field>
  );
}
