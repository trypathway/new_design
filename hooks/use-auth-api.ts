import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { api } from "../lib/api";
import { useToast } from "@/components/ui/use-toast";

interface ApiError {
  message: string;
  status: number;
}

export function useAuthApi<T>(mapper?: (response: any) => T) {
  const [data, setData] = useState<T | null>(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { getAccessTokenSilently, logout } = useAuth0();
  const { toast } = useToast();

  const call = async (
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    params?: Record<string, any>,
    body?: any,
  ) => {
    try {
      setData(null);
      setIsError(false);
      setIsLoading(true);

      const token = await getAccessTokenSilently();
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      let response;
      switch (method) {
        case "GET":
          response = await api.get<T>(
            endpoint + (params ? `?${new URLSearchParams(params)}` : ""),
            headers,
          );
          break;
        case "POST":
          response = await api.post<T>(endpoint, body, headers);
          break;
        case "PUT":
          response = await api.put<T>(endpoint, body, headers);
          break;
        case "DELETE":
          response = await api.delete<T>(endpoint, headers);
          break;
      }

      console.log("API Raw Response:", response);

      if (mapper && response) {
        const mappedData = mapper(response);
        console.log("Mapped Response:", mappedData);
        setData(mappedData);
      } else {
        console.log("Setting Raw Response:", response);
        setData(response as T);
      }
    } catch (error) {
      const apiError = error as ApiError;
      setIsError(true);

      switch (apiError.status) {
        case 401:
          logout({ logoutParams: { returnTo: window.location.origin } });
          break;
        case 403:
          toast({
            title: "Access Denied",
            description: "You don't have permission to perform this action.",
            variant: "destructive",
          });
          break;
        case 404:
          toast({
            title: "Not Found",
            description: "The requested resource was not found.",
            variant: "destructive",
          });
          break;
        default:
          toast({
            title: "Error",
            description: apiError.message || "An unexpected error occurred.",
            variant: "destructive",
          });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    setData,
    isError,
    isLoading,
    call,
  };
}
