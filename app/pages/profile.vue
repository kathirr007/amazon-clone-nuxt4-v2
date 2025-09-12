<!-- <script>
import { mapGetters } from 'vuex'

export default {
  middleware: 'loggedIn',
  transition(to, from) {
    if (!from) {
      return 'slide-left'
    }
    return 'slide-right'
  },
  data() {
    return {
      name: '',
      email: '',
      password: '',
    }
  },
  head: {
    title: 'Update Profile',
  },
  computed: {
    ...mapGetters(['authUser']),
    isFormEmpty() {
      return this.name === '' && this.email === '' && this.password === ''
    },
  },
  // middleware: "auth",
  // auth: 'guest',
  methods: {
    async onUpdateProfile() {
      // debugger
      let data = {
        name: this.name != '' ? this.name : this.$auth.$state.user?.name,
        email: this.email != '' ? this.email : this.$auth.$state.user?.email,
        password:
          this.password != '' ? this.password : this.$auth.$state.user.password,
      }
      // debugger
      try {
        let response = await this.$axios.$put('/api/auth/user', data)
        // debugger
        if (response.success) {
          // debugger
          this.name = ''
          this.email = ''
          this.password = ''

          await this.$auth.fetchUser()
        }
      }
      catch (err) {
        console.log(err)
      }
    },
    async onLogout() {
      try {
        await this.$auth.logout().then((_) => {
          console.log('logged out successfully...')
          this.$router.push('/')
        })
      }
      catch (error) {
        console.log(error)
      }
      // this.$router.push('/')
    },
  },
}
</script> -->

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
  middleware: ['auth'],
  transition: (to, from) => {
    if (!from)
      return 'slide-left'
    return 'slide-right'
  },
})

useHead({
  title: 'Update Profile',
})

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')

// const authUser = computed(() => auth.user)
const { user: authUser } = useUserSession()
const { capitalize } = useFilters()

const isFormEmpty = computed(() =>
  name.value === '' && email.value === '' && password.value === '',
)

async function onUpdateProfile() {
  const data = {
    name: name.value || auth.user?.name,
    email: email.value || auth.user?.email,
    password: password.value || auth.user?.password,
  }

  try {
    const { data: response } = await useFetch('/api/auth/user', {
      method: 'PUT',
      body: data,
    })

    if (response.value.success) {
      name.value = ''
      email.value = ''
      password.value = ''

      await auth.fetchUser()
    }
  }
  catch (err) {
    console.log(err)
  }
}

async function onLogout() {
  try {
    await auth.logout()
    console.log('logged out successfully...')
    router.push('/')
  }
  catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <main>
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-6 offset-md-3">
          <h1 class="text-center mt-2">
            <template v-if="authUser !== null">
              Profile {{ capitalize(authUser?.name) }}
            </template>
            <template v-else>
              Profile
            </template>
            <small>
              <a href="#" @click="onLogout">Logout</a>
            </small>
          </h1>

          <!-- <b-form @submit="onSubmit" @reset="onReset" v-if="show"> -->
          <b-form>
            <!-- User name -->
            <b-form-group
              label="Name:"
              label-for="userName"
              description="Please enter new name here"
            >
              <b-form-input
                id="userName"
                v-model="name"
                type="text"
                :placeholder="
                  authUser !== null
                    ? authUser?.name
                    : 'Please enter new name here'
                "
              />
            </b-form-group>
            <!-- Email -->
            <b-form-group
              label="Email:"
              label-for="email"
              description="Please enter new email here"
            >
              <b-form-input
                id="email"
                v-model="email"
                type="email"
                :placeholder="
                  authUser !== null
                    ? authUser?.email
                    : 'Please enter new email here'
                "
              />
            </b-form-group>
            <!-- Password -->
            <b-form-group label="Password:" label-for="password" description>
              <b-form-input
                id="password"
                v-model="password"
                type="password"
                required
                placeholder="Enter password"
              />
            </b-form-group>

            <b-row>
              <b-col class="mt-4">
                <span class="a-button-register" :class="{ 'pointer-events-none': isFormEmpty }">
                  <span class="a-button-inner">
                    <span class="a-button-text" @click="onUpdateProfile">Update Profile</span>
                  </span>
                </span>
              </b-col>
            </b-row>
            <!-- <b-button type="button" @click.prevent="onAddCategory" variant="primary">Update Profile</b-button>
            <b-button  ref="formReset" variant="danger">Reset</b-button> -->
          </b-form>
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
</style>
