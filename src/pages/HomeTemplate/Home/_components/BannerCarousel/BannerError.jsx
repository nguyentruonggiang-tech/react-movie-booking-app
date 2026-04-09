import BannerEmpty from "./BannerEmpty";

export default function BannerError({ error, onRetry }) {
  return (
    <BannerEmpty
      message={String(error)}
      action={
        <button
          type="button"
          className="cursor-pointer rounded-full bg-red-600 px-6 py-2 text-sm font-semibold text-white hover:bg-red-500"
          onClick={onRetry}
        >
          Retry
        </button>
      }
    />
  );
}