import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import {
  getAccessToken,
  getRefreshToken,
  getUser,
} from "../hooks/user.actions";

const BASE_URL = "http://localhost:8000/api";

/**
 * 🔓 Public Axios (NO auth headers)
 * Use for: login, register, refresh
 */
export const axiosPublic = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * 🔐 Private Axios (WITH auth headers)
 * Use for protected routes only
 */
const axiosService = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Attach access token ONLY if it exists
 */
axiosService.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Refresh token logic (SimpleJWT)
 */
const refreshAuthLogic = async (failedRequest) => {
  try {
    const response = await axiosPublic.post("/auth/refresh/", {
      refresh: getRefreshToken(),
    });

    const { access } = response.data;

    failedRequest.response.config.headers.Authorization =
      "Bearer " + access;

    localStorage.setItem(
      "auth",
      JSON.stringify({
        access,
        refresh: getRefreshToken(),
        user: getUser(),
      })
    );

    return Promise.resolve();
  } catch (error) {
    localStorage.removeItem("auth");
    window.location.href = "/login";
    return Promise.reject(error);
  }
};

/**
 * Attach refresh interceptor
 */
createAuthRefreshInterceptor(axiosService, refreshAuthLogic);

/**
 * SWR / data fetch helper
 */
export function fetcher(url) {
  return axiosService.get(url).then((res) => res.data);
}

export default axiosService;
