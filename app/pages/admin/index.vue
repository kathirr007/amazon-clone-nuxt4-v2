<script setup>
/* import { definePageMeta, useNuxtApp, useRouter, useStore } from 'nuxt/app'
import { computed, createElement, onMounted, reactive, ref } from 'vue'
import deleteConfirmationMixin from '~/mixins/deleteConfirmation'
import infoToastMixin from '~/mixins/infoToast'

const Carousel = defineAsyncComponent(() =>
  import.meta.client ? import('vue-carousel').then(m => m.Carousel) : null,
)

const Slide = defineAsyncComponent(() =>
  import.meta.client ? import('vue-carousel').then(m => m.Slide) : null,
) */

const carouselConfig = {
  height: 200,
  itemsToShow: 1,
  gap: 5,
  // autoplay: 4000,
  wrapAround: true,
  pauseAutoplayOnHover: true,
}

// const { $axios } = useNuxtApp()
/* const router = useRouter()
const store = useStore() */

const { confirmDeletion } = useConfirmDeletion()
const { makeToast } = useToastNotification()

// const products = ref([])
/* const slide = ref(0)
const carouselOptions = reactive({
  loop: true,
  perPage: 1,
  autoplay: false,
  paginationColor: '#ffb300',
}) */

// const { user: authUser } = useUserSession()

/* onMounted(async () => {
  try {
    const response = await $axios.$get('/api/products')
    products.value = response.products
  }
  catch (err) {
    console.error(err)
  }
}) */

const { data: products, refresh: refreshProducts } = await useAsyncData('products', () =>
  $fetch('/api/products').then(response => response.products), {
  onError: (error) => {
    console.error('Error fetching products:', error)
  },
})

async function onDeleteProduct(id, index, title) {
  try {
    const response = await $fetch(`/api/products/${id}`, { method: 'DELETE' })
    makeToast({ type: 'product', title, status: 'delete', variant: 'danger' })
    if (response.success) {
      refreshProducts()
    }
  }
  catch (err) {
    console.log(err)
  }
}

definePageMeta({
  layout: 'admin',
  title: 'Home | Admin',
  transition: (to, from) => {
    if (!from)
      return 'slide-left'
    return 'slide-right'
  },
})
</script>

