import { defineNuxtRouteMiddleware, useAuth, navigateTo } from '#imports'

export default defineNuxtRouteMiddleware(async () => {
  const { loggedIn, user } = useUserSession()
  

  if (loggedIn.value && !(user.value as any)?.admin) {
    return navigateTo('/notAuthorized')
  }
})