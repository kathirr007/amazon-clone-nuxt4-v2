<script setup>
const { fetch: fetchUser } = useUserSession()
const { makeToast, toast } = useToastNotification()
const { confirmDeletion } = useConfirmDeletion()

// Define route transition
definePageMeta({
  pageTransition: {
    name: (route) => {
      return !route.from ? 'slide-left' : 'slide-right'
    },
  },
})

// Set page title
useHead({
  title: 'Addresses List',
})

// Fetch addresses data
const { data: addresses, pending: loadingAddresses, refresh: refreshAddresses } = await useAsyncData('addresses', () =>
  $fetch('/api/addresses').then((res) => {
    return res.addresses
  }), {
  onError: (error) => {
    console.log(error)
  },
})

// const addresses = ref(addressesData.value?.addresses)

// Delete address method
async function onDeleteAddress(id, index, title) {
  try {
    const response = await $fetch(`/api/addresses/${id}`, {
      method: 'DELETE',
    })

    // makeToast('address', title, 'delete')
    makeToast({ type: 'address', title, status: 'delete', variant: 'danger' })
    if (response.success) {
      addresses.value.splice(index, 1)
    }
  }
  catch (err) {
    console.log(err)
  }
}

// Set default address method
async function onSetDefault(id, title) {
  try {
    const response = await $fetch('/api/addresses/set/default', {
      method: 'PUT',
      body: { id },
    })

    if (response.success) {
      await fetchUser()
      makeToast({ type: 'address', title, status: 'update' })
    }
  }
  catch (err) {
    console.log(err)
    const foundAddress = addresses.value.find(address => address._id === id)
    debugger

    toast.create({
      title: 'Error Deleting Product',
      body: err.data.message ? err.data.message : (err.message || `There was an error deleting the product ${foundAddress.fullName}. Please try again.`),
      variant: 'danger',
      progressProps: {
        variant: 'danger',
      },
    })
  }
}

onMounted(() => {
  refreshAddresses()
})
</script>

<template>
  <main>
    <!-- REGISTER ADDRESS -->
    <div class="registerAddress mt-3">
      <div class="container-fluid c-section">
        <div class="row">
          <div class="col-sm-2" />
          <div class="col-sm-10">
            <div class="a-section a-spacing-medium">
              <div class="a-subheader a-breadcrumb a-spacing-small">
                <ul>
                  <li>
                    <a href="#">
                      <span>Your Account</span>
                    </a>
                  </li>
                  <li class="a-breadcrumb-divider">
                    &#10095;
                  </li>
                  <li class="active">
                    <a href="#">
                      <span>Your Adresses</span>
                    </a>
                  </li>
                </ul>
              </div>
              <h1 class="a-spacing-medium a-spacing-top-medium">
                Your Addresses
              </h1>
              <!-- Message from Server -->
              <!-- <div class="a-section a-spacing-none a-spacing-top-small">
                <b>{{message}}</b>
              </div> -->
              <div class="a-spacing-double-large">
                <div class="row a-spacing-micro">
                  <div class="col-lg-4 col-md-5 col-sm-12 pb-2">
                    <nuxt-link
                      to="/address/add"
                      class="a-link-normal add-new-address-button"
                      style="text-decoration:none;"
                    >
                      <div class="a-box first-desktop-address-tile">
                        <div class="a-box-inner a-padding-extra-large">
                          <i class="far fa-plus fs-2" />
                          <h2 class="a-color-tertiary">
                            Add Address
                          </h2>
                        </div>
                      </div>
                    </nuxt-link>
                  </div>
                  <!-- Address -->
                  <template v-if="loadingAddresses">
                    Loading...
                  </template>
                  <template v-else>
                    <div
                      v-for="(address, index) in addresses"
                      :key="address._id"
                      class="col-lg-4 col-md-4 col-sm-12 pl-md-0 pb-2"
                    >
                      <div class="a-box a-spacing-none normal-desktop-address-tile">
                        <div class="a-box-inner a-padding-none">
                          <div class="address-section-no-default">
                            <div class="a-spacing-small">
                              <ul class="a-unordered-list a-nostyle a-vertical">
                                <li>
                                  <h5>
                                    <!-- Address Fullname -->
                                    <b>{{ address.fullName }}</b>
                                  </h5>
                                </li>
                                <!-- Address street address -->
                                <li>{{ address.streetAddress }}</li>
                                <!-- Address city state zip code -->
                                <li>{{ address.city }}, {{ address.state }} {{ address.zipCode }}</li>
                                <!-- Address country -->
                                <li>{{ address.country }}</li>
                                <!-- Address Phone number -->
                                <li>Phone number: {{ address.phoneNumber }}</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div class="edit-address-desktop-link">
                          <!-- Edit/Update Button -->
                          <nuxt-link :to="`/address/${address._id}`">
                            Edit
                          </nuxt-link>
                          <span class="mx-2">|</span>
                          <!-- Delete Button -->
                          <a
                            href="#"
                            @click.prevent="confirmDeletion({ id: address._id, index, title: address.fullName, e: $event, deleteCallback: onDeleteAddress })"
                          >Delete</a>
                          <span class="mx-2">|</span>
                          <!-- Set Address as Default -->
                          <a
                            href="#"
                            @click.prevent="onSetDefault(address._id, address.fullName)"
                          >Set as Default</a>
                        </div>
                      </div>
                    </div>
                  </template>
                  <div class="col-lg-4 col-md-3 col-sm-12" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- /REGISTER ADDRESS -->
  </main>
</template>
