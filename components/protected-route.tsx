"use client";

import { useAuth0 } from "@auth0/auth0-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const {
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    getAccessTokenSilently,
  } = useAuth0();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      if (!isLoading && !isAuthenticated) {
        await loginWithRedirect({
          appState: {
            returnTo: window.location.pathname,
          },
        });
      } else if (isAuthenticated) {
        // Preemptively get a new access token
        try {
          await getAccessTokenSilently();
        } catch (error) {
          console.error("Error refreshing token:", error);
          await loginWithRedirect({
            appState: {
              returnTo: window.location.pathname,
            },
          });
        }
      }
    };

    checkAuth();
  }, [isLoading, isAuthenticated, loginWithRedirect, getAccessTokenSilently]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
