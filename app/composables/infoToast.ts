// export default {
//   data() {
//     return {

//     }
//   },
//   computed: {

//   },
//   methods: {
//     capitalize(string) {
//       return string.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))
//     },
//     makeToast(type, title, status) {
//       let statusUpdate = ((status) => {
//         if (status === 'update') {
//           return 'updated'
//         } else if (status === 'delete') {
//           return 'deleted'
//         } else if (status === 'add') {
//           return 'added'
//         } else if (status === 'setdefault') {
//           return 'setted as default'
//         }
//       })
//       // Use a shorter name for this.$createElement
//       const h = this.$createElement
//       // Create the message
//       const vNodesMsg = h(
//         'p',
//         { class: ['text-center', 'mb-2'] },
//         [
//           h('b-spinner', { props: { type: 'grow', small: true } }),
//           `The ${this.capitalize(type)} `,
//           h('strong', `${title}`),
//           ` ${statusUpdate(status)} successfully... `,
//           h('b-spinner', { props: { type: 'grow', small: true } })
//         ],
//       )
//       this.$root.$bvToast.toast(vNodesMsg, {
//         title: `${this.capitalize(type)} update Status`,
//         autoHideDelay: 5000,
//         appendToast: false,
//         variant: 'info'
//       })
//     }
//   }
// }

import type { BaseColorVariant, OrchestratedToast } from 'bootstrap-vue-next'
import { BSpinner, useToastController } from 'bootstrap-vue-next'
import { h } from 'vue'

export function useToastNotification() {
  const toast = useToastController()

  const capitalize = (string: string): string => {
    return string.replace(/\w\S*/g, w => (w.replace(/^\w/, c => c.toUpperCase())))
  }

  const makeToast = ({ type, title, status, variant = 'success' }: { type: string, title: string, status: string, variant: keyof BaseColorVariant }): void => {
    const statusUpdate = (status: string): string => {
      if (status === 'update') {
        return 'updated'
      }
      else if (status === 'delete') {
        return 'deleted'
      }
      else if (status === 'add') {
        return 'added'
      }
      else if (status === 'setdefault') {
        return 'setted as default'
      }
      return ''
    }

    const firstRef = ref<OrchestratedToast>({
      body: `${Math.random()}`,
    })

    const vNodesMsg = h(
      'p',
      { class: ['text-center', 'mb-2'] },
      [
        // h('b-spinner', { props: { type: 'grow', small: true } }),
        h(BSpinner, {
          small: true,
          type: 'grow',
          class: ['me-2 d-inline-block'],

        }),
        `The ${capitalize(type)} `,
        h('strong', `${title}`),
        ` ${statusUpdate(status)} successfully... `,
        // h('b-spinner', { props: { type: 'grow', small: true } }),
        h(BSpinner, {
          small: true,
          type: 'grow',
          class: ['ms-2 d-inline-block'],
        }),
      ],
    )

    /* toast.show(vNodesMsg, {
      title: `${capitalize(type)} update Status`,
      autoHideDelay: 5000,
      appendToast: false,
      variant: 'info'
    }) */
    toast.create({
      body: firstRef.value.body,
      slots: {
        default: () => vNodesMsg,
      },
      variant,
      progressProps: {
        variant,
      },
    })
  }

  return {
    makeToast,
    toast,
  }
}
