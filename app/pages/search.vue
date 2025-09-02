<script setup>
const route = useRoute()
const products = ref([])

definePageMeta({
  auth: false,
  layout: 'default',
  transition: {
    name: (route) => {
      return !route.from ? 'slide-left' : 'slide-right'
    },
  },
})

useHead({
  title: 'Client | Search',
})

const { data } = await useFetch('/api/search', {
  method: 'POST',
  body: { title: route.query.title },
})

products.value = data.value || []

watch(() => route.query.title, async () => {
  const { data } = await useFetch('/api/search', {
    method: 'POST',
    body: { title: route.query.title },
  })
  products.value = data.value || []
})
</script>

<template>
  <main class="listingPage">
    <div class="container-fluid">
      <div class="row">
        <div class="col-4 col-xl-2 col-lg-3 col-md-4 col-sm-4">
          <!-- Sidebar -->
        </div>
        <!-- Main Content -->
        <div class="col col-xl-10 col-lg-9 col-md-8 col-sm-8">
          <div class="mainResults">
            <ul class="s-result-list">
              <template v-if="products.length !== 0">
                <li v-for="product in products" :key="product._id" class="s-result-item celwidget">
                  <div class="s-item-container">
                    <!-- Best Seller -->
                    <div class="bestSeller my-2">
                      <a href="#">Best Seller</a>
                    </div>
                    <div>
                      <div class="row">
                        <!-- Image -->
                        <div class="col-sm-3 text-center">
                          <NuxtLink :to="`/products/${product.objectID}`">
                            <img class="prodImage img-fluid" :src="product.photo" :alt="product.title">
                          </NuxtLink>
                        </div>
                        <div class="col-sm-9">
                          <div class="row">
                            <!-- Title and Date -->
                            <div class="col">
                              <NuxtLink :to="`/products/${product.objectID}`" class="a-link-normal">
                                <h2 class="a-size-medium">
                                  {{ product.title }}
                                  <span class="a-letter-space" />
                                  <span class="a-letter-space" />
                                  <span class="a-size-small a-color-secondary">Sep 3, 2020</span>
                                </h2>
                              </NuxtLink>
                            </div>
                          </div>
                          <!-- Author's name -->
                          <div class="row">
                            <div class="col">
                              <span class="a-size-small a-color-secondary">by</span>
                              <span class="a-size-small a-color-secondary">
                                <a href="#" class="a-link-normal a-text-normal">{{ product.owner?.name || 'N/A' }}</a>
                              </span>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col">
                              <span class="a-size-small">Ships to USA</span>
                            </div>
                          </div>
                          <div class="row">
                            <div class="col-sm-7">
                              <div>
                                <a href="" class="a-link-normal a-text-normal">Hardcover</a>
                              </div>
                              <!-- Price -->
                              <div class="product-price-wrapper">
                                <a href="#" class="a-link-normal a-text-normal">
                                  <span class="a-offscreen">${{ product.price }}</span>
                                  <span class="a-color-base sx-zero-spacing">
                                    <span class="sx-price sx-price-large">
                                      <span class="sx-price-currency">$</span>
                                      <span class="sx-price-whole">{{ product.price }}</span>
                                      <sup class="sx-price-fractional">00</sup>
                                    </span>
                                  </span>
                                </a>
                                <span class="a-letter-space" />
                                <span class="a-size-base-plus a-color-secondary a-text-strike">
                                  $28.00
                                </span>
                              </div>

                              <div>
                                <!-- Audible Trial -->
                                <div class="col-12 border-bottom pb-1 px-0">
                                  <span class="a-size-small a-color-secondary">Free with Audible trial</span>
                                </div>
                                <!-- Other Formats -->
                                <div class="col-12 pt-1 px-0 a-size-small a-color-secondary">
                                  Other Formats:
                                  <span class="a-letter-space" />
                                  <a href="#" class="a-size-small a-link-normal a-text-normal">Audio CD</a>
                                </div>
                              </div>
                            </div>
                            <!-- Ratings -->
                            <div class="col-sm-5">
                              <div class="a-row a-spacing-mini">
                                <!-- Star Ratings -->
                                <NuxtRating
                                  border-color="#db8403"
                                  active-color="#ffa41c"
                                  inactive-color="#fff"
                                  :rating-step="0.5"
                                  :rounded-corners="true"
                                  :border-width="5"
                                  :rating-size="16"
                                  :rating-value="product.averageRating"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </template>
              <template v-else>
                <li class="s-result-item celwidget">
                  <div class="s-item-container">
                    <div>
                      <div class="row">
                        <div class="col-12 col-sm-5 offset-sm-2 text-center text-dark">
                          <h3>
                            Sorry <strong><i class="far fa-frown h3" /></strong>
                          </h3>
                          No Results found for the search term <strong class="text-warning h5">{{ $route.query.title }}</strong> <br>
                          Please try with other search terms.
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              </template>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.celwidget {
  .prodImage {
    height: 200px;
    object-fit: contain;
  }
}
.product-price-wrapper {
  display: flex;
  gap: 0.25rem;

  .sx-price-large {
    display: flex;
    align-items: flex-start;
    gap: 0.35rem;
  }
}
</style>
