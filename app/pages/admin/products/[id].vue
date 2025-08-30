<script setup>
const route = useRoute()
const router = useRouter()

// Data fetching
// const { data: categoriesData } = await useFetch('/api/categories')
// const { data: ownersData } = await useFetch('/api/owners')
// const { data: productData } = await useFetch(`/api/products/${route.params.id}`)

const { data: categoriesData } = await useAsyncData('categories', () => $fetch('/api/categories'))
const { data: ownersData } = await useAsyncData('owners', () => $fetch('/api/owners'))
const { data: productData } = await useAsyncData('product', () => $fetch(`/api/products/${route.params.id}`))

const categories = ref(categoriesData.value.categories)
const owners = ref(ownersData.value.owners)
const product = ref(productData.value.product)

// Refs
const category = ref('')
const owner = ref('')
// const selectedFile = ref(null)
const uploadedFiles = ref([])
// const mergedFiles = ref([])
const productForm = ref(null)
// const imagesInput = ref(null)
const formReset = ref(null)

const { makeToast } = useToastNotification()
const { imagesAdd, removeImage, image, selectedImages, imagesInput } = useImageUpload()

// Page meta
useHead({
  title: 'Update Product',
})

definePageMeta({
  layout: 'admin',
})

onMounted(() => {
  uploadedFiles.value = product.value.prodImages
  category.value = product.value.category != null ? product.value.category._id : ''
  owner.value = product.value.owner != null ? product.value.owner._id : ''
})

// eslint-disable-next-line unused-imports/no-unused-vars
function formatNames(files = selectedImages.value) {
  if (files.length === 0) {
    return 'No file chosen'
  }
  if (files.length === 1) {
    return files[0].name ? files[0].name : files[0].originalname
  }
  else {
    return `${files.length} files selected`
  }
}

async function onUpdateProduct() {
  const data = new FormData()

  for (let i = 0; i < selectedImages.value.length; i++) {
    data.append('prodImages', selectedImages.value[i])
  }

  data.append('title', product.value.title)
  data.append('price', product.value.price)
  data.append('description', product.value.description)
  data.append('stockQuantity', product.value.stockQuantity)
  data.append('ownerID', owner.value)
  data.append('categoryID', category.value)

  await $fetch(`/api/products/${route.params.id}`, {
    method: 'PUT',
    body: data,
  })

  console.log(`The product ${product.value.title} is updated successfully...`)

  router.push('/admin')
  makeToast({ type: 'product', title: product.value.title, status: 'update' })
}

// eslint-disable-next-line unused-imports/no-unused-vars
function deleteImage(img, index) {
  uploadedFiles.value.splice(index, 1)
  ;[...selectedImages.value].splice(index, 1)
}
</script>

<template>
  <main>
    <div class="container-fluid">
      <div class="row">
        <!-- <div class="col-sm-3"></div> -->
        <div class="col-md-6 offset-md-3">
          <h1 class="text-center mt-2">
            Update {{ product.title }}
          </h1>
          <nuxt-link to="/admin" type="button" class="btn mb-3 btn-outline-danger">
            Go Back
          </nuxt-link>
          <!-- <b-form @submit="onSubmit" @reset="onReset" v-if="show"> -->
          <b-form ref="productForm" class="d-flex flex-column gap-3">
            <!-- Category Selection dropdown -->
            <b-form-group label="Category:" label-for="productCategory">
              <b-form-select id="productCategory" v-model="category" class="text-capitalize" required>
                <option value="null">
                  Select Category of the product
                </option>
                <option v-for="category in categories" :key="category._id" class="text-capitalize" :value="category._id">
                  {{ category.type }}
                </option>
              </b-form-select>
            </b-form-group>

            <!-- Owner Selection dropdown -->
            <b-form-group label="Owner:" class="text-capitalize" label-for="productOwner">
              <b-form-select id="productOwner" v-model="owner" required>
                <option value="null">
                  Select Owner of the product
                </option>
                <option v-for="owner in owners" :key="owner._id" :value="owner._id">
                  {{ owner.name }}
                </option>
              </b-form-select>
            </b-form-group>

            <!-- Product title -->
            <b-form-group
              label="Title:" label-for="productTitle"
              description="Please enter Product title here"
            >
              <b-form-input
                id="productTitle" v-model="product.title" type="text" required
                placeholder="Enter product title"
              />
            </b-form-group>

            <!-- Product Description -->
            <b-form-group label="Description: " label-for="productDescription">
              <b-form-textarea
                id="productDescription" v-model="product.description"
                placeholder="Enter product description..." rows="3" max-rows="6"
              />
            </b-form-group>

            <!-- Product images -->
            <b-form-group label="Photo:" label-for="productPhoto">
              <!-- <b-form-file @change="onFileSelected($event.target.files)" :file-name-formatter="formatNames" ref="imagesInput" multiple id="productPhoto" title=" "></b-form-file> -->
              <b-form-file
                id="productPhoto" ref="imagesInput" v-model="selectedImages" multiple
                title=" " @change="imagesAdd"
              />
              <!-- <b-form-file @change="onFileSelected($event)" :file-name-formatter="formatNames" id="productPhoto"></b-form-file> -->
              <b-alert class="my-2" show variant="warning">
                Note: Uploading new images will replace the existing
                images
              </b-alert>
            </b-form-group>

            <!-- Uploaded images -->
            <b-row v-if="image.length !== 0" align-v="center" class="uploaded-files">
              <div v-for="(prodImage, index) in image" :key="index" class="img-wrapp p-2">
                <b-img thumbnail fluid :src="prodImage" />
                <!-- <i @click="deleteImage(prodImage,index)" class="delete-img fa fa-times"></i> -->
                <i class="delete-img fas fa-times-circle" @click="removeImage(index)" />
              </div>
            </b-row>
            <b-row v-else-if="uploadedFiles.length !== 0" align-v="center" class="uploaded-files">
              <div v-for="(prodImage, index) in uploadedFiles" :key="index" class="img-wrapp p-2">
                <b-img thumbnail fluid :src="prodImage.location" />
              </div>
            </b-row>
            <b-row v-else-if="product.photo !== ''" align-v="center" class="uploaded-files">
              <div class="img-wrapp p-2">
                <b-img thumbnail fluid :src="product.photo" />
              </div>
            </b-row>

            <!-- Product Price -->
            <b-form-group
              label="Price:" label-for="productPrice"
              description="Please enter Product price here"
            >
              <b-form-input
                id="productPrice" v-model="product.price" type="number" required
                placeholder="Enter product price"
              />
            </b-form-group>

            <!-- Product Stock Quantity -->
            <b-form-group
              label="Stock Quantity:" label-for="stockQuantity"
              description="Please enter Product stock quantity here"
            >
              <b-form-input
                id="stockQuantity" v-model="product.stockQuantity" type="number" required
                placeholder="Enter product stock quantity"
              />
            </b-form-group>

            <div class="d-flex gap-2">
              <b-button type="button" variant="primary" @click.prevent="onUpdateProduct">
                Update Product
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
            </div>
          </b-form>
          <b-card class="my-3" header="Form Data Result">
            <!-- <pre class="m-0">{{ product }}</pre> -->
            <!-- <pre class="m-0">{{ categories }}</pre>
            <pre class="m-0">{{ owners }}</pre> -->
            <pre class="m-0">category: {{ product.category }}</pre>
            <pre class="m-0">owner: {{ product.owner }}</pre>
            <pre class="m-0">title: {{ product.title }}</pre>
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
