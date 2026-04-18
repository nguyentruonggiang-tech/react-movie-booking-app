import "./LoadingOverlay.css";

const BAR_COUNT = 12;

export default function LoadingOverlay({ message = "Đang tải…", className = "" }) {
    const rootClassName = ["loading-overlay", className].filter(Boolean).join(" ");

    return (
        <div className={rootClassName} role="status" aria-live="polite" aria-busy="true">
            <div className="radial-bar-spinner">
                <div className="radial-bar-spinner-inner" aria-hidden>
                    {Array.from({ length: BAR_COUNT }, (_, index) => (
                        <div key={index} />
                    ))}
                </div>
                {message ? <p className="loading-overlay__message">{message}</p> : null}
            </div>
        </div>
    );
}
