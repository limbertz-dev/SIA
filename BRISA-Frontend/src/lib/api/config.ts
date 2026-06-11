const viteApiUrl = import.meta.env.VITE_API_URL;

if (import.meta.env.PROD && !viteApiUrl) {
	throw new Error("VITE_API_URL is required for production builds");
}

export const API_URL = (viteApiUrl || "http://localhost:8000").replace(/\/$/, "");
export const INCIDENTES_API_URL = `${API_URL}/api/Incidentes`;
