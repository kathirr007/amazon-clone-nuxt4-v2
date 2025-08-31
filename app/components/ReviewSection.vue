<script setup>
defineProps({
  product: {
    type: Object,
    required: true,
  },
  reviews: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <div>
    <hr>
    <div class="reviewsMedley">
      <div class="row">
        <div class="col-lg-4 col-md-5 col-sm-12">
          <!-- Total Customer reviews -->
          <a href="#" class="a-color-base">
            <h2>
              {{ product.reviews.length }}
              customer reviews
            </h2>
          </a>
          <div class="cr-widget-ACR">
            <span>
              <a href="#">
                <div class="d-flex align-items-center gap-2">
                  <NuxtRating
                    :read-only="true"
                    border-color="#db8403"
                    active-color="#ffa41c"
                    inactive-color="#fff"
                    :rating-step="0.5"
                    :rounded-corners="true"
                    :border-width="5"
                    :rating-size="14"
                    :rating-value="product.averageRating"
                  />
                  <span>{{ product.averageRating }} out of 5 stars</span>
                </div>
              </a>
            </span>
          </div>
          <div class="cr-widget-histogram">
            <div class="row a-histogrm-row">
              <div class="col-md-2 col-sm-2 col-2 pr-0">
                <div class="aok-nowrap">
                  <a href="#" class="d-flex align-items-center gap-2 text-decoration-none">
                    5
                    <i class="fas fa-star" />
                  </a>
                  <span class="a-letter-space" />
                </div>
              </div>
              <div class="col-md-8 col-sm-8 col-8 pr-0">
                <div>
                  <a href="#" aria-label="5 star reviews">
                    <div class="a-meter 5star">
                      <div class="a-meter-bar a-meter-filled" style="width: 64%;" />
                    </div>
                  </a>
                </div>
              </div>
              <div class="col-md-2 col-sm-2 col-2 pr-0">
                <div class="aok-nowrap text-right">
                  <a href="#">64%</a>
                  <span class="a-letter-space" />
                </div>
              </div>
            </div>
            <div class="row a-histogrm-row" style="margin-top: -15px;">
              <div class="col-md-2 col-sm-2 col-2 pr-0">
                <div class="aok-nowrap">
                  <a href="#" class="d-flex align-items-center gap-2 text-decoration-none">
                    4
                    <i class="fas fa-star" />
                  </a>
                  <span class="a-letter-space" />
                </div>
              </div>
              <div class="col-md-8 col-sm-8 col-8 pr-0">
                <div>
                  <a href="#" aria-label="4 star reviews">
                    <div class="a-meter 5star">
                      <div class="a-meter-bar a-meter-filled" style="width: 14%;" />
                    </div>
                  </a>
                </div>
              </div>
              <div class="col-md-2 col-sm-2 col-2 pr-0">
                <div class="aok-nowrap text-right">
                  <a href="#">14%</a>
                  <span class="a-letter-space" />
                </div>
              </div>
            </div>
            <div class="row a-histogrm-row" style="margin-top: -15px;">
              <div class="col-md-2 col-sm-2 col-2 pr-0">
                <div class="aok-nowrap">
                  <a href="#" class="d-flex align-items-center gap-2 text-decoration-none">
                    3
                    <i class="fas fa-star" />
                  </a>
                  <span class="a-letter-space" />
                </div>
              </div>
              <div class="col-md-8 col-sm-8 col-8 pr-0">
                <div>
                  <a href="#" aria-label="3 star reviews">
                    <div class="a-meter 5star">
                      <div class="a-meter-bar a-meter-filled" style="width: 4%;" />
                    </div>
                  </a>
                </div>
              </div>
              <div class="col-md-2 col-sm-2 col-2 pr-0">
                <div class="aok-nowrap text-right">
                  <a href="#">4%</a>
                  <span class="a-letter-space" />
                </div>
              </div>
            </div>
            <div class="row a-histogrm-row" style="margin-top: -15px;">
              <div class="col-md-2 col-sm-2 col-2 pr-0">
                <div class="aok-nowrap">
                  <a href="#" class="d-flex align-items-center gap-2 text-decoration-none">
                    2
                    <i class="fas fa-star" />
                  </a>
                  <span class="a-letter-space" />
                </div>
              </div>
              <div class="col-md-8 col-sm-8 col-8 pr-0">
                <div>
                  <a href="#" aria-label="2 star reviews">
                    <div class="a-meter 5star">
                      <div class="a-meter-bar a-meter-filled" style="width: 0%;" />
                    </div>
                  </a>
                </div>
              </div>
              <div class="col-md-2 col-sm-2 col-2 pr-0">
                <div class="aok-nowrap text-right">
                  <a href="#">0%</a>
                  <span class="a-letter-space" />
                </div>
              </div>
            </div>
            <div class="row a-histogrm-row" style="margin-top: -15px;">
              <div class="col-md-2 col-sm-2 col-2 pr-0">
                <div class="aok-nowrap">
                  <a href="#" class="d-flex align-items-center gap-2 text-decoration-none">
                    1
                    <i class="fas fa-star" />
                  </a>
                  <span class="a-letter-space" />
                </div>
              </div>
              <div class="col-md-8 col-sm-8 col-8 pr-0">
                <div>
                  <a href="#" aria-label="1 star reviews">
                    <div class="a-meter 5star">
                      <div class="a-meter-bar a-meter-filled" style="width: 4%;" />
                    </div>
                  </a>
                </div>
              </div>
              <div class="col-md-2 col-sm-2 col-2 pr-0">
                <div class="aok-nowrap text-right">
                  <a href="#">4%</a>
                  <span class="a-letter-space" />
                </div>
              </div>
            </div>
          </div>
          <div class="clearfix">
            <div class="float-left">
              <hr class="a-spacing-large">
            </div>
          </div>
          <h3 class="a-spacing-micro">
            Review this product
          </h3>
          <div class="a-row a-spacing-large">
            Share your thoughts with other customers
          </div>
          <div class="a-row">
            <!-- Link to another Review page -->
            <span class="a-button-base writeReviewButton cm-cr-button-wide">
              <span class="a-button-inner">
                <nuxt-link
                  :to="`/reviews/${product._id}`"
                  class="a-button-text"
                >Write a customer review</nuxt-link>
              </span>
            </span>
          </div>
          <div class="clearfix">
            <div class="float-left">
              <hr class="mt-4 a-spacing-large">
            </div>
          </div>
        </div>
        <div class="col-lg-6 col-md-7 col-sm-12">
          <div class="reviews-image-gallery">
            <h3>Customer images</h3>
            <!-- Review Images -->
            <div class="a-spacing-small a-spacing-top-small">
              <template v-for="review in reviews" :key="review._id">
                <img
                  v-if="Boolean(review.photo) && !review.photo.includes('undefined')"
                  alt=""
                  class="img-fluid"
                  width="22.5%"
                  :src="review.photo"
                >
              </template>
            </div>
            <div>
              <a href="#">See all customer images</a>
            </div>
          </div>
          <div class="cr-lighthut">
            <h3>Read reviews that mention</h3>
            <div class="cr-lighthouse-terms">
              <span class="cr-lighthouse-span">
                <a href="#">
                  <span class="cr-lighthouse-term">jeff bezos</span>
                </a>
              </span>
              <span class="cr-lighthouse-span">
                <a href="#">
                  <span class="cr-lighthouse-term">everything store</span>
                </a>
              </span>
              <span class="cr-lighthouse-span">
                <a href="#">
                  <span class="cr-lighthouse-term">brad stone</span>
                </a>
              </span>
              <br>
              <span class="cr-lighthouse-span">
                <a href="#">
                  <span class="cr-lighthouse-term">steve jobs</span>
                </a>
              </span>
              <span class="cr-lighthouse-span">
                <a href="#">
                  <span class="cr-lighthouse-term">well written</span>
                </a>
              </span>
              <span class="cr-lighthouse-span">
                <a href="#">
                  <span class="cr-lighthouse-term">great read</span>
                </a>
              </span>
              <br>
              <span class="cr-lighthouse-span">
                <a href="#">
                  <span class="cr-lighthouse-term">must read</span>
                </a>
              </span>
              <span class="cr-lighthouse-span">
                <a href="#">
                  <span class="cr-lighthouse-term">great book</span>
                </a>
              </span>
              <span class="cr-lighthouse-span">
                <a href="#">
                  <span class="cr-lighthouse-term">highly recomended</span>
                </a>
              </span>
              <br>
              <span class="cr-lighthouse-span">
                <a href="#">
                  <span class="cr-lighthouse-term">well searched</span>
                </a>
              </span>
              <span class="cr-lighthouse-span">
                <a href="#">
                  <span class="cr-lighthouse-term">long term</span>
                </a>
              </span>
              <span class="cr-lighthouse-span">
                <a href="#">
                  <span class="cr-lighthouse-term">barnes and noble</span>
                </a>
              </span>
              <span class="cr-lighthouse-span">
                <a href="#">
                  <span class="cr-lighthouse-term">sam walton</span>
                </a>
              </span>
            </div>
          </div>
          <div class="cr-widget-focalreviews">
            <div class="card-padding">
              <div class="review-header">
                <h3>
                  <span class="a-size-base">
                    Showing 1-8 of
                    {{ product.reviews.length }}
                    reviews
                  </span>
                </h3>
              </div>
              <div class="review-sort-type">
                <span class="a-dropdown-container">
                  <span class="a-button a-button-dropdown">
                    <span class="a-button-inner">
                      <span class="a-button-text">
                        <span class="a-dropdown-prompt">Top Reviews</span>
                      </span>
                      <i class="a-icon a-icon-dropdown" />
                    </span>
                  </span>
                </span>
              </div>

              <!-- Reviews -->
              <div v-for="review in reviews" :key="review._id" class="review-body">
                <div class="genome-widget">
                  <a href="#">
                    <div class="profile-avatar">
                      <img
                        alt=""
                        src="https://images-na.ssl-images-amazon.com/images/S/amazon-avatars-global/default._CR0,0,1024,1024_SX48_.png"
                      >
                    </div>
                    <!-- Review Owner -->
                    <div class="profile-content">
                      <span class="a-profile-name">{{ review.user.name }}</span>
                    </div>
                  </a>
                </div>
                <div class="a-row d-flex justify-content-between">
                  <!-- Review Star -->
                  <div class="d-flex align-items-center">
                    <a href="#">
                      <NuxtRating
                        :read-only="true"
                        border-color="#db8403"
                        active-color="#ffa41c"
                        inactive-color="#fff"
                        :rating-step="0.5"
                        :rounded-corners="true"
                        :border-width="5"
                        :rating-size="10"
                        :rating-value="review.rating"
                      />
                    </a>
                    <span class="a-letter-space" />
                    <!-- Review Headline -->
                    <a href="#" class="review-title">{{ review.headline }}</a>
                  </div>
                  <span class="review-date float-right">June 28, 2016</span>
                </div>
                <div class="review-data mt-2">
                  <span class="a-color-secondary">Format: Hardcover</span>
                  <div
                    style="width: 1px !important; height: 15px !important; background-color: #ddd; display: inline-block; margin: 0px 5px -3px 5px;"
                  />
                  <span class="avp-badge a-color-state">Verified Purchase</span>
                </div>
                <!-- Review Body -->
                <div class="review-body">
                  <span>{{ review.body }}</span>
                </div>
                <div class="review-comments">
                  <div class="a-spacing-small">
                    <span class="a-size-base a-color-tertiary">60 people found this helpful</span>
                  </div>
                  <div class="cr-helpful-button">
                    <span class="a-button-base">
                      <span class="a-button-inner">
                        <a href="#" class="a-button-text">
                          <div class="cr-helpful-text">Helpful</div>
                        </a>
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              <!-- Reviews -->
            </div>
          </div>
          <div class="review-footer">
            <div class="a-row">
              <span id="a-autoid-15" class="a-button a-button-base writeReviewButton">
                <span class="a-button-inner">
                  <nuxt-link
                    :to="`/reviews/${product._id}`"
                    class="a-button-text"
                    role="button"
                  >Write a customer review</nuxt-link>
                </span>
              </span>
            </div>
          </div>
        </div>
        <div class="col-lg-2 col-md-0 col-sm-0" />
      </div>
    </div>
  </div>
</template>
