/** Shared SVG icons for HomeTemplate (Home + Detail). */

export function PlayIcon({ className }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
        >
            <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
            />
            <path d="M10 8.5v7l5.5-3.5z" fill="currentColor" />
        </svg>
    );
}

export function TicketIcon({ className }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
        >
            <path
                fillRule="evenodd"
                d="M1.5 6.75A2.25 2.25 0 0 1 3.75 4.5h16.5a2.25 2.25 0 0 1 2.25 2.25v.75a.75.75 0 0 1-.75.75H21a3 3 0 0 0 0 6h.75a.75.75 0 0 1 .75.75v.75a2.25 2.25 0 0 1-2.25 2.25H3.75a2.25 2.25 0 0 1-2.25-2.25v-.75a.75.75 0 0 1 .75-.75H3a3 3 0 0 0 0-6h-.25a.75.75 0 0 1-.75-.75v-.75Z"
                clipRule="evenodd"
            />
        </svg>
    );
}

export function InfoIcon({ className }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            aria-hidden
        >
            <path
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
        </svg>
    );
}

export function IconStarFilled({ className }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            width="24"
            height="24"
            aria-hidden
        >
            <path
                fill="currentColor"
                d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            />
        </svg>
    );
}
