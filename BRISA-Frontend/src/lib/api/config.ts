const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export function apiUrl(path: string): string {
	const normalizedPath = path.startsWith("/") ? path : `/${path}`;
	return `${API_BASE_URL}${normalizedPath}`;
}

export const INCIDENTES_API_URL = apiUrl("/api/Incidentes");
export const TEMPORAL_API_URL = apiUrl("/api/incidentes");
