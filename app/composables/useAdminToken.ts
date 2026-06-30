const STORAGE_KEY = "dreamine_admin_token";

export function useAdminToken() {
  const token = useState<string>("adminToken", () => "");

  if (import.meta.client && !token.value) {
    token.value = sessionStorage.getItem(STORAGE_KEY) || "";
  }

  function setToken(value: string) {
    token.value = value.trim();
    if (import.meta.client) {
      sessionStorage.setItem(STORAGE_KEY, token.value);
    }
  }

  function clearToken() {
    token.value = "";
    if (import.meta.client) {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }

  async function adminFetch<T>(path: string, opts: Parameters<typeof $fetch<T>>[1] = {}) {
    if (!token.value) {
      throw new Error("未登录");
    }
    return $fetch<T>(path, {
      ...opts,
      headers: {
        ...(opts.headers as Record<string, string>),
        Authorization: `Bearer ${token.value}`,
      },
    });
  }

  return { token, setToken, clearToken, adminFetch };
}