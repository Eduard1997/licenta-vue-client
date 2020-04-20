<template>
  <div class="container-fluid">
    <pulse-loader class="centered" :loading="loading" :color="color" :size="size"></pulse-loader>
    <div class="alert alert-danger" v-if="showAlert">{{alertText}}</div>
    <div class="row">
      <div class="col">
        <h3>View publications for: {{authorName}}</h3>
      </div>
      <div class="col text-right">
        <button type="button" class="btn btn-sm btn-primary" @click="backToSearch()">Back to search</button>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <table class="table table-bordered table-responsive-xl" v-if="authorPublications">
          <thead class="thead-light">
            <tr>
              <th class="text-center">Name</th>
              <th class="text-center">Scopus Cited No</th>
              <th class="text-center">Scopus Cited By Link</th>
              <th class="text-center">Year</th>
              <th class="text-center">URL</th>
              <th class="text-center">Eprint</th>
              <th class="text-center">Scopus Link</th>
              <th class="text-center">Aggregation Type</th>
              <th class="text-center">Publication Name</th>
              <th class="text-center">Subtype Description</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="publication in authorPublications">
              <tr>
                <td>{{publication.title}}</td>
                <td class="text-center"> <span v-if="typeof(publication.cited_by !== 'undefined') && publication.cited_by">{{publication.cited_by}}</span> <span v-else>-</span> </td>
                <td class="text-center"> <span v-if="typeof(publication.cited_by_link) !== 'undefined'" class="badge badge-pill badge-primary" style="cursor: pointer" @click="openUrl(publication.cited_by_link)">Open citations</span> <span v-else>-</span> </td>
                <td class="text-center"> <span v-if="publication.year">{{publication.year}}</span> <span v-else>-</span> </td>
                <td class="text-center"> <span v-if="publication.url" class="badge badge-pill badge-warning" style="cursor: pointer" @click="openUrl(publication.url)">View publication</span> <span v-else>-</span> </td>
                <td class="text-center"> <span v-if="publication.eprint" class="badge badge-pill badge-success" style="cursor: pointer" @click="openUrl(publication.eprint)">View eprint</span> <span v-else>-</span> </td>
                <td class="text-center"> <span v-if="typeof(publication.scopus_link) !== 'undefined'" class="badge badge-pill badge-info" style="cursor: pointer" @click="openUrl(publication.scopus_link)">View scopus url</span> <span v-else>-</span> </td>
                <td class="text-center"> <span v-if="typeof(publication.aggregation_type !== 'undefined') && publication.aggregation_type">{{publication.aggregation_type}}</span> <span v-else>-</span> </td>
                <td class="text-center"> <span v-if="typeof(publication.publication_name !== 'undefined') && publication.publication_name">{{publication.publication_name}}</span> <span v-else>-</span> </td>
                <td class="text-center"> <span v-if="typeof(publication.subtype_description !== 'undefined') && publication.subtype_description">{{publication.subtype_description}}</span> <span v-else>-</span> </td>
              </tr>
            </template>
          </tbody>
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
      },
      backToSearch() {
        this.$router.push({name: 'SearchData'})
      },
      openUrl(url) {
        window.open(url)
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
  th,td {
    vertical-align: middle !important;
  }
</style>

