/**
 * Configure the API client: base URL from env (prod vs dev) and Bearer token from localStorage.
 * Token is stored by useLogin under the key "token".
 */
import { client } from "@/client/client.gen";

const baseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

client.setConfig({
  baseUrl,
  auth: () => localStorage.getItem("token") ?? undefined,
});