<template>
  <main>
    <div class="container-fluid browsing-history mb-3">
      <div class="row">
        <div class="col-sm-8 col-12 text-center text-sm-start">
          <h1 class="mb-3">
            All products
          </h1>
          <!-- Buttons -->
          <div class="d-flex gap-2">
            <nuxt-link to="/" class="a-button-buy-again">
              Back to Client Home
            </nuxt-link>
            <nuxt-link to="/admin/products/add" class="a-button-buy-again">
              Add a new product
            </nuxt-link>
            <nuxt-link to="/admin/category" class="a-button-buy-again">
              Add a new category
            </nuxt-link>
            <nuxt-link to="/admin/owners" class="a-button-buy-again">
              Add a new owner
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>
    <div class="container-fluid browsing-history">
      <!-- <div class="row">
        <div v-for="(product) in products" :key="product._id" class="col-lg-3 col-sm-6 col-12">
          <b-card
            :title="product.title"
            :img-src="product.photo != ''? product.photo : ''"
            :img-alt="product.title"
            img-top
            tag="article"
            class="mb-2 history-box img-fluid p-2"
          >
            <b-card-text>
              {{product.description}}
            </b-card-text>
            <b-card-text>
              <a href=""></a>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <span class="a-letter-space"></span>
              <span class="a-color-tertiary a-size-small asin-reviews">(1774)</span>
            </b-card-text>
            <b-card-text>
              Price: <span class="text-danger">{{product.price}}</span>
            </b-card-text>

            <div class="float-right">
              <b-button href="#" variant="primary">Update</b-button>
              <b-button href="#" variant="dark">Delete</b-button>
            </div>
          </b-card>
        </div>
      </div> -->
      <div class="row">
        <!-- <div>
          <client-only>
            <carousel v-bind="options">
              <slide v-for="i in 5" :key="i" class="img-wrapper">
                <img src="https://via.placeholder.com/150" />
              </slide>
            </carousel>
          </client-only>
        </div> -->
        <div>
          <b-card-group columns class="px-3">
            <!-- <b-card
              v-for="(product, index) in products" :key="product._id"
              :title="product.title"
              :img-src="product.photo"
              :img-alt="product.title"
              img-top
              tag="article"
              class="mb-2 history-box p-2"
            >
              <b-card-text>
                {{product.description}}
              </b-card-text>
              <b-card-text>
                <a href=""></a>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <span class="a-letter-space"></span>
                <span class="a-color-tertiary a-size-small asin-reviews">(1774)</span>
              </b-card-text>
              <b-card-text>
                Price: <span class="text-danger">{{product.price}}</span>
              </b-card-text>

              <div class="float-right">
                <nuxt-link :to="`products/${product._id}`" variant="primary" class="btn btn-primary">Update</nuxt-link>
                <b-button href="#" variant="dark" @click.prevent="onDeleteProduct(product._id, index, product.title)">Delete</b-button>
              </div>
            </b-card> -->
            <b-card
              v-for="(product, index) in products"
              :id="product._id"
              :key="product._id"
              tag="article"
              class="mb-2 history-box p-2"
            >
              <!-- <client-only
                v-if="product.prodImages && product.prodImages.length !== 0"
              >
                <Carousel v-bind="carouselOptions">
                  <Slide v-for="(image, i) in product.prodImages" :key="i">
                    <b-img :src="image.location" />
                  </Slide>
                </Carousel>
              </client-only>
              <div v-else class="img-wrap text-center">
                <b-img :src="product.photo" fluid />
              </div> -->
              <Carousel v-if="product.prodImages && product.prodImages.length !== 0" v-bind="carouselConfig">
                <Slide v-for="(image, i) in product.prodImages" :key="i">
                  <b-img :src="image.location" />
                </Slide>

                <template #addons>
                  <Navigation />
                  <Pagination />
                </template>
              </Carousel>
              <div v-else class="img-wrap text-center">
                <b-img :src="product.photo" fluid />
              </div>
              <h3 class="card-title">
                {{ product.title }}
              </h3>
              <b-card-text>
                <client-only>
                  <Vue3TextClamp :text="product.description" :max-lines="3">
                    <template #after="{ toggle, expanded, clamped }">
                      <BLink v-if="expanded || clamped" class="d-inline-block ps-2" @click="toggle">
                        {{ expanded ? "Show Less" : "Show More" }}
                      </BLink>
                    </template>
                  </Vue3TextClamp>
                </client-only>
              </b-card-text>
              <b-card-text>
                <a href="" aria-label="Product Rating" />
                <i class="fas fa-star" />
                <i class="fas fa-star" />
                <i class="fas fa-star" />
                <i class="fas fa-star" />
                <i class="fas fa-star" />
                <span class="a-letter-space" />
                <span class="a-color-tertiary a-size-small asin-reviews">(1774)</span>
              </b-card-text>
              <b-card-text>
                Price: <span class="text-danger">{{ product.price }}</span>
              </b-card-text>

              <div class="d-flex justify-content-end gap-2">
                <nuxt-link
                  :to="`/admin/products/${product._id}`"
                  variant="primary"
                  class="btn btn-primary"
                >
                  Update
                </nuxt-link>
                <b-button
                  variant="dark"
                  @click.prevent="
                    confirmDeletion({ id: product._id, index, title: product.title, e: $event, deleteCallback: onDeleteProduct })
                  "
                >
                  Delete
                </b-button>
              </div>
            </b-card>
          </b-card-group>
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.card-img-top,
.img-wrap .img-fluid,
.VueCarousel-slide img {
  width: 100%;
  height: 200px;
  object-fit: contain;
}
@media (min-width: 576px) {
  .card-columns {
    column-count: 2;
    column-gap: 1rem;
  }
}
@media (min-width: 992px) {
  .card-columns {
    column-count: 3;
  }
}
@media (min-width: 1400px) {
  .card-columns {
    column-count: 4;
  }
}
/*  .VueCarousel {
   .VueCarousel-wrapper {
     .VueCarousel-inner{
       .VueCarousel-slide {
         img {
           width: 100%;
           height: auto;
         }
       }
     }
   }
 } */

.carousel {
  --vc-pgn-background-color: rgba(255, 255, 255, 0.7);
  --vc-pgn-active-color: rgba(255, 255, 255, 1);
  --vc-nav-background: rgba(255, 255, 255, 0.7);
  --vc-nav-border-radius: 100%;
}

img {
  border-radius: 8px;
  width: auto;
  height: 100%;
  object-fit: contain;
}
</style>

<style lang="scss">
.VueCarousel-dot-container {
  margin-top: 0 !important;
  .VueCarousel-dot {
    margin-top: 0 !important;
    &:focus,
    &:active {
      outline: none !important;
    }
    &.VueCarousel-dot--active {
      // margin-top: 0 !important;
      width: 15px !important;
      height: 15px !important;
      background-color: chocolate !important;
    }
  }
}
.b-toaster {
  &.b-toaster-top-right {
    .b-toaster-slot {
      min-width: 300px;
      max-width: 45%;
      .b-toast,
      .toast {
        max-width: unset;
      }
    }
  }
}
</style>
