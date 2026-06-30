import { z as useState } from './server.mjs';

function useAdminToken() {
  const token = useState("adminToken", () => "");
  function setToken(value) {
    token.value = value.trim();
  }
  function clearToken() {
    token.value = "";
  }
  async function adminFetch(path, opts = {}) {
    if (!token.value) {
      throw new Error("\u672A\u767B\u5F55");
    }
    return $fetch(path, {
      ...opts,
      headers: {
        ...opts.headers,
        Authorization: `Bearer ${token.value}`
      }
    });
  }
  return { token, setToken, clearToken, adminFetch };
}

export { useAdminToken as u };
//# sourceMappingURL=useAdminToken-CtgvElor.mjs.map
