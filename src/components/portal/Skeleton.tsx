/**
 * Loading skeletons for the portal.
 *
 * The dashboard reads real client data, so there is a gap before it arrives.
 * A skeleton beats a spinner here because the layout is known in advance:
 * reserving the exact blocks stops the page jumping when data lands, which is
 * the cumulative-layout-shift problem a centred spinner creates.
 *
 * Every skeleton is `aria-hidden` and the region carries `aria-busy`, so
 * screen readers announce "loading" once instead of reading out empty boxes.
 */
function Bar({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      aria-hidden="true"
      style={style}
      className={`block animate-pulse rounded-md bg-ink-100 ${className}`}
    />
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
      {children}
    </div>
  );
}

export function OverviewSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8"
    >
      {/* Greeting */}
      <Bar className="h-9 w-64 max-w-full sm:h-11" />
      <Bar className="mt-3 h-4 w-48 max-w-full" />

      {/* Turn card — the tallest block, so its height is reserved exactly */}
      <div className="mt-6 rounded-2xl border border-line bg-surface p-6 sm:mt-8 sm:p-8">
        <Bar className="h-7 w-32 rounded-full" />
        <Bar className="mt-5 h-8 w-3/4 sm:h-10" />
        <Bar className="mt-3 h-4 w-full" />
        <Bar className="mt-2 h-4 w-5/6" />
        <Bar className="mt-6 h-12 w-44 rounded-xl" />
      </div>

      {/* The climb */}
      <div className="mt-5 sm:mt-6">
        <Card>
          <Bar className="h-5 w-28" />
          <div className="mt-7 hidden grid-cols-5 items-end gap-2.5 lg:grid">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col justify-end">
                <div className="rounded-xl border border-line p-4">
                  <Bar className="h-8 w-8 rounded-lg" />
                  <Bar className="mt-3 h-4 w-20" />
                  <Bar className="mt-2 h-3 w-14" />
                </div>
                <Bar
                  className="mt-2 rounded-t"
                  style={{ height: `${i * 16}px` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-4 lg:hidden">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex gap-3.5">
                <Bar className="h-9 w-9 shrink-0 rounded-lg" />
                <div className="flex-1">
                  <Bar className="h-4 w-32" />
                  <Bar className="mt-2 h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Session + files */}
      <div className="mt-5 grid gap-5 sm:mt-6 lg:grid-cols-2">
        <Card>
          <Bar className="h-3 w-24" />
          <Bar className="mt-4 h-5 w-3/4" />
          <div className="mt-4 flex flex-col gap-2">
            <Bar className="h-4 w-48" />
            <Bar className="h-4 w-24" />
            <Bar className="h-4 w-40" />
          </div>
          <Bar className="mt-5 h-12 w-full rounded-xl" />
        </Card>
        <Card>
          <Bar className="h-3 w-24" />
          <div className="mt-4 flex flex-col gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3.5">
                <Bar className="h-10 w-10 shrink-0 rounded-xl" />
                <div className="flex-1">
                  <Bar className="h-4 w-40 max-w-full" />
                  <Bar className="mt-2 h-3 w-28" />
                </div>
                <Bar className="h-10 w-10 shrink-0 rounded-lg" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Shortcuts */}
      <div className="mt-5 sm:mt-6">
        <Bar className="h-3 w-20" />
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Bar key={i} className="h-[5.5rem] rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
