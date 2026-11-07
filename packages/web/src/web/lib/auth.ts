import { createAuthClient } from "better-auth/react";
const KEY = "nova-session";
export const getToken = () => localStorage.getItem(KEY) ?? "";
export const clearToken = () => localStorage.removeItem(KEY);
export const authClient = createAuthClient({
  baseURL: window.location.origin,
  basePath: "/api/auth",
  fetchOptions: { auth: { type: "Bearer", token: getToken } },
});
export async function signIn(email: string, password: string) {
  const result = await authClient.signIn.email(
    { email, password },
    {
      onSuccess: ({ response }) => {
        const token = response.headers.get("set-auth-token");
        if (token) localStorage.setItem(KEY, token);
      },
    },
  );
  if (result.error)
    throw new Error("E-mail ou senha incorretos. Confira os dados e tente novamente.");
}
