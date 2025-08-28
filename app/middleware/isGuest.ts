/* export default function({store, redirect}) {
    const isAuth = !!store.state.auth.user
    const isLoggedIn = store.state.auth.loggedIn

    if(isAuth || isLoggedIn) {
        // navigate later to notAuthorized page
        return redirect('/')
    }
} */

import { defineNuxtRouteMiddleware, navigateTo } from '#app'
// import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(() => {
  /* const auth = useAuthStore()
  const isAuth = !!auth.user
  const isLoggedIn = auth.loggedIn */

  const { user, loggedIn } = useUserSession();
  console.log('User in isGuest middleware:', user, loggedIn);
  if (user.value !== null || Boolean(loggedIn.value)) {
    return navigateTo('/')
  }
})