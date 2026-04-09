import { memo } from "react";
import { WRAPPER_CLASS } from "./constants";

function BannerEmpty({
  message = "No banners available",
  action,
}) {
  return (
    <div className={`${WRAPPER_CLASS} flex flex-col items-center justify-center gap-4`}>
      <p className="text-sm text-white/60">{message}</p>
      {action ? <div>{action}</div> : null}
    </div>
  );
}

export default memo(BannerEmpty);