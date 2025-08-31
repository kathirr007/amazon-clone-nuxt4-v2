<!-- <script>
import imgUploadMixin from '~/mixins/imgUpload'
import infoToastMixin from '~/mixins/infoToast'
// import StarRating from 'vue-star-rating'

export default {
  components: {
    // StarRating
  },
  mixins: [infoToastMixin, imgUploadMixin],
  middleware: 'loggedIn',
  async asyncData({ $axios, params }) {
    // debugger
    try {
      let response = await $axios.$get(`/api/products/${params.id}`)
      // console.log(response.product)
      return {
        product: response.product,
      }
    }
    catch (err) {
      console.log(err)
    }
  },
  // auth: 'guest',
  data() {
    return {
      selectedFiles: [],
      rating: 0,
      headline: '',
      body: '',
    }
  },
  head() {
    return {
      title: `Review ${this.product.title}`,
    }
  },
  methods: {
    formatNames(files = this.selectedFiles) {
      // this.selectedFile = files[0]
      if (files.length == 0) {
        return 'No file chosen'
      }
      if (files.length === 1) {
        return files[0].name ? files[0].name : files[0].originalname
      }
      else {
        return `${files.length} files selected`
      }
    },
    async onAddReview() {
      try {
        let data = new FormData()
        data.append('headline', this.headline)
        data.append('rating', this.rating)
        data.append('body', this.body)
        data.append('photo', this.images[0])

        let response = await this.$axios.$post(`/api/reviews/${this.$route.params.id}`, data)

        if (response.success) {
          this.$router.push(`/products/${this.$route.params.id}`)
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
const route = useRoute()
const router = useRouter()
const { user } = useUserSession()
const { selectedImages, imagesInput, imagesAdd, image } = useImageUpload()

definePageMeta({
  middleware: ['auth'],
})

const { data: productData } = await useAsyncData('product', () =>
  $fetch(`/api/products/${route.params.id}`))

const product = ref(productData.value.product)

const rating = ref(0)
const headline = ref('')
const body = ref('')

const ratingVariant = computed(() => {
  return rating.value > 4 ? 'success' : rating.value > 2 ? 'warning' : 'danger'
})

useHead({
  title: `Review ${product.value.title}`,
})

function handleRatingHover(event) {
  rating.value = event
}

function handleRatingChange(ratingValue) {
  // debugger
  rating.value = ratingValue
}

async function onAddReview() {
  try {
    const data = new FormData()
    data.append('headline', headline.value)
    data.append('rating', rating.value)
    data.append('body', body.value)
    if (selectedImages.value.length) {
      data.append('photo', selectedImages.value[0])
    }

    const response = await $fetch(`/api/reviews/${route.params.id}`, {
      method: 'POST',
      body: data,
    })

    if (response.success) {
      router.push(`/products/${route.params.id}`)
    }
  }
  catch (err) {
    console.log(err)
  }
}
</script>

<template>
  <main>
    <!-- REVIEW ADDRESS -->
    <div class="reviewPage mt-3">
      <div class="container-fluid c-section">
        <div class="row">
          <div class="col-sm-2" />
          <div class="col-sm-8">
            <div class="a-spacing-top-medium mb-5">
              <h1 class="a-spacing-base">
                <b>Create Review</b>
              </h1>
              <div class="row">
                <!-- Product Photo -->
                <div class="col-md-2 col-sm-3 col-3">
                  <img alt="Product Photo" :src="product.photo" style="width: 80px">
                </div>
                <!-- Product Title -->
                <div class="col-md-10 col-sm-9 col-9 m-auto">
                  <h4>
                    <b>{{ product.title }}</b>
                  </h4>
                </div>
              </div>
              <div class="a-spacing-top-medium" />
              <hr>
              <!-- <h2 class="a-spacing-base">Overall Rating</h2> -->

              <div class="a-row a-spacing-top-medium d-flex flex-column gap-3">
                <b-form-group label="Overall Rating:" label-for="reviewRating" class="" description="">
                  <div class="d-flex align-items-center gap-2">
                    <NuxtRating
                      :read-only="false"
                      border-color="#db8403"
                      active-color="#ffa41c"
                      inactive-color="#fff"
                      :rating-step="0.5"
                      :rounded-corners="true"
                      :border-width="5"
                      :rating-size="16"
                      :rating-value="rating"
                      @rating-selected="handleRatingChange"
                      @rating-hovered="handleRatingHover"
                    />
                    <BBadge :variant="ratingVariant">
                      {{ rating }}
                    </BBadge>
                  </div>
                </b-form-group>
                <!-- Review image -->
                <b-form-group label="Add photo or video:" label-for="reviewPhoto" description="Shoppers find images and videos more helpful than text alone.">
                  <client-only>
                    <b-form-file id="reviewPhoto" ref="imagesInput" title=" " type="file" @update:model-value="imagesAdd" />
                  </client-only>
                </b-form-group>

                <b-row align-v="center" class="uploaded-files">
                  <div v-for="(ownerImage, index) in image" :key="index" class="img-wrapp p-2">
                    <b-img thumbnail fluid :src="ownerImage" />
                    <!-- <i @click="removeImage(index)" class="delete-img fas fa-times-circle"></i> -->
                  </div>
                </b-row>
                <!-- <b-row v-else-if="owner.photo != ''" align-v="center" class="uploaded-files">
                    <div class="img-wrapp p-2">
                        <b-img thumbnail fluid :src="owner.photo"></b-img>
                    </div>
                </b-row> -->
              </div>
              <div class="a-spacing-top-large" />
              <hr>
              <!-- Headline -->
              <div class="headline a-spacing-large">
                <b-form-group label="Add review headline:" label-for="reviewHeadline" description="">
                  <b-form-input id="reviewHeadline" v-model="headline" type="text" required placeholder="What's most important to know?" />
                </b-form-group>
              </div>
              <div class="a-spacing-base">
                <!-- Review Description -->
                <b-form-group label="Write your review: " label-for="reviewDescription">
                  <b-form-textarea id="reviewDescription" v-model="body" placeholder="What do you like or dislike? What did you see this product for?" rows="3" max-rows="6" />
                </b-form-group>
              </div>
            </div>
            <hr>
            <div class="a-spacing-top-medium">
              <p
                style="font-size: 14px; font-weight: 700;"
              >
                This is how you'll appear to other customers:
              </p>
              <div class="media">
                <div class="media-left">
                  <img src="/img/avatar.png" alt="Avatar" class="img-fluid" style="width: 50px;">
                </div>
                <div class="media-body pl-3 pt-2">
                  <input type="text" class="a-input-text" :value="user.name" style="width: 100%;">
                </div>
              </div>
            </div>
            <div class="a-row mt-2">
              <span class="a-color-tertiary">Don't worry, you can always change this on your profile</span>
            </div>
            <div class="a-row text-right a-spacing-top-large">
              <span class="a-button-register">
                <span class="a-button-inner">
                  <span class="a-button-text" @click="onAddReview">Submit</span>
                </span>
              </span>
            </div>
          </div>
          <div class="col-sm-2" />
        </div>
        <div class="a-spacing-large pb-5" />
        <hr>
      </div>
    </div>
    <!-- /REVIEW ADDRESS -->
  </main>
</template>

<style scoped lang="scss">
.img-wrapp {
  position: relative;
  width: 25%;
  .img-thumbnail {
    padding: 1rem;
  }
  .delete-img.fas {
    position: absolute;
    right: 5px;
    top: 0px;
    cursor: pointer;
    font-size: 18px !important;
    color: unset !important;
    transition: color 0.2s ease-in;
    &:hover {
      color: orangered !important;
    }
  }
}
</style>
