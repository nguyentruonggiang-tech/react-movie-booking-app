const EXTENSION_TO_MIME_TYPES = {
    jpg: ["image/jpeg"],
    jpeg: ["image/jpeg"],
    png: ["image/png"],
    gif: ["image/gif"],
    webp: ["image/webp"],
    svg: ["image/svg+xml"],
    pdf: ["application/pdf"],
};

const normalizeExtension = (ext) =>
    ext?.toLowerCase().replace(/^\./, "").trim();

// ===== check extension + mime =====
export function isAllowedFileType(file, allowedExtensions) {
    if (!file || !Array.isArray(allowedExtensions)) return false;

    const extensions = Array.from(
        new Set(allowedExtensions.map(normalizeExtension).filter(Boolean))
    );

    if (!extensions.length) return false;

    const fileName = file.name?.toLowerCase() || "";
    const fileMime = file.type?.split(";")[0].toLowerCase();

    if (extensions.some((ext) => fileName.endsWith(`.${ext}`))) {
        return true;
    }

    if (!fileMime) return false;

    return extensions.some((ext) =>
        EXTENSION_TO_MIME_TYPES[ext]?.includes(fileMime)
    );
}

// ===== validate full =====
export function validateFile(file, options = {}) {
    const { extensions = [], maxSize } = options;

    if (!file) {
        return {
            valid: false,
            error: "Vui lòng chọn file.",
        };
    }

    // ===== extension check =====
    if (extensions.length > 0) {
        const isValidExt = isAllowedFileType(file, extensions);

        if (!isValidExt) {
            return {
                valid: false,
                error: `Định dạng không hợp lệ. Cho phép: ${extensions.join(", ")}`,
            };
        }
    }

    // ===== size check =====
    if (typeof maxSize === "number" && maxSize > 0) {
        const maxBytes = maxSize * 1024 * 1024; // MB → bytes

        if (file.size > maxBytes) {
            return {
                valid: false,
                error: `File quá lớn. Tối đa ${maxSize}MB`,
            };
        }
    }

    return {
        valid: true,
        error: null,
    };
}
