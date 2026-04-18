import { NavLink } from "react-router-dom";

const primaryButtonClassName =
    "inline-flex rounded-full bg-rose-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-rose-500 cursor-pointer";

export default function NotFound({
    title,
    message = "",
    backHref = "/admin",
    backLabel = "Back to admin",
    actionLabel,
    onActionClick,
}) {
    const showActionButton =
        typeof onActionClick === "function" &&
        typeof actionLabel === "string" &&
        actionLabel.trim() !== "";
   
    return (
        <div className="relative z-20 flex w-full items-center justify-center bg-transparent px-8 py-12">
            <div className="mx-auto w-full max-w-2xl rounded-xl border border-zinc-700/80 bg-zinc-900/50 px-6 py-10 text-center">
                <h1 className="text-xl font-bold text-white">{title}</h1>
                {message ? (
                    <p className="mt-3 text-sm text-zinc-400">{message}</p>
                ) : null}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    {showActionButton ? (
                        <button
                            type="button"
                            onClick={onActionClick}
                            className={primaryButtonClassName}
                        >
                            {actionLabel}
                        </button>
                    ) : 
                        <NavLink to={backHref} className={primaryButtonClassName}>
                            {backLabel}
                        </NavLink>
                    }
                </div>
            </div>
        </div>
    );
}
