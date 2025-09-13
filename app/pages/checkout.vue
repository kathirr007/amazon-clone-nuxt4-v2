<script setup lang="ts">
import { loadStripe } from '@stripe/stripe-js'
import { onMounted, ref } from 'vue'

const config = useRuntimeConfig()
const stripePromise = loadStripe(config.public.STRIPE_PUBLIC_KEY as string)

const cardElement = ref<any>() // Using any since Stripe types are not fully compatible
const cardError = ref('')
const loading = ref(false)

let elements: any // Using any since Stripe types are not fully compatible
let clientSecret: string

onMounted(async () => {
  // 1. Ask server for PaymentIntent
  const { clientSecret: cs } = await $fetch('/api/payment-intent', {
    method: 'POST',
    body: { amount: 5000 }, // $50.00
  })
  clientSecret = cs as string

  // 2. Mount Elements
  const stripe = await stripePromise
  if (!stripe)
    return

  elements = stripe.elements({ clientSecret })
  cardElement.value = elements.create('payment')
  cardElement.value.mount('#card-element')
})

async function handlePayment() {
  loading.value = true
  cardError.value = ''

  const stripe = await stripePromise
  if (!stripe)
    return

  const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      return_url: 'http://localhost:3000/success',
    },
  })

  if (error) {
    cardError.value = error.message ?? 'Payment failed'
  }

  loading.value = false
}
</script>

<template>
  <div class="p-6 max-w-md mx-auto space-y-4">
    <h2 class="text-xl font-semibold">
      Checkout
    </h2>

    <!-- Stripe Elements placeholder -->
    <div id="card-element" class="border p-3 rounded" />

    <p v-if="cardError" class="text-red-600 text-sm">
      {{ cardError }}
    </p>

    <button
      :disabled="loading"
      class="bg-blue-600 text-white px-4 py-2 rounded w-full"
      @click="handlePayment"
    >
      <span v-if="loading">Processing...</span>
      <span v-else>Pay $50</span>
    </button>
  </div>
</template>
