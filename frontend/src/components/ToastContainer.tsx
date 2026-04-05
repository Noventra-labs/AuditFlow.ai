import { useToast, type ToastVariant } from '../context/ToastContext';

const variantStyles: Record<ToastVariant, { bg: string; border: string; icon: string; iconColor: string }> = {
  success: { bg: 'bg-surface-container-high', border: 'border-primary/30', icon: 'check_circle', iconColor: 'text-primary' },
  error: { bg: 'bg-surface-container-high', border: 'border-error/30', icon: 'error', iconColor: 'text-error' },
  warning: { bg: 'bg-surface-container-high', border: 'border-amber-500/30', icon: 'warning', iconColor: 'text-amber-500' },
  info: { bg: 'bg-surface-container-high', border: 'border-primary/30', icon: 'info', iconColor: 'text-primary' },
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => {
        const style = variantStyles[toast.variant];
        return (
          <div
            key={toast.id}
            className={`${style.bg} border ${style.border} rounded-xl p-4 shadow-2xl min-w-[320px] max-w-[420px] pointer-events-auto flex items-start gap-3 animate-slide-in`}
          >
            <span className={`material-symbols-outlined ${style.iconColor} shrink-0 mt-0.5`} style={{ fontVariationSettings: "'FILL' 1" }}>
              {style.icon}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-on-surface">{toast.title}</p>
                {toast.statusCode && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    toast.statusCode >= 200 && toast.statusCode < 300 ? 'bg-primary/10 text-primary' : 'bg-error/10 text-error'
                  }`}>
                    {toast.statusCode}
                  </span>
                )}
              </div>
              {toast.message && (
                <p className="text-xs text-on-surface-variant mt-0.5">{toast.message}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-on-surface-variant hover:text-on-surface transition-colors p-0.5"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
