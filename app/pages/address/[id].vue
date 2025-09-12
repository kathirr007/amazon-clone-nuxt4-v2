<!-- <script>
import infoToastMixin from '~/mixins/infoToast'

export default {
  mixins: [infoToastMixin],
  transition(to, from) {
    if (!from) {
      return 'slide-left'
    }
    return 'slide-right'
  },
  async asyncData({ $axios, params }) {
    try {
      // const countriesUrl = `https://countryapi.io/api/all?apikey=${process.env.COUNTRY_API_KEY}`
      let response = await $axios.$get(`/api/countries`)
      let singleAddress = await $axios.$get(`/api/addresses/${params.id}`)

      let [countriesResponse, addressResponse] = await Promise.all([
        response,
        singleAddress,
      ])

      return {
        countries: countriesResponse,
        address: addressResponse.address,
      }
    }
    catch (err) {
      console.log(err)
    }
  },
  data() {
    return {
      address: {
        country: 'India',
        fullName: '',
        streetAddress1: '',
        streetAddress2: '',
        city: '',
        state: '',
        zipCode: '',
        phoneNumber: '',
        deliveryInstructions: '',
        securityCode: '',
      },
    }
  },
  head() {
    return {
      title: `Update Address`,
    }
  },
  methods: {
    async onUpdateAddress({ $axios }) {
      try {
        let data = {
          country: this.address.country,
          fullName: this.address.fullName,
          streetAddress: `${this.address.streetAddress} ${this.streetAddress2}`,
          city: this.address.city,
          state: this.address.state,
          zipCode: this.address.zipCode,
          phoneNumber: this.address.phoneNumber,
          deliveryInstructions: this.address.deliveryInstructions,
          securityCode: this.address.securityCode,
        }
        // debugger
        let response = await this.$axios.$put(`/api/address/${this.$route.params.id}`, data)
        // debugger
        if (response.success) {
          this.makeToast('address', this.address.fullName, 'update')
          this.$router.push('/address')
        }
      }
      catch (err) {
        console.log(err)
      }
    },
  },
}
</script> -->

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const { makeToast } = useToastNotification()

// Transition
definePageMeta({
  pageTransition: {
    name: (route) => {
      return !route.from ? 'slide-left' : 'slide-right'
    },
  },
})

// Page title
useHead({
  title: 'Update Address',
})

/* // Get initial data
const { data: { countries, address }, pending: loadingAddress, refresh: refreshAddress } = await useAsyncData('countries-and-address', async () => {
  try {
    const [countriesResponse, addressResponse] = await Promise.all([
      $fetch('/api/countries'),
      $fetch(`/api/addresses/${route.params.id}`),
    ])

    return {
      countries: countriesResponse,
      address: addressResponse.address,
    }
  }
  catch (err) {
    console.log(err)
  }
}) */

// Get countries data
const { data: countries, pending: loadingCountries, refresh: refreshCountries } = await useAsyncData('countries', async () => {
  try {
    const response = await $fetch('/api/countries')
    return response
  }
  catch (err) {
    console.log(err)
  }
})

// Get address data
const { data: address, pending: loadingAddress, refresh: refreshAddress } = await useAsyncData('address', async () => {
  try {
    const response = await $fetch(`/api/addresses/${route.params.id}`)
    return response.address
  }
  catch (err) {
    console.log(err)
  }
})

// Update address
async function onUpdateAddress() {
  try {
    const data = {
      country: address.value.country,
      fullName: address.value.fullName,
      streetAddress: `${address.value.streetAddress} ${address.value.streetAddress2}`,
      city: address.value.city,
      state: address.value.state,
      zipCode: address.value.zipCode,
      phoneNumber: address.value.phoneNumber,

      deliveryInstructions: address.value.deliveryInstructions,
      securityCode: address.value.securityCode,
    }

    const response = await $fetch(`/api/addresses/${route.params.id}`, {
      method: 'PUT',
      body: data,
    })

    if (response.success) {
      makeToast({ type: 'address', title: address.value.fullName, status: 'update' })
      router.push('/address')
    }
  }
  catch (err) {
    console.log(err)
  }
}

onMounted(() => {
  refreshAddress()
  refreshCountries()
})
</script>

