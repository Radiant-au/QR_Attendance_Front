const API_URL = "/api";

import { STORAGE_KEYS } from "../config";

type ApiFetchOptions = RequestInit & {
    skipAuth?: boolean;
    skipUnauthorizedRedirect?: boolean;
};

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
    const { skipAuth, skipUnauthorizedRedirect, headers, ...rest } = options;

    const response = await fetch(`${API_URL}${path}`, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...headers,
        },
        ...rest,
    });

    if (response.status === 401) {
        if (!skipUnauthorizedRedirect) {
            localStorage.removeItem(STORAGE_KEYS.USER);
            localStorage.removeItem(STORAGE_KEYS.TOKEN);

            if (window.location.pathname !== "/") {
                window.location.href = "/";
            }
        }

        throw new Error("Unauthorized");
    }

    const contentType = response.headers.get("content-type");
    const hasJson = contentType?.includes("application/json");
    const data = hasJson ? await response.json().catch(() => null) : null;

    if (!response.ok) {
        const message = data?.message || response.statusText || "Request failed";
        throw new Error(message);
    }

    return data as T;
}

export { API_URL };
