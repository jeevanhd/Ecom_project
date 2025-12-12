// Frontend/src/apiBase.js
// Centralized API base URL for the frontend.
// Use VITE_API_URL at build time; otherwise fall back to localhost for dev.
const API = import.meta.env.VITE_API_URL || "http://localhost:8080";
export default API;
