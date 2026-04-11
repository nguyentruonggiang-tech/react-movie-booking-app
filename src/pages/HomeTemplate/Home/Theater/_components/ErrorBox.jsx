export default function ErrorBox({ message, onRetry }) {
    return (
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-white/10 bg-zinc-900/50 py-16">
            <p className="text-center text-sm text-zinc-400">{message}</p>

            <button
                type="button"
                onClick={onRetry}
                className="rounded-full bg-red-600 px-6 py-2 text-sm font-semibold text-white hover:bg-red-500"
            >
                Retry
            </button>
        </div>
    );
}