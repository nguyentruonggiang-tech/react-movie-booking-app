
export default function ColumnEmpty({ title, description, compact = false }) {
    const shell = compact
        ? "rounded-lg border border-white/10 bg-zinc-900/40 px-4 py-10 text-center"
        : "flex h-[640px] max-h-[640px] flex-col items-center justify-center rounded-xl border border-white/10 bg-zinc-900/60 p-4 text-center";

    return (
        <div className={shell}>
            {title ? (
                <p className="text-sm font-semibold text-white">{title}</p>
            ) : null}
            <p
                className={`text-sm leading-relaxed text-zinc-400 ${
                    title ? "mt-2" : ""
                }`}
            >
                {description}
            </p>
        </div>
    );
}
