/**
 * Configure the API client to send the Bearer token from localStorage on authenticated requests.
 * Token is stored by useLogin under the key "token".
 */
import { client } from "./client.gen";

client.setConfig({
  auth: () => localStorage.getItem("token") ?? undefined,
});
