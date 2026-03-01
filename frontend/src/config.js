const API_BASE_URL = window.location.protocol === 'https:'
    ? 'https://sevo-secure-voice.onrender.com'
    : 'http://localhost:5000';

const SOCKET_URL = window.location.protocol === 'https:'
    ? 'https://sevo-secure-voice.onrender.com'
    : 'http://localhost:5000';

export { API_BASE_URL, SOCKET_URL };
