import { NavLink } from "react-router-dom";

const FALLBACK_ERROR_MESSAGE = "Đã xảy ra lỗi không mong muốn.";

function resolveErrorMessage(message) {
    if (message == null) return FALLBACK_ERROR_MESSAGE;
    const s = String(message).trim();
    return s || FALLBACK_ERROR_MESSAGE;
}

function DangerAlertIcon({ className }) {
    return (
        <svg
            className={className}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
        >
            <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 11h2v5m-2 0h4m-2.592-8.5h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
        </svg>
    );
}

const ALERT_ROOT =
    "mx-auto mb-4 w-full max-w-2xl rounded-base border border-red-200 bg-red-50 p-4 text-sm text-red-900 " +
    "dark:border-red-700/60 dark:bg-red-900/70 dark:text-red-50";

const BTN_PRIMARY =
    "inline-flex items-center justify-center gap-1.5 rounded-md border border-transparent bg-red-600 px-3 py-1.5 text-xs font-medium leading-5 text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-500/35";

const LINK_SECONDARY =
    "inline-flex items-center justify-center rounded-md border border-red-300 bg-white px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-4 focus:ring-red-500/25 " +
    "dark:border-red-500/35 dark:bg-red-950/20 dark:text-red-100 dark:hover:bg-red-950/55";

export default function ErrorBox({ title, message, onRetry }) {
    const errorText = resolveErrorMessage(message);

    return (
        <div className="relative z-20 flex w-full items-center justify-center bg-transparent px-8 py-12">
            <div role="alert" className={ALERT_ROOT}>
                <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start">
                        <DangerAlertIcon className="me-2 mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
                        <span className="sr-only">Lỗi</span>
                        <h3 className="font-medium text-red-900 dark:text-red-50">{title}</h3>
                    </div>
                </div>
                <div className="mb-2 mt-2 leading-relaxed text-red-800 dark:text-red-200/95">
                    {errorText}
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                    {onRetry ? (
                        <button type="button" onClick={onRetry} className={BTN_PRIMARY}>
                            Thử lại
                        </button>
                    ) : null}
                    <NavLink to="/" className={LINK_SECONDARY}>
                        Về trang chủ
                    </NavLink>
                </div>
            </div>
        </div>
    );
}
