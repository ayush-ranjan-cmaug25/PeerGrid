const hostname = window.location.hostname;
export const BASE_URL = `http://${hostname}:5000`;
export const API_BASE_URL = `${BASE_URL}/api`;
export const HUB_URL = `${BASE_URL}/chatHub`;
export const WS_URL = `${BASE_URL}/ws`;

// Change this to 'SPRING' or 'DOTNET'
export const BACKEND_TYPE = 'SPRING';
