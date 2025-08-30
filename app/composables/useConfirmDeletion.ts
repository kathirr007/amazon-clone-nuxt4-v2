import type { IUser } from '~~/server/api/models/user'
import { useRouter } from '#app'
import { useModalController, useToastController } from 'bootstrap-vue-next'
import { h } from 'vue'

export function useConfirmDeletion() {
  const toast = useToastController()
  const modal = useModalController()
  const router = useRouter()
  // const { makeToast } = useToastNotification()

  // Replace with your store or useState
  // const isAuthenticated = useState<boolean>('isAuthenticated')
  const { user } = useUserSession()

  async function confirmDeletion({ id, index, title, e, deleteCallback }: { id: string | number, index: number, title: string, e: Event | null, deleteCallback: (id: string | number, index: number, title: string) => Promise<any> }) {
    // const user = authUser.value
    const isAdmin = (user.value as unknown as IUser)?.admin ?? false
    if (!user.value) {
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
              h('strong', `${user.value?.name}, `),
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
    const titleVNode = h('div', { class: ['text-dark'] }, 'Please Confirm')
    const messageVNode = h('p', { class: 'mb-0 text-center' }, [
      'Please confirm that you want to delete ',
      h('strong', title),
      ' from the list',
    ])

    // try {
    //   /* const result = await modal.msgBoxConfirm({
    //     title: () => titleVNode,
    //     body: () => messageVNode,
    //     titleClass: 'text-white',
    //     centered: true,
    //     size: 'md'
    //   }) */

    //   const result = await modal.confirm({
    //     title: () => 'Please Confirm',
    //     body: '',
    //     slots: {
    //       default: () => messageVNode,
    //     },
    //     titleClass: 'text-dark',
    //     centered: true,
    //     size: 'md',
    //   })

    //   if (result) {
    //     // Call delete action (you can emit or pass a callback)
    //     console.log(`Deleting item: ${title} (ID: ${id}, index: ${index})`)
    //   }
    // }
    // catch (err) {
    //   console.error(err)
    // }
    try {
      const modalInstance = modal.create({
        title: () => 'Please Confirm',
        body: '',
        slots: {
          default: () => messageVNode,
        },
        titleClass: 'text-dark',
        centered: true,
        size: 'md',
      })

      const result = await modalInstance.show()

      if ((result as any)?.ok) {
        // Call delete action (you can emit or pass a callback)
        /* const deleteResponse = await $fetch(`/api/products/${id}`, {
          method: 'DELETE',
        })

        if (deleteResponse && (deleteResponse as any).success) {
          await $fetch('/api/products', {
            method: 'GET',
          })
        }

        makeToast({
          type: 'Product',
          status: 'delete',
          variant: 'danger',
          title: title as string,
        }) */

        await deleteCallback(id, index, title)

        console.log(`Deleting item: ${title} (ID: ${id}, index: ${index})`)
      }
    }
    catch (err) {
      console.error(err)
    }
  }

  return { confirmDeletion }
}
