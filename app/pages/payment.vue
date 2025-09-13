<script setup>
import { useCartStore } from '~/stores/useCartStore'

// const { stripe, isLoading, loadStripe } = useClientStripe()

const router = useRouter()

const error = ref('')
const stripe = ref(null)
const card = ref(null)
const cardRef = ref(null)

// Computed properties from store
const { getCart, getCartTotalPriceWithShipping, getEstimatedDelivery } = storeToRefs(useCartStore())

// Page transition
definePageMeta({
  pageTransition: {
    name: (route, from) => !from ? 'slide-left' : 'slide-right',
  },
})

// Page head
useHead({
  title: 'Make Payment',
})

onMounted(() => {
  stripe.value = Stripe('pk_test_krAf3HsWv3GLs5EXlXXRpv1O00IWashr2l')

  // stripe.value = Stripe(`${config.public.STRIPE_PUBLIC_KEY}`)
  const elements = stripe.value.elements()
  card.value = elements.create('card')
  card.value.mount(cardRef.value)
})

async function onPurchase() {
  try {
    const token = await stripe.value.createToken(card.value)

    const response = await $fetch('/api/payment', {
      method: 'POST',
      body: {
        token,
        totalPrice: getCartTotalPriceWithShipping.value,
        cart: getCart.value,
        estimatedDelivery: getEstimatedDelivery.value,
      },
    })

    if (response.success) {
      store.commit('clearCart')
      router.push('/')
    }
  }
  catch (err) {
    console.log(err)
    error.value = err.message
  }
}
</script>

<template>
  <main>
    <!-- Payment -->
    <div class="registerAddress mt-3">
      <div class="container-fluid c-section">
        <div class="row">
          <div class="col-sm-6 offset-sm-3">
            <div class="a-section a-spacint-medium">
              <!-- Breadcrumbs -->
              <div class="a-subheader a-breadcrumb a-spacing-small">
                <ul class="a-unordered-lista a-horizontal a-size-small">
                  <li>
                    <nuxt-link to="/cart">
                      <span>Your Cart</span>
                    </nuxt-link>
                  </li>
                  <li>
                    <span class="a-breadcrumb-divider">></span>
                  </li>
                  <li>
                    <nuxt-link to="/placeorder">
                      <span>Place Order</span>
                    </nuxt-link>
                  </li>
                  <li>
                    <span class="a-breadcrumb-divider">></span>
                  </li>
                  <li class="active">
                    <nuxt-link to="/payment">
                      <span>Payment</span>
                    </nuxt-link>
                  </li>
                </ul>
              </div>
            </div>
            <div class="a-section">
              <h2>Make a paymnet</h2>
              <div class="a-section a-spacing-none a-spacing-top-small">
                <b>The total price is ${{ getCartTotalPriceWithShipping }}</b>
              </div>

              <!-- Error Message -->
              <div class="a-section a-spacing-none a-spacing-top-small">
                <b>Error</b>
              </div>
              <form action="#" method="post" />
              <div class="a-spacing-medium a-spacing-top-medium">
                <div class="a-spacing-top-medium">
                  <!-- Stipe card -->
                  <div ref="cardRef" />
                  <!-- Stipe card end -->
                </div>
                <div class="a-spacing-top-medium" />
                <hr>
                <div class="a-spacing-top-medium">
                  <span>
                    <b>Make sure your address is correct</b>
                  </span>
                </div>
                <div>
                  <span>If the address contains typos or other errors, your package may be undeliverable.</span>
                </div>

                <!-- Purchase Button -->
                <div class="a-spacing-top-large">
                  <span class="a-button-register">
                    <span class="a-button-inner">
                      <span class="a-button-text" @click="onPurchase">
                        Purchase
                      </span>
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss">
.StripeElement {
  box-sizing: border-box;
  height: 40px;
  padding: 10px 12px;
  border: 1px solid transparent;
  border-radius: 4px;
  box-shadow: 0 1px 3px 0 #e6ebf1;
  -webkit-transition: box-shadow 150ms ease;
  transition: box-shadow 150ms ease;
}
.StripeElement--focus {
  box-shadow: 0 1px 3px 0 #cfd7df;
}
.StripeElement--invalid {
  border-color: #fa755a;
}
.StripeElement--webkit-autofill {
  background-color: #fefde5 !important;
}
</style>
