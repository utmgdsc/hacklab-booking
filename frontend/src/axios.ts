import axios from "axios";

/**
 * Axios instance
 */
export const instance = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/`,
});

export default instance;
