<script setup>
import ReviewSection from '~/components/ReviewSection'
import { useCartStore } from '~/stores/useCartStore'

const store = useCartStore()
const route = useRoute()

// Define auth
definePageMeta({
  auth: false,
  transition: (to, from) => {
    if (!from)
      return 'slide-left'
    return 'slide-right'
  },
})

// Fetch data
const { data: productData } = await useAsyncData('product', () => {
  return $fetch(`/api/products/${route.params.id}`)
}, {
  immediate: true,
  server: true,
})
const { data: reviewsData } = await useAsyncData('reviews', () =>
  $fetch(`/api/reviews/${route.params.id}`), { immediate: true, server: true })

const product = computed(() => productData.value?.product)
const reviews = computed(() => reviewsData.value?.reviews)

// Page meta
useHead(() => ({
  title: product.value?.title.replace(/\w\S*/g, w =>
    w.replace(/^\w/, c => c.toUpperCase())),
}))

// Methods
function addProductToCart(product) {
//   store.dispatch('addProductToCart', product)
  store.addProductToCart(product)
}
</script>

<template>
  <main>
    <div class="container-fluid mt-2">
      <div class="wayfinding-breadcrumbs-container">
        <ul class="a-unordered-lista a-horizontal a-size-small">
          <li>
            <span class="a-list-item">
              <a href="#" class="a-link-normal a-color-tertiary">{{
                product?.category.type
              }}</a>
            </span>
          </li>
          <li>
            <span class="a-list-item">></span>
          </li>
          <li>
            <span class="a-list-item">
              <a href="#" class="a-link-normal a-color-tertiary">{{
                product?.title
              }}</a>
            </span>
          </li>
        </ul>
      </div>
    </div>
    <div class="container-fluid">
      <div class="dp-container">
        <div class="row">
          <!-- First 3 grid - Product Image and Author's section -->
          <b-col col sm="4" md="3" lg="3">
            <div class="leftCol">
              <!-- Image -->
              <div class="imgBlock">
                <div class="eBooksimg">
                  <b-img fluid :src="product?.photo" />
                </div>
              </div>

              <!-- Follow Author -->
              <div class="authorFollow">
                <hr class="a-divider-normal">
                <h1 class="authorFollowHeading">
                  Follow The Author
                </h1>
                <div class="mt-2">
                  <div class="row">
                    <!-- Author's Image -->
                    <b-col cols="3" sm="3" md="3" lg="3" xl="3">
                      <div class="smallAuthorImageContainer">
                        <a href="#">
                          <b-img fluid :src="product?.owner.photo" />
                        </a>
                      </div>
                    </b-col>
                    <!-- Author's Name -->
                    <b-col cols="3" sm="3" md="3" lg="3" xl="4">
                      <div class="authorNameCol">
                        <a href="#">{{ product.owner.name }}</a>
                      </div>
                    </b-col>
                    <!-- Author's Follow Button -->
                    <b-col cols="6" sm="6" md="6" lg="6" xl="5">
                      <div class="authorBtn mt-2">
                        <a href="#">
                          <span class="btnFollow">
                            <span class="a-btn-inner">
                              <button class="a-btn-text">+ Follow</button>
                            </span>
                          </span>
                        </a>
                      </div>
                    </b-col>
                  </div>
                </div>
              </div>
            </div>
          </b-col>
          <!-- Middle 6 grid Description -->
          <b-col col sm="8" md="6" lg="6">
            <div class="centerCol">
              <!-- Product Title -->
              <div class="titleDiv">
                <h1 class="productTitle">
                  <span class="largeTitle">{{ product?.title }}</span>
                  <!-- <span class="smallTitle">Product title small</span> -->
                </h1>
              </div>
              <!-- Author's Name -->
              <div class="bylineinfo">
                by
                <a href="#" class="authorName">
                  {{ product.owner.name }}
                  <i
                    class="fas fa-chevron-down"
                    :style="{ fontSize: '8px', color: '#55555 !important' }"
                  />
                </a>
                (Author)
              </div>
              <div class="reviewGroup border-bottom pb-2">
                <NuxtRating
                  border-color="#db8403"
                  active-color="#ffa41c"
                  inactive-color="#fff"
                  :rating-step="0.5"
                  :rounded-corners="true"
                  :border-width="5"
                  :rating-size="16"
                  :rating-value="product.averageRating"
                  @rating-hovered="event => (rating = event)"
                />
              </div>
              <!-- A tags Dummy data -->
              <div class="mediaMatrix mt-2">
                <div class="formats">
                  <a href="#" class="link-expander">
                    >
                    <span class="tmmShowPrompt">See all 18 formats and editions</span>
                  </a>
                  <ul>
                    <!-- Kindle -->
                    <li class="swatchElement" style="width: 117px">
                      <span class="a-list-item">
                        <span class="a-button-toggle">
                          <span class="a-button-inner">
                            <a href="#" class="a-button-text">
                              <span>Kindle</span>
                              <br>
                              <span class="a-color-secondary">-</span>
                            </a>
                          </span>
                        </span>
                        <span class="tmm-olp-links" />
                        <span class="tmm-olp-links">
                          <a href="#" class="a-size-min">
                            <span class="kcpAppBox">
                              <span class="a-declarative">
                                Read with Our
                                <span class="a-text-bold">Free App</span>
                              </span>
                            </span>
                          </a>
                        </span>
                      </span>
                    </li>
                    <!-- Audible -->
                    <li class="swatchElement" style="width: 117px">
                      <span class="a-list-item">
                        <span class="a-button-toggle">
                          <span class="a-button-inner">
                            <a href="#" class="a-button-text">
                              <span>
                                <b-img
                                  src="/img/audiblelogo.png"
                                  fluid
                                  style="width: 20px"
                                />Audible
                              </span>
                              <br>
                              <span class="a-color-secondary">-</span>
                            </a>
                          </span>
                        </span>
                        <span class="tmm-olp-links" />
                        <span class="tmm-olp-links">
                          <a href="#" class="a-size-min">
                            <span class="kcpAppBox">
                              <span class="a-declarative">
                                <span class="a-text-bold">Free App</span> with
                                your Audible trial
                              </span>
                            </span>
                          </a>
                        </span>
                      </span>
                    </li>
                    <!-- Paperback -->
                    <li class="swatchElement" style="width: 117px">
                      <span class="a-list-item">
                        <span class="a-button-toggle">
                          <span class="a-button-inner">
                            <a href="#" class="a-button-text">
                              <span>Paperback</span>
                              <br>
                              <span class="a-color-secondary">-</span>
                            </a>
                          </span>
                        </span>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              <!-- Description -->
              <div class="bookDescription">
                <div class="bookDescriptionInner">
                  {{ product.description }}
                </div>
              </div>

              <!-- Product Specification -->
              <div class="aboutEbooksFeature">
                <hr>
                <div class="row">
                  <b-col col sm="4" mb-1>
                    <div class="a-declarative">
                      Length:
                      <span>
                        <a href="#">
                          386 pages
                          <i class="a-icon a-icon-popover" />
                        </a>
                      </span>
                    </div>
                  </b-col>
                </div>
              </div>
            </div>
          </b-col>
          <!-- Last 3 grid - Buying section -->
          <b-col col sm="6" md="3">
            <div class="combinedBuyBox">
              <div class="buyBox">
                <div class="a-section">
                  <div class="clearfix">
                    <div class="float-left">
                      <form>
                        <input
                          id="test1"
                          type="radio"
                          name="radio-group checked"
                        >
                        <label for="test1">Buy Now</label>
                      </form>
                    </div>

                    <!-- Product Price -->
                    <div class="float-right">
                      <span
                        class="a-size-medium a-color-price offer-price a-text-normal"
                      >${{ product.price }}</span>
                    </div>
                  </div>
                </div>

                <div class="a-section a-spacing-none">
                  <div class="row">
                    <b-col cols="5" sm="5">
                      <select id name>
                        <option value="1">
                          Qty: 1
                        </option>
                        <option value="2">
                          Qty: 2
                        </option>
                        <option value="3">
                          Qty: 3
                        </option>
                        <option value="4">
                          Qty: 4
                        </option>
                        <option value="5">
                          Qty: 5
                        </option>
                        <option value="6">
                          Qty: 6
                        </option>
                        <option value="7">
                          Qty: 7
                        </option>
                        <option value="8">
                          Qty: 8
                        </option>
                        <option value="9">
                          Qty: 9
                        </option>
                        <option value="10">
                          Qty: 10
                        </option>
                      </select>
                    </b-col>
                  </div>
                </div>

                <div class="a-section a-spacing-small a-spacing-top-micro">
                  <div class="row">
                    <span class="a-color-base buyboxShippingLabel" />
                  </div>
                </div>
                <div class="a-section a-spacing-small">
                  <div class="a-section a-spacing-none">
                    <span class="a-size-medium a-color-success">In Stock</span>
                  </div>
                  <div class="a-section a-spacing-mini">
                    Ships from and sold by Amazon.com
                  </div>
                </div>

                <div class="a-section">
                  <div
                    class="a-button-stack"
                    @click="addProductToCart(product)"
                  >
                    <span
                      class="a-spacing-small a-button-primary a-button-icon"
                    >
                      <span class="a-button-inner">
                        <i class="a-icon a-icon-cart" />
                        <input
                          type="submit"
                          name="submit.add-to-card"
                          class="a-button-input"
                        >
                        <span class="a-button-text">Add to Cart</span>
                      </span>
                    </span>
                  </div>
                  <div class="a-button-stack">
                    <nuxt-link
                      to="/placeorder"
                      class="a-spacing-small a-button-primary a-button-icon"
                    >
                      <span class="a-button-inner">
                        <i class="a-icon a-icon-buynow" />
                        <input
                          type="submit"
                          name="submit.add-to-card"
                          class="a-button-input"
                        >
                        <span class="a-button-text">Buy Now</span>
                      </span>
                    </nuxt-link>
                  </div>
                </div>

                <div class="a-row">
                  <div class="a-spacing-top-small">
                    <div class="a-section a-spacing-none">
                      <div class="a-section a-spacing-none a-spacing-top-mini">
                        This item ships to
                        <b>India</b>
                        <b>Get it by Monday, Sep 23 - Monday, Sept. 30</b>
                        Choose this date at checkout
                      </div>
                    </div>
                  </div>
                </div>

                <hr>

                <span class="a-declarative">
                  <a href="#" class="a-link-normal">
                    <div class="a-row a-spacing-mini">
                      <i class="fal fa-map-marked-alt" />
                      <span class="a-size-small">Deliver to India</span>
                    </div>
                  </a>
                </span>
                <br>
                <hr>
                <div class="a-section">
                  <div class="clearfix">
                    <div class="float-left">
                      <form>
                        <input id="test2" type="radio" name="radio-group">
                        <label for="test1">Buy Now</label>
                      </form>
                    </div>
                    <div class="flow-right">
                      <span class="a-color-base offer-price a-text-normal">${{ product.price }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="kcpAppBasebox text-center">
              <b-img src="/img/readyondevice.png" fluid />
            </div>
          </b-col>
        </div>

        <br>
        <hr>
        <div class="books-entity-tease">
          <div class="bucket">
            <h2>More about the author</h2>
            <div class="content">
              <div class="row">
                <!-- Author's photo and Button -->
                <b-col cols="4" sm="4" md="2">
                  <div class="authorContent">
                    <div class="authorImageSingle">
                      <a href="#">
                        <b-img fluid :src="product.owner.photo" />
                      </a>
                    </div>
                    <div class="authorFollow">
                      <button class="followButton" type="button">
                        <span class="pr-fb-icon" />
                        <span class="pr-fb-text">Follow</span>
                      </button>
                    </div>
                  </div>
                </b-col>
                <!-- Author's about -->
                <b-col cols="8" sm="8" md="10" class="pl-0">
                  <div class="mainContent">
                    <h3>Biography</h3>
                    <div id="authorBio">
                      {{ product.owner.about }}
                    </div>
                  </div>
                </b-col>
              </div>
            </div>
          </div>
        </div>

        <ReviewSection v-if="product && reviews" :product="product" :reviews="reviews" />
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
</style>
