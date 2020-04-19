<template>
  <div class="container">
    <pulse-loader class="centered" :loading="loading" :color="color" :size="size"></pulse-loader>
    <div class="alert alert-danger" v-if="showAlert">{{alertText}}</div>
    <h3>View publications for: {{authorName}}</h3>
    <div class="row">
      <div class="col">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import PulseLoader from 'vue-spinner/src/PulseLoader.vue';

  export default {
    components: { PulseLoader },
    name: 'AuthorPubications',
    data() {
      return {
        loading: true,
        color: 'green',
        size: '20px',
        showAlert: false,
        authorPublications: '',
        authorName: ''
      };
    },
    methods: {
      getAuthorPublications() {
        var authorName = this.$route.query.author_name;
        const path = `${this.test_url}/get-publications-for-author`;
        var data = {};
        data['authorName'] = authorName;
        axios.post(path, data).then((response) => {
          if(typeof response.data.error === 'undefined') {
            this.authorPublications = response.data.publications;
            this.loading = false;
          }
        });
      }
    },
    created() {
      this.authorName = this.$route.query.author_name;
      this.getAuthorPublications();
    }
  };
</script>

<style>
  .centered {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 999;
  }
  .card-img-top {
    width: 225px !important;
  }
</style>

