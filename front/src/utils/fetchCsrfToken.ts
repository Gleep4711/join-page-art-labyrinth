import { API_URL } from '../config';

export async function fetchCsrfToken(sessionId: string): Promise<string | null> {
    try {
        const response = await fetch(`${API_URL}/form/csrf-token`, {
            method: "GET",
            headers: {
                "X-Session-ID": sessionId,
            },
        });

        if (!response.ok) {
            console.error("Failed to fetch CSRF token", response.statusText);
            return null;
        }

        const data = await response.json();
        return data.csrf_token || null;
    } catch (error) {
        console.error("Error fetching CSRF token:", error);
        return null;
    }
}