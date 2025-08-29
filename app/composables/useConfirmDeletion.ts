import { useRouter } from '#app'
import { useModalController, useToastController } from 'bootstrap-vue-next'
import { h } from 'vue'

export function useConfirmDeletion() {
  const toast = useToastController()
  const modal = useModalController()
  const router = useRouter()

  // Replace with your store or useState
  const isAuthenticated = useState<boolean>('isAuthenticated')
  const authUser = useState<any>('authUser')

  async function confirmDeletion(id: string | number, index: number, title: string, e: Event | null = null) {
    const user = authUser.value
    const isAdmin = user?.admin ?? false

    if (!isAuthenticated.value) {
      toast.create({
        title: 'Authentication Error',
        variant: 'warning',
        slots: {
          default: () =>
            h('p', { class: ['text-center', 'mb-0'] }, [
              h('b-spinner', { type: 'grow', small: true }),
              ' Hi ',
              h('strong', 'Guest'),
              ` you need to be logged in with Admin rights to do this Action `,
              h('strong', (e?.target as HTMLElement)?.textContent ?? ''),
              h('b-spinner', { type: 'grow', small: true }),
            ]),
        },
      }).show()

      router.push('/login')
      return
    }

    if (!isAdmin) {
      toast.create({
        title: 'Authorization Error',
        variant: 'danger',
        slots: {
          default: () =>
            h('p', { class: ['text-center', 'mb-0'] }, [
              h('b-spinner', { type: 'grow', small: true }),
              ' Hi ',
              h('strong', `${user?.name}, `),
              ` you need to be Admin to do this Action `,
              h('strong', (e?.target as HTMLElement)?.textContent ?? ''),
              h('b-spinner', { type: 'grow', small: true }),
            ]),
        },
      }).show()

      return
    }

    // ✅ Show Modal Confirmation
    // eslint-disable-next-line unused-imports/no-unused-vars
    const titleVNode = h('div', 'Please Confirm')
    const messageVNode = h('p', { class: 'mb-0 text-center' }, [
      'Please confirm that you want to delete ',
      h('strong', title),
      ' from the list',
    ])

    try {
      /* const result = await modal.msgBoxConfirm({
        title: () => titleVNode,
        body: () => messageVNode,
        titleClass: 'text-white',
        centered: true,
        size: 'md'
      }) */

      const result = await modal.confirm({
        title: () => 'Please Confirm',
        body: '',
        slots: {
          default: () => messageVNode,
        },
        titleClass: 'text-white',
        centered: true,
        size: 'md',
      })

      if (result) {
        // Call delete action (you can emit or pass a callback)
        console.log(`Deleting item: ${title} (ID: ${id}, index: ${index})`)
      }
    }
    catch (err) {
      console.error(err)
    }
  }

  return { confirmDeletion }
}
