export default defineNuxtRouteMiddleware((to) => {
  if (to.path === "/admin/login") return;
  const { token } = useAdminToken();
  if (!token.value) {
    return navigateTo("/admin/login");
  }
});