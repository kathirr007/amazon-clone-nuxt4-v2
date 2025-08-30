<!-- <script>
import imgUploadMixin from '~/mixins/imgUpload'
import infoToastMixin from '~/mixins/infoToast'

export default {
  mixins: [infoToastMixin, imgUploadMixin],
  layout: 'admin',
  transition(to, from) {
    if (!from) {
      return 'slide-left'
    }
    return 'slide-right'
  },
  // middleware: "adminAdmin",
  async asyncData({ $axios }) {
    try {
      let categories = $axios.$get('/api/categories')
      let owners = $axios.$get('/api/owners')

      const [catResponse, ownerResponse] = await Promise.all([
        categories,
        owners,
      ])

      // console.log(catResponse.categories, ownerResponse.owners)

      return {
        categories: catResponse.categories,
        owners: ownerResponse.owners,
      }
    }
    catch (err) {
      console.log(err)
    }
  },
  data() {
    return {
      categoryID: null,
      ownerID: null,
      title: '',
      description: '',
      price: null,
      stockQuantity: null,
      selectedFile: null,
      selectedFiles: [],
      images: {},
      image: [],
    }
  },
  head() {
    return {
      title: 'Add a new product',
    }
  },
  comoputed: {},
  methods: {
    formatNames(files = []) {
      // this.selectedFile = files[0]
      if (files.length == 0) {
        return 'No file chosen'
      }
      if (files.length === 1) {
        return files[0].name
      }
      else {
        return `${files.length} files selected`
      }
    },
    resetProductForm() {
      this.ownerID = null
      this.categoryID = null
      this.title = ''
      this.description = ''
      this.price = null
      this.stockQuantity = null
      this.selectedFile = null
      this.selectedFiles = []
    },
    async onAddProduct() {
      let data = new FormData()
      for (let i = 0; i < this.images.length; i++) {
        data.append('prodImages', this.images[i])
      }
      data.append('title', this.title)
      data.append('price', this.price)
      data.append('description', this.description)
      data.append('stockQuantity', this.stockQuantity)
      data.append('ownerID', this.ownerID)
      data.append('categoryID', this.categoryID)
      // data.append('photo', this.selectedFile, this.selectedFile.name)
      // data.append('prodImages', this.selectedFiles)
      // debugger

      let result = await this.$axios.$post('/api/products', data)
      console.log(`The new product ${this.title} is added successfully...`)
      this.$refs.imagesInput.reset()
      this.image = []
      // this.$refs.productForm.reset()
      // this.selectedFiles = []
      // this.formatNames()
      this.makeToast(this.title, 'add')
      this.resetProductForm()
      // this.$router.push('/')
    },
  },
}
</script> -->

<script setup>
import { ref } from 'vue'
// import imgUploadMixin from '~/mixins/imgUpload'
// import infoToastMixin from '~/mixins/infoToast'

definePageMeta({
  layout: 'admin',
  transition: (to, from) => {
    if (!from)
      return 'slide-left'
    return 'slide-right'
  },
})

useHead({
  title: 'Add a new product',
})

const { makeToast } = useToastNotification()
const toast = useToastController()
const { imagesAdd, removeImage, image, selectedImages, imagesInput } = useImageUpload()

const { data: categoriesData } = await useFetch('/api/categories')
const { data: ownersData } = await useFetch('/api/owners')

const categories = ref(categoriesData.value.categories)
const owners = ref(ownersData.value.owners)

const categoryID = ref(null)
const ownerID = ref(null)
const title = ref('')
const description = ref('')
const price = ref(null)
const stockQuantity = ref(null)
const selectedFile = ref(null)
const formReset = ref(null)
const selectedFiles = ref([])
// const images = ref({})
// const image = ref([])

// const imagesInput = ref(null)
const productForm = ref(null)

function formatNames(files = []) {
  if (files.length === 0) {
    return 'No file chosen'
  }
  if (files.length === 1) {
    return files[0].name
  }
  return `${files.length} files selected`
}

function resetProductForm() {
  ownerID.value = null
  categoryID.value = null
  title.value = ''
  description.value = ''
  price.value = null
  stockQuantity.value = null
  selectedFile.value = null
  selectedFiles.value = []
}

async function onAddProduct() {
  const data = new FormData()
  for (let i = 0; i < selectedImages.value.length; i++) {
    data.append('prodImages', selectedImages.value[i])
  }
  data.append('title', title.value)
  data.append('price', price.value)
  data.append('description', description.value)
  data.append('stockQuantity', stockQuantity.value)
  data.append('ownerID', ownerID.value)
  data.append('categoryID', categoryID.value)

  try {
    await $fetch('/api/products', {
      method: 'POST',
      body: data,
    })

    console.log(`The new product ${title.value} is added successfully...`)
    imagesInput.value.reset()
    image.value = []
    makeToast({ type: 'product', title: title.value, status: 'add' })
    resetProductForm()
  }
  catch (error) {
    console.error(`Error adding product ${title.value}:`, error)
    toast.create({
      title: 'Error Adding Product',
      body: error.data.message ? error.data.message : (error.message || `There was an error adding the product ${title.value}. Please try again.`),
      variant: 'danger',
      progressProps: {
        variant: 'danger',
      },
    })
    // makeToast({ type: 'product', title: title.value, status: 'error', variant: 'danger' })
  }
}
</script>

