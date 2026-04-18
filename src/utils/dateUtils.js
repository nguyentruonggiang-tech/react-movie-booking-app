export function formatDate(dateInput, format = "yyyy-MM-dd") {
    if (!dateInput) return "";

    if (typeof dateInput === "string") {
        const trimmed = dateInput.trim();

        // API / locale: dd/MM/yyyy (Vietnam)
        const vn = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        if (vn) {
            const day = Number(vn[1]);
            const monthIndex = Number(vn[2]) - 1;
            const year = Number(vn[3]);
            const date = new Date(year, monthIndex, day);
            if (Number.isNaN(date.getTime())) return "";
            const yyyy = date.getFullYear();
            const MM = String(date.getMonth() + 1).padStart(2, "0");
            const dd = String(date.getDate()).padStart(2, "0");
            if (format === "yyyy-MM-dd") return `${yyyy}-${MM}-${dd}`;
            if (format === "dd/MM/yyyy") return `${dd}/${MM}/${yyyy}`;
            if (format === "MM/dd/yyyy") return `${MM}/${dd}/${yyyy}`;
        }

        if (trimmed.includes("T")) {
            const [datePart] = trimmed.split("T");

            if (format === "yyyy-MM-dd") return datePart;

            const [yyyy, MM, dd] = datePart.split("-");
            if (format === "dd/MM/yyyy") return `${dd}/${MM}/${yyyy}`;
            if (format === "MM/dd/yyyy") return `${MM}/${dd}/${yyyy}`;
        }
    }

    const date = new Date(dateInput);
    if (Number.isNaN(date.getTime())) return "";

    const yyyy = date.getFullYear();
    const MM = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    if (format === "yyyy-MM-dd") return `${yyyy}-${MM}-${dd}`;
    if (format === "dd/MM/yyyy") return `${dd}/${MM}/${yyyy}`;
    if (format === "MM/dd/yyyy") return `${MM}/${dd}/${yyyy}`;
    return `${yyyy}-${MM}-${dd}`;
}

export const formatDateInput = (date) => formatDate(date, "yyyy-MM-dd");
export const formatDateDisplay = (date) => formatDate(date, "dd/MM/yyyy");