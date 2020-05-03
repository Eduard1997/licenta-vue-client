<template>
  <div>
    <pulse-loader class="centered" :loading="loading" :color="color" :size="size"></pulse-loader>
    <div class="alert alert-danger" v-if="showAlert">{{alertText}}</div>
    <div class="row">
      <div class="col">
        <table class="table table-bordered table-responsive-xl" v-if="authorPublications">
          <thead class="thead-light">
            <tr>
              <th class="text-center">Name</th>
              <th class="text-center">Year</th>
              <th class="text-center">Cited No</th>
              <th class="text-center">Scopus Cited By Link</th>
              <th class="text-center">Eprint</th>
              <th class="text-center">Scopus Link</th>
              <th class="text-center">Aggregation Type</th>
              <th class="text-center">Subtype Description</th>
              <th class="text-center">DBLP Link</th>
              <th class="text-center">DBLP Type</th>
              <th class="text-center">DBLP Venue</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="publication in authorPublications">
              <tr>
                <td>{{publication.title}}</td>
                <td class="text-center"> <span v-if="publication.year">{{publication.year}}</span> <span v-else>-</span> </td>
                <td class="text-center"> <span v-if="typeof(publication.cited_by !== 'undefined') && publication.cited_by">{{publication.cited_by}}</span> <span v-else>-</span> </td>
                <td class="text-center"> <span v-if="typeof(publication.cited_by_link) !== 'undefined'" class="badge badge-pill badge-primary" style="cursor: pointer" @click="openUrl(publication.cited_by_link)">Open citations</span> <span v-else>-</span> </td>
                <td class="text-center"> <span v-if="publication.eprint" class="badge badge-pill badge-success" style="cursor: pointer" @click="openUrl(publication.eprint)">View eprint</span> <span v-else>-</span> </td>
                <td class="text-center"> <span v-if="typeof(publication.scopus_link) !== 'undefined'" class="badge badge-pill badge-info" style="cursor: pointer" @click="openUrl(publication.scopus_link)">View scopus url</span> <span v-else>-</span> </td>
                <td class="text-center"> <span v-if="typeof(publication.aggregation_type !== 'undefined') && publication.aggregation_type">{{publication.aggregation_type}}</span> <span v-else>-</span> </td>
                <td class="text-center"> <span v-if="typeof(publication.subtype_description !== 'undefined') && publication.subtype_description">{{publication.subtype_description}}</span> <span v-else>-</span> </td>
                <td class="text-center"> <span v-if="typeof(publication.dblp_link !== 'undefined') && publication.dblp_link" class="badge badge-pill badge-primary" style="cursor: pointer" @click="openUrl(publication.dblp_link)">View DBLP Link</span> <span v-else>-</span> </td>
                <td class="text-center"> <span v-if="typeof(publication.dblp_type !== 'undefined') && publication.dblp_type">{{publication.dblp_type}}</span> <span v-else>-</span> </td>
                <td class="text-center"> <span v-if="typeof(publication.dblp_venue !== 'undefined') && publication.dblp_venue">{{publication.dblp_venue}}</span> <span v-else>-</span> </td>
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
    props: ['authorName'],
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
        const path = `${this.test_url}/get-publications-for-author`;
        var data = {};
        data['authorName'] = this.authorName;
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

