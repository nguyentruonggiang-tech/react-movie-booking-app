export const AUTH_REDIRECT_QUERY = "redirect";

export function buildLoginUrlWithRedirect(location) {
    const target = `${location.pathname}${location.search}`;
    return `/login?${AUTH_REDIRECT_QUERY}=${encodeURIComponent(target)}`;
}
