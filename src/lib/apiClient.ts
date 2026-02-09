const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

type ApiFetchOptions = RequestInit & { skipAuth?: boolean };

export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
    const { skipAuth, headers, ...rest } = options;

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
        window.location.href = "/";
        return Promise.reject("Unauthorized");
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