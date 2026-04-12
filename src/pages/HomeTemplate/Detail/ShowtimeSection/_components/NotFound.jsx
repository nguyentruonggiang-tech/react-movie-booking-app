export default function NotFound() {
    return (
        <section className="relative z-10 mx-auto mt-10 max-w-7xl px-8 pb-6 md:pb-8">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111318]/90 shadow-xl">
                <div className="border-b border-white/10 px-6 py-4">
                    <h2 className="text-2xl font-bold text-white">Showtimes</h2>
                    <p className="mt-1 text-sm text-zinc-400">
                        Choose a cinema system and showtime.
                    </p>
                </div>

                <div className="px-6 py-10 text-center text-sm text-zinc-400">
                    No showtimes available.
                </div>
            </div>
        </section>
    );
}