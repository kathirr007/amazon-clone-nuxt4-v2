<script setup>
import { useToastController } from 'bootstrap-vue-next'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
// import { useAuth } from 'nuxt-auth-utils/client'
// import infoToastMixin from "~/mixins/infoToast"

// Define reactive refs
const name = ref('')
const email = ref('')
const password = ref('')

const router = useRouter()
const toast = useToastController()
const { fetch, user } = useUserSession()

// Page metadata
useHead({
  title: 'Signup',
})

// Define page transition
definePageMeta({
  layout: 'admin',
  middleware: 'is-guest',

})

// Signup method
async function onSignup() {
  try {
    const { data: response } = await useFetch('/api/auth/signup', {
      method: 'POST',
      body: {
        name: name.value,
        email: email.value,
        password: password.value,
      },
    })

    if (response.value.success) {
      await fetch()
      const userName = user.value.name

      const vNodeMessage = h('div', [
        'Welcome ',
        h('strong', `${userName}`),
      ])

      toast.create({
        title: 'Login',
        body: '', // Optional, since we will use slots
        slots: {
          default: () => vNodeMessage,
        },
        variant: 'success',
        progressProps: {
          variant: 'success',
        },
      })

      router.go('/')
    }
    else {
      toast.create({
        title: 'SignIn Error',
        body: response.value.message,
        variant: 'danger',
        progressProps: {
          variant: 'danger',
        },
      })
    }
  }
  catch (err) {
    console.error(err)
  }
}
</script>

<!-- <script>
import infoToastMixin from "~/mixins/infoToast";
export default {
  layout: "admin",
  transition(to, from) {
    if (!from) {
      return "slide-left";
    }
    return "slide-right";
  },
  middleware: "isGuest",
  // auth: 'guest',
  // layout: 'none',
  head() {
    return {
      title: "Signup",
    };
  },
  data() {
    return {
      customerName: "",
      name: "",
      email: "",
      password: "",
    };
  },
  mixins: [infoToastMixin],
  methods: {
    async onSignup() {
      // debugger;
      try {
        let data = {
          name: this.name,
          email: this.email,
          password: this.password,
        };
        // debugger;
        let response = await this.$axios.$post("/api/auth/signup", data);

        // console.log(response);

        if (response.success) {
          await this.$auth
            .loginWith("local", {
              data: {
                email: this.email,
                password: this.password,
              },
            })
            .then((_) => {
              this.$root.$bvToast.toast(`Welcome ${this.name}`, {
                title: `Login`,
                variant: "success",
                autoHideDelay: 2000,
                solid: true,
              });
              this.$router.push("/");
            });
        } else {
          // console.log(response);
          this.$bvToast.toast(`${response.message}`, {
            title: `Signup Error`,
            variant: "danger",
            solid: true,
          });
        }
      } catch (err) {}
    },
  },
};
</script> -->

<template>
  <div class="registerPage">
    <div class="container">
      <div class="row">
        <!-- <b-col col sm="4"></b-col> -->
        <b-col col md="6" offset-md="3">
          <div class="text-center">
            <nuxt-link to="/">
              <b-img src="/img/logo-black.png" />
            </nuxt-link>
          </div>

          <b-form class="mt-3">
            <div class="a-box a-spacing-extra-large">
              <div class="a-box-inner">
                <h1 class="a-spacing-small">
                  Create account
                </h1>
                <!-- Your Name -->
                <div class="a-row a-spacing-base">
                  <label for="ap_customer_name" class="a-form-label">Your name</label>
                  <input
                    id="ap_customer_name"
                    v-model="name"
                    type="text"
                    class="a-input-text form-control auth-atofocus auth-required-field auth-verification-request-info"
                  >
                </div>
                <!-- Email -->
                <div class="a-row a-spacing-base">
                  <label for="ap_customer_email" class="a-form-label">Email</label>
                  <input
                    id="ap_customer_email"
                    v-model="email"
                    type="email"
                    class="a-input-text form-control auth-atofocus auth-required-field auth-verification-request-info"
                  >
                </div>
                <!-- Password -->
                <div class="a-row a-spacing-base">
                  <label for="ap_customer_password" class="a-form-label">Password</label>
                  <input
                    id="ap_customer_password"
                    v-model="password"
                    type="password"
                    class="a-input-text form-control auth-atofocus auth-required-field auth-verification-request-info"
                  >
                  <div class="a-alert-container pl-0">
                    <div class="a-alert-content">
                      Password must be at least 6 characters
                    </div>
                  </div>
                </div>
                <!-- Button -->
                <div class="a-row a-spacing-extra-large mb-4">
                  <span class="a-button-primary">
                    <span class="a-button-inner">
                      <span class="a-button-text" @click="onSignup">Create your Amazon account</span>
                    </span>
                  </span>
                  <div
                    class="a-row a-spacing-top-medium a-size-small text-center"
                  >
                    <b>
                      By creating an account, you agree to Amazon's
                      <a href="#">Conditions of use</a> and
                      <a href="#">Privacy notice</a>
                    </b>
                  </div>
                </div>
                <hr>
                <div class="a-row text-center">
                  <b>
                    Already have an account?
                    <nuxt-link to="/login" class="a-link-emphasis">Sign in</nuxt-link>
                  </b>
                </div>
              </div>
            </div>
          </b-form>
        </b-col>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>
