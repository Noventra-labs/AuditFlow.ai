interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: boolean;
}

export function Skeleton({ className = '', width, height, rounded }: SkeletonProps) {
  return (
    <div
      className={`bg-surface-container-high animate-pulse ${rounded ? 'rounded-full' : 'rounded'} ${className}`}
      style={{
        width: width || '100%',
        height: height || '1rem',
        background: 'linear-gradient(90deg, var(--color-surface-container-high) 25%, var(--color-surface-container-highest) 50%, var(--color-surface-container-high) 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
      }}
    />
  );
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-surface rounded-xl border border-outline-variant/5 p-5 space-y-3 ${className}`}>
      <Skeleton height="0.75rem" width="60%" />
      <Skeleton height="1.5rem" width="40%" />
      <Skeleton height="0.625rem" width="80%" />
    </div>
  );
}

export function SkeletonTableRow({ cols = 5 }: { cols?: number }) {
  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-outline-variant/5">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} height="0.875rem" width={`${Math.round(60 / cols)}%`} />
      ))}
    </div>
  );
}

export function SkeletonKpiStrip() {
  return (
    <div className="bg-surface rounded-xl overflow-hidden border border-outline-variant/10 grid grid-cols-6 divide-x divide-outline-variant/10">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="p-5 space-y-2">
          <Skeleton height="0.625rem" width="60%" />
          <Skeleton height="2rem" width="80%" />
          <Skeleton height="1.75rem" width="100%" />
        </div>
      ))}
    </div>
  );
}

export function SkeletonChart({ height = '220px' }: { height?: string }) {
  return (
    <div className="bg-surface rounded-xl p-6 border border-outline-variant/5">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-2">
          <Skeleton height="1rem" width="120px" />
          <Skeleton height="0.75rem" width="180px" />
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} height="2rem" width="50px" rounded />)}
        </div>
      </div>
      <Skeleton height={height} className="rounded" />
    </div>
  );
}

export function SkeletonAgentFeed() {
  return (
    <div className="bg-surface rounded-xl flex flex-col border border-outline-variant/5 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant/10">
        <div className="flex items-center gap-2">
          <Skeleton width="8px" height="8px" rounded />
          <Skeleton height="0.625rem" width="80px" />
        </div>
        <Skeleton height="0.625rem" width="40px" />
      </div>
      <div className="p-3 space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex gap-2">
            <Skeleton height="0.625rem" width="50px" />
            <Skeleton height="0.625rem" width="60px" />
            <Skeleton height="0.625rem" width="40%" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonDeadlineList() {
  return (
    <div className="bg-surface rounded-xl p-5 border border-outline-variant/5 space-y-3">
      <Skeleton height="0.75rem" width="120px" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg">
          <Skeleton width="28px" height="28px" rounded />
          <div className="flex-1 space-y-1">
            <Skeleton height="0.75rem" width="70%" />
            <Skeleton height="0.625rem" width="40%" />
          </div>
          <Skeleton height="1.25rem" width="50px" rounded />
        </div>
      ))}
    </div>
  );
}
