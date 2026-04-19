import { ADMIN_PAGE_SIZE } from "@constants";

export default function FilmSkeleton({ rows = ADMIN_PAGE_SIZE }) {
    let rowCount = rows;
    if (rowCount > 5) rowCount = 5;
    return (
        <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {Array.from({ length: rowCount }).map((_, i) => (
                <div key={i} className="flex gap-2 py-3">
                    <div className="h-12 w-9 shrink-0 self-start rounded bg-zinc-200 dark:bg-zinc-800" />
                    <div className="flex min-h-12 min-w-0 flex-1 flex-col justify-between gap-1">
                        <div className="h-3.5 w-2/5 max-w-[12rem] rounded bg-zinc-200 dark:bg-zinc-800" />
                        <div className="flex flex-wrap gap-1">
                            <div className="h-5 w-12 rounded-full bg-zinc-200/90 dark:bg-zinc-800/90" />
                            <div className="h-5 w-16 rounded-full bg-zinc-200/90 dark:bg-zinc-800/90" />
                            <div className="h-5 w-14 rounded-full bg-zinc-200/90 dark:bg-zinc-800/90" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
