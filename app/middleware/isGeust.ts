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

  if (user || loggedIn) {
    return navigateTo('/')
  }
})