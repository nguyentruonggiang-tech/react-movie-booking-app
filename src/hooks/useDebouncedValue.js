import { useEffect, useState } from "react";

export default function useDebouncedValue(value, delayMs = 500) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setDebouncedValue(value);
        }, delayMs);
        return () => window.clearTimeout(timeoutId);
    }, [value, delayMs]);

    return debouncedValue;
}
