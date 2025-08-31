<!-- <script>
import { mapGetters } from 'vuex'
import deleteConfirmationMixin from '~/mixins/deleteConfirmation'
import infoToastMixin from '~/mixins/infoToast'

export default {
  mixins: [infoToastMixin, deleteConfirmationMixin],
  layout: 'admin',
  async asyncData({ $axios }) {
    try {
      let res = await $axios.$get('/api/categories')
      // let owners = $axios.$get('/api/owners')

      return {
        categories: res.categories,
      }
    }
    catch (err) {
      console.log(err)
    }
  },
  data() {
    return {
      categoryType: '',
    }
  },
  head: {
    title: 'Add a new category',
  },
  comoputed: {
    ...mapGetters(['authUser']),
  },
  methods: {
    resetCategoryForm() {
      this.categoryType = ''
    },
    async onAddCategory() {
      let data = { type: this.categoryType }

      let result = await this.$axios.$post('/api/categories', data)
      console.log(
        `The new category ${this.categoryType} is added successfully...`,
      )

      if (result.status) {
        data._id = result.catAdded._id
        console.log(result.catAdded)
        this.categories.push(data)
      }
      this.makeToast('category', data.type, 'add')
      this.resetCategoryForm()
      // this.$router.push('/')
    },
    /* makeToast(append = false) {
        // Use a shorter name for this.$createElement
        const h = this.$createElement
        // Increment the toast count
        // Create the message
        const vNodesMsg = h(
          'p',
          { class: ['text-center', 'mb-2'] },
          [
            h('b-spinner', { props: { type: 'grow', small: true } }),
            'The new category ',
            h('strong', `${this.categoryType}`),
            ' is added successfully... ',
            h('b-spinner', { props: { type: 'grow', small: true } })
          ],
        )
        this.$bvToast.toast(vNodesMsg, {
          title: 'Add Category Status',
          autoHideDelay: 5000,
          appendToast: append,
          variant: 'info'
        })
      }, */
    async onDeleteProduct(id, index, title) {
      try {
        // let productTitle = this.products[index].title
        // debugger
        let response = await this.$axios.$delete(`/api/categories/${id}`)
        // console.log(response.products)
        this.makeToast('category', title, 'delete')
        if (response.status) {
          this.categories.splice(index, 1)
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
// Mixins need to be refactored for Composition API
const { makeToast } = useToastNotification()
const { confirmDeletion } = useConfirmDeletion()

definePageMeta({
  layout: 'admin',
})

useHead({
  title: 'Add a new category',
})

const categoryType = ref('')
const formReset = ref(null)

// Get initial categories data
const { data, refresh: refreshCategories } = await useAsyncData('categories', () =>
  $fetch('/api/categories'))

const categories = computed(() => data.value.categories ?? [])

// Methods
function resetCategoryForm() {
  categoryType.value = ''
}

async function onAddCategory() {
  const data = { type: categoryType.value }

  const result = await $fetch('/api/categories', {
    method: 'POST',
    body: data,
  })

  console.log(`The new category ${categoryType.value} is added successfully...`)

  if (result.status) {
    console.log(result.catAdded)
    await refreshCategories()
  }

  makeToast({ type: 'category', title: data.type, status: 'add' })
  resetCategoryForm()
}

async function onDeleteCategory(id, index, title) {
  try {
    const response = await $fetch(`/api/categories`, {
      method: 'DELETE',
      body: { id },
    })

    makeToast({ type: 'category', title, status: 'delete', variant: 'danger' })
    if (response.status) {
      await refreshCategories()
    }
  }
  catch (err) {
    console.log(err)
  }
}
</script>

<template>
  <main>
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-6 offset-md-3">
          <h1 class="text-center mt-2">
            Add a New Category Form
          </h1>
          <nuxt-link to="/admin" type="button" class="btn mb-3 btn-outline-danger">
            Go Back
          </nuxt-link>
          <!-- <b-form @submit="onSubmit" @reset="onReset" v-if="show"> -->
          <b-form class="d-flex flex-column gap-3">
            <!-- Category Type -->
            <b-form-group
              label="Type:"
              label-for="categoryType"
              description="Please enter Category type here"
            >
              <b-form-input
                id="categoryType"
                v-model="categoryType"
                type="text"
                required
                placeholder="Enter category type"
                @keydown.enter.prevent="onAddCategory"
              />
            </b-form-group>

            <div class="d-flex gap-2">
              <b-button
                type="button"
                variant="primary"
                @click.prevent="onAddCategory"
              >
                Add Category
              </b-button>
              <b-button ref="formReset" variant="danger">
                Reset
              </b-button>
            </div>
          </b-form>
          <b-card class="my-3" header="Available Categories">
            <b-list-group class="categories-list">
              <b-list-group-item
                v-for="(category, index) in categories"
                :key="category._id"
                class="text-capitalize"
              >
                {{ category.type }}
                <span class="tags float-right">
                  <!-- <nuxt-link class="badge badge-primary" :to="`/admin/category/${category._id}`" variant="info">Update</nuxt-link> -->
                  <!-- <span class="tag is-info">Update</span> -->
                  <span
                    class="badge text-bg-danger text-white"
                    @click="
                      confirmDeletion(
                        { id: category._id,
                          index,
                          title: category.type,
                          e: $event,
                          deleteCallback: onDeleteCategory },
                      )
                    "
                  >
                    Delete
                  </span>
                </span>
              </b-list-group-item>
            </b-list-group>
          </b-card>
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.categories-list .list-group-item {
  .badge {
    opacity: 0;
    transform: scale(1, 0);
    transform-origin: center bottom;
    // height: 0;
    cursor: pointer;
    transition: all 0.25s ease-in;
  }

  &:hover {
    .badge {
      opacity: 1;
      text-decoration: none;
      // height: auto;
      transform: scale(1, 1);
    }
  }
}
</style>