<template>
  <main>
    <div class="container-fluid">
      <div class="row">
        <!-- <div class="col-sm-3"></div> -->
        <div class="col-md-6 offset-md-3">
          <h1 class="text-center mt-2">
            Add a New Product Form
          </h1>
          <nuxt-link to="/admin" type="button" class="btn mb-3 btn-outline-danger">
            Go Back
          </nuxt-link>
          <!-- <b-form @submit="onSubmit" @reset="onReset" v-if="show"> -->
          <b-form ref="productForm" class="d-flex flex-column gap-3">
            <!-- Category Selection dropdown -->
            <b-form-group label="Category:" label-for="productCategory">
              <b-form-select
                id="productCategory"
                v-model="categoryID"
                class="text-capitalize"
                required
              >
                <option value="null">
                  Select Category of the product
                </option>
                <option
                  v-for="category in categories"
                  :key="category._id"
                  class="text-capitalize"
                  :value="category._id"
                >
                  {{ category.type }}
                </option>
              </b-form-select>
            </b-form-group>

            <!-- Owner Selection dropdown -->
            <b-form-group
              label="Owner:"
              class="text-capitalize"
              label-for="productOwner"
            >
              <b-form-select id="productOwner" v-model="ownerID" required>
                <option value="null">
                  Select Owner of the product
                </option>
                <option
                  v-for="owner in owners"
                  :key="owner._id"
                  :value="owner._id"
                >
                  {{ owner.name }}
                </option>
              </b-form-select>
            </b-form-group>

            <!-- Product title -->
            <b-form-group
              label="Title:"
              label-for="productTitle"
              description="Please enter Product title here"
            >
              <b-form-input
                id="productTitle"
                v-model="title"
                type="text"
                required
                placeholder="Enter product title"
              />
            </b-form-group>

            <!-- Product Description -->
            <b-form-group label="Description: " label-for="productDescription">
              <b-form-textarea
                id="productDescription"
                v-model="description"
                placeholder="Enter product description..."
                rows="3"
                max-rows="6"
              />
            </b-form-group>

            <!-- Product images -->
            <b-form-group label="Photo:" label-for="productPhoto">
              <!-- <b-form-file @change="onFileSelected($event.target.files)" :file-name-formatter="formatNames" ref="imagesInput" multiple id="productPhoto"></b-form-file> -->
              <b-form-file
                id="productPhoto"
                ref="imagesInput"
                :file-name-formatter="formatNames"
                multiple
                title=" "
                @change="imagesAdd"
              />
            </b-form-group>

            <b-row align-v="center" class="uploaded-files">
              <div
                v-for="(prodImage, index) in image"
                :key="index"
                class="img-wrapp p-2"
              >
                <b-img thumbnail fluid :src="prodImage" />
                <!-- <i @click="deleteImage(prodImage,index)" class="delete-img fa fa-times"></i> -->
                <i
                  class="delete-img fas fa-times-circle"
                  @click="removeImage(index)"
                />
              </div>
            </b-row>

            <!-- Product Price -->
            <b-form-group
              label="Price:"
              label-for="productPrice"
              description="Please enter Product price here"
            >
              <b-form-input
                id="productPrice"
                v-model="price"
                type="number"
                required
                placeholder="Enter product price"
              />
            </b-form-group>

            <!-- Product Stock Quantity -->
            <b-form-group
              label="Stock Quantity:"
              label-for="stockQuantity"
              description="Please enter Product stock quantity here"
            >
              <b-form-input
                id="stockQuantity"
                v-model="stockQuantity"
                type="number"
                required
                placeholder="Enter product stock quantity"
              />
            </b-form-group>

            <b-button
              type="button"
              variant="primary"
              @click.prevent="onAddProduct"
            >
              Add Product
            </b-button>
            <!-- <span class="a-button-register">
              <span class="a-button-inner">
                <span class="a-button-text">
                  Add Product
                </span>
              </span>
            </span> -->
            <b-button ref="formReset" variant="danger">
              Reset
            </b-button>
          </b-form>
          <b-card class="my-3" header="Form Data Result">
            <!-- <pre class="m-0">{{ product }}</pre> -->
            <!-- <pre class="m-0">{{ categories }}</pre>
            <pre class="m-0">{{ owners }}</pre> -->
            <pre class="m-0">category: {{ categoryID }}</pre>
            <pre class="m-0">owner: {{ ownerID }}</pre>
            <pre class="m-0">title: {{ title }}</pre>
          </b-card>
        </div>
        <!-- <div class="col-sm-3"></div> -->
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
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
