function formatCalendar(yyyy, MM, dd, outFormat) {
    switch (outFormat) {
        case "dd/MM/yyyy":
            return `${dd}/${MM}/${yyyy}`;
        case "MM/dd/yyyy":
            return `${MM}/${dd}/${yyyy}`;
        case "yyyy-MM-dd":
        default:
            return `${yyyy}-${MM}-${dd}`;
    }
}

function partsFromLocalDate(year, month, day) {
    const date = new Date(year, month - 1, day);
    if (Number.isNaN(date.getTime())) return null;
    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        return null;
    }
    return {
        yyyy: String(year).padStart(4, "0"),
        MM: String(month).padStart(2, "0"),
        dd: String(day).padStart(2, "0"),
    };
}

export function formatDate(dateInput, format = "yyyy-MM-dd") {
    if (!dateInput) return "";

    if (typeof dateInput === "string") {
        const trimmed = dateInput.trim();

        const isoYmd = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (isoYmd) {
            const [, y, m, d] = isoYmd;
            return formatCalendar(y, m, d, format);
        }

        const vn = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        if (vn) {
            const year = Number(vn[3]);
            const month = Number(vn[2]);
            const day = Number(vn[1]);
            const parts = partsFromLocalDate(year, month, day);
            return parts ? formatCalendar(parts.yyyy, parts.MM, parts.dd, format) : "";
        }

        if (trimmed.includes("T")) {
            const [datePart] = trimmed.split("T");
            if (format === "yyyy-MM-dd" && /^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
                return datePart;
            }
            const segs = datePart.split("-");
            if (segs.length === 3) {
                const parts = partsFromLocalDate(
                    Number(segs[0]),
                    Number(segs[1]),
                    Number(segs[2]),
                );
                return parts
                    ? formatCalendar(parts.yyyy, parts.MM, parts.dd, format)
                    : "";
            }
            return "";
        }
    }

    const date = new Date(dateInput);
    if (Number.isNaN(date.getTime())) return "";
    const parts = partsFromLocalDate(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
    );
    return parts ? formatCalendar(parts.yyyy, parts.MM, parts.dd, format) : "";
}

export const formatDateInput = (date) => formatDate(date, "yyyy-MM-dd");
export const formatDateDisplay = (date) => formatDate(date, "dd/MM/yyyy");
