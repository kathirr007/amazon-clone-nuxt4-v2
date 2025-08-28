/* export default defineNuxtPlugin((nuxtApp) => {
  const transitionName = useState('transitionName', () => 'slide-left')
  const router = useRouter()

  router.beforeEach((to, from) => {
    transitionName.value = from.name ? 'slide-right' : 'slide-left'
  })
})
 */

import type { RuntimeNuxtHooks } from "#app";

// const hookKeys:HookKeys<RuntimeNuxtHooks> = 'page:transition'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('page:transition:finish', (to, from) => {
    if (!from) return { name: 'fade', mode: 'out-in' };

    const toDepth = to.fullPath.split('/').length;
    const fromDepth = from.fullPath.split('/').length;

    return {
      name: toDepth > fromDepth ? 'slide-left' : 'slide-right',
      mode: 'out-in'
    };
  });
});