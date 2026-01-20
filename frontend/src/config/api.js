// API Configuration
let API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Remove trailing slash if present
API_URL = API_URL.replace(/\/$/, "");

export default API_URL;
