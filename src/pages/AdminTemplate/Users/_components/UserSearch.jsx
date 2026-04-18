import { Search } from "flowbite-react-icons/outline";

export default function UserSearch({ value, onChange, onClear }) {
    return (
        <label className="relative block min-w-[200px] flex-1">
            <span className="sr-only">Tìm người dùng</span>
            <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                aria-hidden
            />
            <input
                type="search"
                placeholder="Tìm người dùng…"
                value={value}
                onChange={onChange}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950/50 py-2 pl-10 pr-[7.5rem] text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:appearance-none"
            />
            {value && onClear ? (
                <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 whitespace-nowrap rounded px-1.5 py-0.5 text-xs text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
                    onClick={onClear}
                >
                    Xóa bộ lọc
                </button>
            ) : null}
        </label>
    );
}
