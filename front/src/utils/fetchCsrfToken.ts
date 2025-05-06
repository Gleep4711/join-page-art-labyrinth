import { API_URL } from '../config';

export async function fetchCsrfToken() {
    let sessionId = localStorage.getItem("sessionId");
    if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem("sessionId", sessionId);
    }
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
        localStorage.setItem("csrfToken", data.csrf_token);
    } catch (error) {
        console.error("Error fetching CSRF token:", error);
    }
}