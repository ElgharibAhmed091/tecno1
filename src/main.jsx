import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import { SidebarProvider } from "./context/sidebarContext";
import { SidebarLinks } from "@/utils/sidebarLinks";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { HelmetProvider } from "react-helmet-async";

// Google Client ID
const GOOGLE_CLIENT_ID = "208794677125-kft6rvf4d4eek6r1df1ln1gjhod4p68t.apps.googleusercontent.com";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <AuthProvider>
          <SidebarProvider>
            <SidebarLinks />
            <App />
          </SidebarProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </HelmetProvider>
  </StrictMode>
);