<template>
  <main>
    <!-- REGISTER ADDRESS -->
    <div class="registerAddress mt-3">
      <div class="container-fluid c-section">
        <div class="row">
          <div class="col-sm-3" />
          <div class="col-sm-6">
            <div v-if="loadingAddress" class="d-flex justify-content-center">
              <BSpinner />
            </div>
            <template v-else>
              <div class="a-section a-spacing-medium">
                <div class="a-subheader a-breadcrumb a-spacing-small">
                  <ul>
                    <li>
                      <span>Your Account</span>
                    </li>
                    <li class="a-breadcrumb-divider">
                      &#10095;
                    </li>
                    <li>
                      <nuxt-link to="/address">
                        <span>Your Adresses</span>
                      </nuxt-link>
                    </li>
                    <li class="a-breadcrumb-divider">
                      &#10095;
                    </li>
                    <li class="active">
                      <a href="#">
                        {{ address.fullName }}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="a-section">
                <h2>Update address</h2>
                <div class="a-section a-spacing-none a-spacing-top-small">
                  <b>
                    Or pick up your packages at your convenience from our self-service locations. To add an Amazon Pickup Point or Locker, click
                    <a
                      href="#"
                    >here</a>.
                  </b>
                </div>
                <!-- Error Message -->
                <div class="a-section a-spacing-none a-spacing-top-small">
                  <b />
                </div>
                <b-form>
                  <div class="a-spacing-medium a-spacing-top-medium">
                    <!-- Country / Region -->
                    <div class="a-spacing-top-medium">
                      <label class="mb-2" for="selectCountry">Country/Region</label>
                      <div v-if="loadingCountries" class="d-flex justify-content-center">
                        <BSpinner />
                      </div>
                      <b-form-select v-else id="selectCountry" v-model="address.country" label-field="Country/Region">
                        <b-form-select-option
                          v-for="country in countries"
                          :key="country.alpha2Code"
                          :value="country.name"
                        >
                          {{ country.name }}
                        </b-form-select-option>
                      </b-form-select>
                    </div>
                    <!-- Full name -->
                    <div class="a-spacing-top-medium">
                      <b-form-group label="Full Name" label-for="fullName" description="">
                        <b-form-input id="fullName" v-model="address.fullName" type="text" />
                      </b-form-group>
                    </div>
                    <!-- Street Address -->
                    <div class="a-spacing-top-medium">
                      <b-form-group label="Street Address" label-for="streetAddress" description="">
                        <b-form-input id="streetAddress" v-model="address.streetAddress" class="mb-2" type="text" />
                        <!-- Street Address 2 -->
                        <b-form-input v-model="address.streetAddress2" type="text" />
                      </b-form-group>
                    </div>
                    <!-- City -->
                    <div class="a-spacing-top-medium">
                      <b-form-group label="City" label-for="city" description="">
                        <b-form-input id="city" v-model="address.city" type="text" />
                      </b-form-group>
                    </div>
                    <!-- State -->
                    <div class="a-spacing-top-medium">
                      <b-form-group label="State / Province / Region" label-for="state" description="">
                        <b-form-input id="state" v-model="address.state" type="text" />
                      </b-form-group>
                    </div>
                    <!-- Zip Code -->
                    <div class="a-spacing-top-medium">
                      <b-form-group label="Zip Code" label-for="zipCode" description="">
                        <b-form-input id="zipCode" v-model="address.zipCode" type="text" />
                      </b-form-group>
                    </div>
                    <!-- Phone Number -->
                    <div class="a-spacing-top-medium">
                      <b-form-group label="Phone Number" label-for="phoneNumber" description="">
                        <b-form-input id="phoneNumber" v-model="address.phoneNumber" type="text" />
                      </b-form-group>
                      <div class="a-section a-spacing-none a-spacing-top-micro">
                        <span class="a-size-mini">May be used to assist delivery</span>
                      </div>
                    </div>
                    <div class="a-spacing-base a-spacing-top-medium">
                      <h3>Add delivery instructions</h3>
                    </div>
                    <!-- Delivery Instruction -->
                    <div class="a-spacing-top-medium">
                      <b-form-group label="Do we need additional instructions to find this address?" label-for="deliveryInstructions">
                        <b-form-textarea
                          id="deliveryInstructions" v-model="address.deliveryInstructions"
                          placeholder="" rows="3" max-rows="6"
                        />
                      </b-form-group>
                    </div>
                    <!-- Security code -->
                    <div class="a-spacing-top-medium">
                      <b-form-group label="Do we need a security code or a call box number to access this building?" label-for="securityCode" description="">
                        <b-form-input id="securityCode" v-model="address.securityCode" placeholder="" type="text" />
                      </b-form-group>
                    </div>
                    <div class="a-spacing-top-medium">
                      <label style="margin-bottom: 0px;">Weekend delivery</label>
                      <a href="#">
                        <i class="fas fa-angle-down" /> Which days can you receive packages?
                      </a>
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
                    <div class="a-spacing-top-small">
                      <span>
                        <a href="#">Tips for entering addresses</a>
                      </span>
                      <span>|</span>
                      <span>
                        <a href="#">APO/FPO address tips</a>
                      </span>
                    </div>
                    <div class="a-spacing-top-large">
                      <span class="a-button-register">
                        <span class="a-button-inner">
                          <span class="a-button-text" @click="onUpdateAddress">Update address</span>
                        </span>
                      </span>
                    </div>
                  </div>
                </b-form>
              </div>
            </template>
          </div>
          <div class="col-sm-3" />
        </div>
      </div>
    </div>
    <!-- /REGISTER ADDRESS -->
  </main>
</template>
