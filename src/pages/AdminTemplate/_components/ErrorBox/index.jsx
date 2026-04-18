import { NavLink } from "react-router-dom";

const FALLBACK_ERROR_MESSAGE = "Đã xảy ra lỗi không mong muốn.";

function resolveErrorMessage(message) {
    if (message == null) return FALLBACK_ERROR_MESSAGE;
    const s = String(message).trim();
    return s || FALLBACK_ERROR_MESSAGE;
}

const ALERT_ROOT =
    "w-full max-w-2xl mx-auto p-4 mb-4 text-sm text-fg-danger-strong rounded-base bg-red-900/70 border border-red-700/60";

const BTN_PRIMARY =
    "inline-flex items-center justify-center gap-1.5 rounded-md border border-transparent bg-red-600 px-3 py-1.5 text-xs font-medium leading-5 text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500/35";

const LINK_SECONDARY =
    "inline-flex items-center justify-center rounded-md border border-red-500/35 bg-red-950/20 px-3 py-1.5 text-xs font-medium text-red-100 hover:bg-red-950/55 focus:outline-none focus:ring-4 focus:ring-red-500/25";

/** Warning glyph via Tailwind utilities only (no inline SVG). */
const ICON_WARNING_CLASS =
    "me-2 mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center text-base font-normal leading-none text-red-400";


export default function ErrorBox({
    title,
    message,
    onRetry,
    backHref = "/admin",
    backLabel = "Trang quản trị",
}) {
    const errorText = resolveErrorMessage(message);

    return (
        <div className="relative z-20 flex w-full items-center justify-center bg-transparent px-8 py-12">
            <div role="alert" className={ALERT_ROOT}>
                <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start">
                        <span className={ICON_WARNING_CLASS} aria-hidden>
                            ⚠
                        </span>
                        <span className="sr-only">Lỗi</span>
                        <h3 className="font-medium text-red-50">{title}</h3>
                    </div>
                </div>
                <div className="mb-2 mt-2 leading-relaxed text-red-200/95">{errorText}</div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                    {onRetry ? (
                        <button type="button" onClick={onRetry} className={BTN_PRIMARY}>
                            Thử lại
                        </button>
                    ) : null}
                    <NavLink to={backHref} className={LINK_SECONDARY}>
                        {backLabel}
                    </NavLink>
                </div>
            </div>
        </div>
    );
}
