<template>
  <div class="container">
    <pulse-loader class="centered" :loading="loading" :color="color" :size="size"></pulse-loader>
    <div class="row">
      <div class="col-md-6">
        <div class="form-inline">
          <label for="search-author-input" class="mr-2">Autor:</label>
          <input type="text" class="form-control" id="search-author-input" placeholder="Author name..." v-model="authorName">
          <button type="button" class="btn btn-primary btn-sm ml-2 search-author-btn" v-on:click="searchAuthor()">Search author</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import PulseLoader from 'vue-spinner/src/PulseLoader.vue';

  export default {
    components: {PulseLoader},
    name: 'Ping',
    data() {
      return {
        authorName: '',
        loading: false,
        color: 'green',
        size: '20px'
      };
    },
    methods: {
      searchAuthor() {
        const path = `${this.test_url}/get-docs-by-author`;
        this.loading = true;
        axios.post(path).then((response) => {
          this.loading = false;
          console.log(response.data);
        });
      },
    },
  };
</script>

<style>
  .centered {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
