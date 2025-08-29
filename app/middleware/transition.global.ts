export default defineNuxtRouteMiddleware((to, from) => {
  if (!from || !from.fullPath) {
    to.meta.pageTransition = { name: 'slide-left', mode: 'out-in' }
    return
  }

  const toDepth = to.fullPath.split('/').length
  const fromDepth = from.fullPath.split('/').length

  to.meta.pageTransition = {
    name: toDepth > fromDepth ? 'slide-left' : 'slide-right',
    mode: 'out-in',
  }
})
