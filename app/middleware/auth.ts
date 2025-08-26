// app/middleware/auth.ts

export default defineNuxtRouteMiddleware((to, from) => {
  const { loggedIn } = useUserSession();
  if (!loggedIn.value) {
    return navigateTo("/login");
  }
});
