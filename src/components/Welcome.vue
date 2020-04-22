<template>
  <div class="container">
    <div class="row mb-2" style="text-align: center">
      <div class="col">
        <h3>Search for authors research publications</h3>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <button class="btn btn-primary" @click="goToAuthors()">Search for an author</button>
      </div>
      <div class="col">
        <button class="btn btn-warning ">Search for a publication</button>
      </div>
      <div class="col">
        <button class="btn btn-success ">Search a specific keyword</button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'welcome',
    data() {
      return {};
    },
    methods: {
      goToAuthors() {
        this.$router.push({name: 'SearchData'})
      }
    }
  };
</script>
