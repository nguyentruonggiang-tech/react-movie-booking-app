import { WRAPPER_CLASS } from "./constants";

export default function BannerLoading() {
  return (
    <div className={`${WRAPPER_CLASS} flex items-center justify-center`}>
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
    </div>
  );
}