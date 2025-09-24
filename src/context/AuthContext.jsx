import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import dayjs from 'dayjs';

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {

  // Load tokens from localStorage
  const [authTokens, setAuthTokens] = useState(() => {return localStorage.getItem('authTokens')?JSON.parse(localStorage.getItem('authTokens')) : null;
  });

  // Decode access token to get user info
  const [user, setUser] = useState(() => {
    return authTokens ? jwtDecode(authTokens.access) : null;
  });

  const [loading, setLoading] = useState(true);

  // Logout User
  const logoutUser = () => {
    setUser(null);
    setAuthTokens(null);
    localStorage.removeItem('authTokens');
    
  };

  // Check if refresh token is expired & logout if needed
  useEffect(() => {
    if (authTokens?.refresh) {
      if (dayjs.unix(jwtDecode(authTokens.refresh).exp).diff(dayjs()) < 1) {
        setUser(null);
        setAuthTokens(null);
        localStorage.removeItem('authTokens');
      }
    }
    else{logoutUser()}
    setLoading(false);
  }, [authTokens]);

  const contextData = {
    user,
    authTokens,
    logoutUser,
    setAuthTokens,
    setUser
  };

  return (
    <AuthContext.Provider value={contextData}>
      {!loading && children} {/* Prevent rendering before checking expiration */}
    </AuthContext.Provider>
  );
};