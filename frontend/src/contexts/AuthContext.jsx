import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import api from "../api/api";

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("useAuth mest be used within an AuthProvider");
  }

  return authContext;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState();
  const [user, setUser] = useState();

  const [loading, setLoading] = useState(true);

  // Keep in mind that this useEffict will not run before useLayoutEffect
  useEffect(() => {
    const fetchMe = async () => {
      try {
        // Response contains user data.
        const response = await api.get("/api/users");
        setUser(response.data);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  // To refresh the token sent within each request each time the token in refreshed.
  useLayoutEffect(() => {
    const authInterceptor = api.interceptors.request.use((config) => {
      config.headers.Authorization =
        !config._retry && token
          ? `Bearer ${token}`
          : config.headers.Authorization;
      return config;
    });

    return () => {
      api.interceptors.request.eject(authInterceptor);
    };
  }, [token]);

  useLayoutEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (
          error.response.status === 401 &&
          error.response.data.message.startsWith("Unauthorized")
        ) {
          try {
            // Refresh the access token in server.
            const response = await api.post("/api/users/refresh-token");

            // After this useLayoutEffect runs, fetchMe runs and sets the user.
            setToken(response.data.accessToken);

            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
            originalRequest._retry = true;

            // Call the original request.
            return api(originalRequest);
          } catch (error) {
            setToken(null);
          }
        }

        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.request.eject(responseInterceptor);
    };
  }, [token]);

  const login = (accessToken, user) => {
    setUser(user);
    setToken(accessToken);
  };

  useEffect(() => {
    console.log("user: ", user);
    console.log("token", token);
  }, [user, token]);

  // Way for different components to get the auth state.
  const isAuthenticated = () => {
    return { token, user };
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, isAuthenticated }}>
      {!loading ? children : <div>Loading.......</div>}
    </AuthContext.Provider>
  );
};
