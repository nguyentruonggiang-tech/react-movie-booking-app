import { ADMIN_PAGE_SIZE } from "@constants";

export default function UserSkeleton({ rows = ADMIN_PAGE_SIZE }) {
    let rowCount = rows;
    if (rowCount > 6) rowCount = 6;

    return (
        <>
            <div
                className="border-b border-zinc-800/80 bg-zinc-800 px-5 py-4"
                aria-hidden
            >
                <div className="flex items-center gap-4">
                    <div className="h-3 w-6 rounded bg-zinc-700/40" />
                    <div className="h-3 w-40 max-w-full flex-1 rounded bg-zinc-700/40" />
                </div>
            </div>
            <div className="bg-zinc-900 px-5 py-3">
                <div className="divide-y divide-zinc-800">
                    {Array.from({ length: rowCount }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 py-3 pl-1">
                            <div className="h-3.5 w-6 shrink-0 rounded bg-zinc-800" />
                            <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center">
                                <div className="h-3.5 w-28 max-w-full rounded bg-zinc-800" />
                                <div className="hidden h-3.5 flex-1 rounded bg-zinc-800/80 sm:block" />
                                <div className="h-3.5 w-24 rounded bg-zinc-800/80 sm:w-32" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div
                className="flex items-center justify-between border-t border-zinc-800/70 bg-zinc-900 px-5 py-4"
                aria-hidden
            >
                <div className="h-3 w-24 rounded bg-zinc-700/40" />
                <div className="flex gap-3">
                    <div className="h-8 w-8 rounded bg-zinc-700/40" />
                    <div className="h-8 w-8 rounded bg-zinc-700/40" />
                    <div className="h-8 w-8 rounded bg-zinc-700/40" />
                </div>
            </div>
        </>
    );
}
