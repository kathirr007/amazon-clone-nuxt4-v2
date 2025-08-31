<!-- <script>
import deleteConfirmationMixin from '~/mixins/deleteConfirmation'
import imgUploadMixin from '~/mixins/imgUpload'
import infoToastMixin from '~/mixins/infoToast'
// import { mapGetters } from "vuex";
export default {
  mixins: [infoToastMixin, imgUploadMixin, deleteConfirmationMixin],
  layout: 'admin',
  transition(to, from) {
    if (!from) {
      return 'slide-left'
    }
    return 'slide-right'
  },
  async asyncData({ $axios }) {
    try {
      let res = await $axios.$get('/api/owners')
      // let owners = $axios.$get('/api/owners')

      return {
        owners: res.owners,
      }
    }
    catch (err) {
      console.log(err)
    }
  },
  data() {
    return {
      name: '',
      about: '',
      selectedFile: '',
    }
  },
  head: {
    title: 'Add a new owner',
  },
  /* computed: {
    ...mapGetters(["authUser"]),
  }, */
  methods: {
    onFileSelected(fileList) {
      // debugger
      this.selectedFile = event.target.files[0]
    },
    formatNames(files = []) {
      // this.selectedFile = files[0]
      if (files.length === 0) {
        return 'No file chosen'
      }
      if (files.length === 1) {
        return files[0].name
      }
      else {
        return `${files.length} files selected`
      }
    },
    resetOwnerForm() {
      this.name = ''
      this.about = ''
      this.selectedFile = null
    },
    async onAddOwner() {
      let data = new FormData()
      // if(this.name === '' || this.about === '')
      data.append('name', this.name)
      data.append('about', this.about)
      data.append('photo', this.images[0])

      let result = await this.$axios.$post('/api/owners', data)
      console.log(`The new owner ${this.name} is added successfully...`)

      let dataObject = {}
      data.forEach((value, key) => {
        dataObject[key] = value
      })
      // dataObject = JSON.stringify(dataObject);

      if (result.status) {
        this.owners.push(dataObject)
        this.$refs.imagesInput.reset()
        this.makeToast('owner', `${this.name}`, 'add')
        this.resetOwnerForm()
      }
      // this.$router.push('/')
    },
    async onDeleteProduct(id, index, title) {
      try {
        // let productTitle = this.products[index].title
        debugger
        let response = await this.$axios.$delete(`/api/owners/${id}`)
        // console.log(response.products)
        debugger
        this.makeToast('owner', title, 'delete')
        if (response.status) {
          this.owners.splice(index, 1)
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
import { useToastController } from 'bootstrap-vue-next'

definePageMeta({
  layout: 'admin',
  transition: (to, from) => {
    if (!from)
      return 'slide-left'
    return 'slide-right'
  },
})

useHead({
  title: 'Add a new owner',
})

const { makeToast } = useToastNotification()
const toast = useToastController()
const { imagesAdd, selectedImages, image, imagesInput } = useImageUpload()
const { confirmDeletion } = useConfirmDeletion()

const name = ref('')
const about = ref('')
const selectedFile = ref('')
// const owners = ref([])
const formReset = ref(null)
// const imagesInput = ref(null)
// const selectedImages = ref([])
// const image = ref(null)

const { data, refresh: refreshOwners } = await useAsyncData('owners', () =>
  $fetch('/api/owners'))

const owners = computed(() => data.value?.owners ?? [])

// eslint-disable-next-line unused-imports/no-unused-vars
function onFileSelected(fileList) {
  selectedFile.value = event.target.files[0]
}

function resetOwnerForm() {
  name.value = ''
  about.value = ''
  selectedFile.value = null
  image.value = []
  selectedImages.value = []
}

async function onAddOwner() {
  const data = new FormData()
  data.append('name', name.value)
  data.append('about', about.value)
  data.append('photo', selectedImages.value[0])

  try {
    const result = await $fetch('/api/owners', {
      method: 'POST',
      body: data,
    })

    const dataObject = {}
    data.forEach((value, key) => {
      dataObject[key] = value
    })

    if (result.success) {
      await refreshOwners()
      // owners.value.push(dataObject)
      imagesInput.value.reset()
      makeToast({ type: 'owner', title: name.value, status: 'add', variant: 'success' })
      resetOwnerForm()
    }
  }
  catch (error) {
    console.log(error)
    toast.create({
      title: 'Error Adding Owner',
      body: error.data.message ? error.data.message : (error.message || `There was an error adding the owner ${name.value}. Please try again.`),
      variant: 'danger',
      progressProps: {
        variant: 'danger',
      },
    })
  }
}

async function onDeleteOwner(id, index, title) {
  try {
    const response = await $fetch(`/api/owners/${id}`, {
      method: 'DELETE',
    })

    makeToast({ type: 'owner', title, status: 'delete', variant: 'danger' })
    if (response.success) {
      owners.value.splice(index, 1)
    }
  }
  catch (err) {
    console.log(err)

    const foundOwner = owners.value.find(owner => owner._id === id)

    toast.create({
      title: 'Error Deleting Owner',
      body: err.data.message ? err.data.message : (err.message || `There was an error deleting the owner ${foundOwner.name}. Please try again.`),
      variant: 'danger',
      progressProps: {
        variant: 'danger',
      },
    })
  }
}
</script>

<template>
  <main>
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-6 offset-md-3">
          <h1 class="text-center mt-2">
            Add a New Owner Form
          </h1>
          <!-- <b-form @submit="onSubmit" @reset="onReset" v-if="show"> -->
          <nuxt-link to="/admin" type="button" class="btn mb-3 btn-outline-danger">
            Go Back
          </nuxt-link>
          <b-form class="d-flex flex-column gap-3">
            <!-- Owner name -->
            <b-form-group
              label="Name:"
              label-for="ownerName"
              description="Please enter owner name here"
            >
              <b-form-input
                id="ownerName"
                v-model="name"
                type="text"
                required
                placeholder="Enter owner name"
              />
            </b-form-group>

            <!-- About Owner -->
            <b-form-group label="About: " label-for="aboutOwner">
              <b-form-textarea
                id="aboutOwner"
                v-model="about"
                placeholder="Enter details about owner"
                rows="3"
                max-rows="6"
              />
            </b-form-group>

            <!-- Owner photo -->
            <b-form-group label="Photo:" label-for="ownerPhoto">
              <client-only>
                <b-form-file
                  id="ownerPhoto"
                  ref="imagesInput"
                  accept="image/*"
                  :multiple="false"
                  type="file"
                  @update:model-value="imagesAdd($event)"
                />
              </client-only>
            </b-form-group>
            <b-row align-v="center" class="uploaded-files">
              <div
                v-for="(ownerImage, index) in image"
                :key="index"
                class="img-wrapp p-2"
              >
                <b-img thumbnail fluid :src="ownerImage" />
                <!-- <i @click="removeImage(index)" class="delete-img fas fa-times-circle"></i> -->
              </div>
            </b-row>

            <div class="d-flex gap-2">
              <b-button
                type="button"
                variant="primary"
                @click.prevent="onAddOwner"
              >
                Add Owner
              </b-button>
              <b-button ref="formReset" variant="danger">
                Reset
              </b-button>
            </div>
          </b-form>
          <b-card class="mt-3" header="Available Onwers">
            <b-list-group>
              <b-list-group-item
                v-for="(owner, index) in owners"
                :key="owner._id"
                class="text-capitalize flex gap-2"
              >
                <BAvatar :src="owner.photo" />
                {{ owner.name }}
                <b-badge
                  href="#"
                  class="float-right"
                  variant="danger"
                  @click.prevent="
                    confirmDeletion({ id: owner._id, index, title: owner.name, e: $event, deleteCallback: onDeleteOwner })
                  "
                >
                  Delete
                </b-badge>
                <nuxt-link
                  class="badge text-bg-info float-right ms-2 text-dark text-decoration-none"
                  :to="`/admin/owners/${owner._id}`"
                  variant="info"
                >
                  Update
                </nuxt-link>
              </b-list-group-item>
            </b-list-group>
          </b-card>
        </div>
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

.list-group-item {
  .badge {
    opacity: 0;
    transform: scale(1, 0);
    transform-origin: center bottom;
    // height: 0;
    transition: all 0.25s ease-in;
  }

  &:hover {
    .badge {
      opacity: 1;
      // height: auto;
      transform: scale(1, 1);
    }
  }
}
</style>
