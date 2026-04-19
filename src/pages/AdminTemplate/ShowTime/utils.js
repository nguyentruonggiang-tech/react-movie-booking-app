import { formatDate } from "@utils/dateUtils";

export function flattenScheduleRows(raw) {
    const systems = Array.isArray(raw?.heThongRapChieu) ? raw.heThongRapChieu : [];
    const rows = [];
    for (const sys of systems) {
        const clusters = Array.isArray(sys?.cumRapChieu) ? sys.cumRapChieu : [];
        for (const cluster of clusters) {
            const sessions = Array.isArray(cluster?.lichChieuPhim) ? cluster.lichChieuPhim : [];
            for (const session of sessions) {
                rows.push({
                    session,
                    tenCumRap: cluster.tenCumRap ?? "",
                    maCumRap: cluster.maCumRap,
                    tenHeThongRap: sys.tenHeThongRap ?? "",
                });
            }
        }
    }
    return rows;
}

export function sessionMatchesDay(session, yyyyMmDd) {
    const fromRelease = formatDate(session?.ngayKhoiChieu, "yyyy-MM-dd");
    if (fromRelease) return fromRelease === yyyyMmDd;
    const fromShow = formatDate(session?.ngayChieuGioChieu, "yyyy-MM-dd");
    return Boolean(fromShow && fromShow === yyyyMmDd);
}

export function roomLineFromSession(session) {
    const raw =
        session?.tenRap ??
        session?.tenPhongChieu ??
        session?.tenPhong ??
        session?.tenRapChieu ??
        "";
    const t = String(raw).trim();
    return t || "—";
}

export function clusterRoomLine(row, session) {
    const cum = String(row.tenCumRap ?? "").trim();
    const rap = roomLineFromSession(session);
    const hasRap = rap && rap !== "—";
    if (cum && hasRap) return `${cum} – ${rap}`;
    if (cum) return cum;
    if (hasRap) return rap;
    return "—";
}
