import axios from 'axios';

const customFetch = axios.create({
  baseURL: '/api/v1',
  withCredentials: true, // include if you're using cookies/sessions
  headers: {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
});

export default customFetch;
