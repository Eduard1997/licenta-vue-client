<template>
  <div>
    <pulse-loader class="centered" :loading="loading" :color="color" :size="size"></pulse-loader>
    <div class="alert alert-danger" v-if="showAlert">{{alertText}}</div>
    <div class="row">
      <div class="col">
        <table class="table table-bordered table-responsive-xl" v-if="authorPublications">
          <thead class="thead-light">
            <tr>
              <th class="text-center" >Name</th>
              <th class="text-center" >Year</th>
              <th class="text-center" style="white-space: nowrap">Scholar <br> - Cited By - </th>
              <th class="text-center" style="white-space: nowrap">Scholar <br> - Citations - </th>
              <th class="text-center" >Publication Name</th>
              <th class="text-center" >URL</th>
              <th class="text-center" style="white-space: nowrap">Scopus <br> - Cited By -</th>
              <th class="text-center" style="white-space: nowrap">Scopus <br> - Citations - </th>
              <th class="text-center" style="white-space: nowrap">Scopus <br> - URL - </th>
              <th class="text-center" style="white-space: nowrap">Scopus <br> - Aggregation Type - </th>
              <th class="text-center" style="white-space: nowrap">Scopus <br> - Subtype Description -</th>
              <th class="text-center" style="white-space: nowrap">DBLP <br> - Type -</th>
              <th class="text-center" style="white-space: nowrap">DBLP <br> - Venue -</th>
              <th class="text-center" style="white-space: nowrap">DBLP <br> - Link -</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="publication in authorPublications">
              <tr>
                <td>
                  <a href="javascript:;" v-on:click="getCitations(publication.title)">{{publication.title}}</a>
                </td>
                <td class="text-center"> <span v-if="publication.year">{{publication.year}}</span> <span v-else>-</span> </td>
                <td class="text-center"> <span v-if="typeof(publication.cited_by_scholar) !== 'undefined' && publication.cited_by_scholar">{{publication.cited_by_scholar}}</span> <span v-else>-</span> </td>
                <td class="text-center"> <span class="badge badge-warning" v-if="typeof(publication.cited_by_link_scholar) !== 'undefined' && publication.cited_by_link_scholar" @click="openUrl(publication.cited_by_link_scholar)" style="cursor: pointer">View citations</span> <span v-else>-</span> </td>
                <td class="text-center"> <span v-if="typeof(publication.publication_name) !== 'undefined' && publication.publication_name">{{publication.publication_name}}</span> <span v-else>-</span> </td>
                <td class="text-center">
                  <span class="badge badge-success" v-if="typeof(publication.eprint) !== 'undefined' && publication.eprint" @click="openUrl(publication.eprint)" style="cursor: pointer">View document</span>
                  <span class="badge badge-success" v-else-if="typeof(publication.url) !== 'undefined' && publication.url" @click="openUrl(publication.url)" style="cursor: pointer">View document</span>
                  <span v-else> - </span>
                </td>
                <td class="text-center"> <span v-if="typeof(publication.cited_by_scopus) !== 'undefined' && publication.cited_by_scopus">{{publication.cited_by_scopus}}</span> <span v-else>-</span> </td>
                <td class="text-center"> <span class="badge badge-secondary" v-if="typeof(publication.cited_by_link_scopus) !== 'undefined' && publication.cited_by_link_scopus" @click="openUrl(publication.cited_by_link_scopus)" style="cursor: pointer">View citations</span> <span v-else>-</span> </td>
                <td class="text-center"> <span class="badge badge-info" v-if="typeof(publication.scopus_link) !== 'undefined' && publication.scopus_link" @click="openUrl(publication.scopus_link)" style="cursor: pointer">View document</span> <span v-else>-</span> </td>
                <td class="text-center"> <span v-if="typeof(publication.scopus_aggregation_type) !== 'undefined' && publication.scopus_aggregation_type">{{publication.scopus_aggregation_type}}</span> <span v-else>-</span> </td>
                <td class="text-center"> <span v-if="typeof(publication.scopus_subtype_description) !== 'undefined' && publication.scopus_subtype_description">{{publication.scopus_subtype_description}}</span> <span v-else>-</span> </td>
                <td class="text-center"> <span v-if="typeof(publication.dblp_type) !== 'undefined' && publication.dblp_type">{{publication.dblp_type}}</span> <span v-else>-</span> </td>
                <td class="text-center"> <span v-if="typeof(publication.dblp_venue) !== 'undefined' && publication.dblp_venue && !Array.isArray(publication.dblp_venue)">{{publication.dblp_venue}}</span>
                  <span v-else-if="typeof(publication.dblp_venue) !== 'undefined' && publication.dblp_venue && Array.isArray(publication.dblp_venue)">
                    <template v-for="item in publication.dblp_venue">{{item}}, </template>
                  </span>
                  <span v-else>-</span>
                </td>
                <td class="text-center"> <span class="badge badge-info" v-if="typeof(publication.dblp_link) !== 'undefined' && publication.dblp_link" @click="openUrl(publication.dblp_link)" style="cursor: pointer">View document</span> <span v-else>-</span> </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
      <b-modal id="citations-modal" size="xl" :title="modalTitle" :ok-only="true">
        <div class="row text-center">
          <b-spinner variant="success" class="modal-spinner" type="grow" style="margin: auto; display: none"></b-spinner>
        </div>
        <div class="modal-content-citations">

        </div>
      </b-modal>
  </div>
</template>

<script>
  import axios from 'axios';
  import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
  import $ from 'jquery';

  export default {
    components: { PulseLoader },
    props: {'authorName': String},
    name: 'AuthorPubications',
    data() {
      return {
        loading: true,
        color: 'green',
        size: '20px',
        showAlert: false,
        authorPublications: '',
        authorName: '',
        modalTitle: '',
        citationsArray: {}
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
      openUrl(url) {
        window.open(url)
      },
      getCitations(publicationName) {
        this.$root.$emit("bv::show::modal", "citations-modal");
        this.modalTitle = 'Citations for: ' + publicationName;
        $('.modal-content-citations').empty();
        $('.modal-spinner').show();

        if(typeof this.citationsArray[publicationName] === 'undefined') {
          const path = `${this.test_url}/get-citations-for-publication`;
          var data = {};
          data['publicationName'] = publicationName;
          data['authorName'] = this.authorName;
          axios.post(path, data).then((response) => {
            $('.modal-spinner').hide();
            if(typeof response.data.message !== 'undefined') {
              var alertHtml = '<div class="alert alert-danger">' + response.data.message + '</div>';
              $('.modal-content-citations').append(alertHtml);
              this.citationsArray[publicationName] = response.data.message;
            } else {
              $.each(response.data, function(key, value) {
                var title = value['title'];
                var link = value['link'];
                var HTML = '<div><a href="' + link + '">' + title + '</a></div>';
                $('.modal-content-citations').append(HTML);
              });
              this.citationsArray[publicationName] = response.data;
            }
          });
        } else {
          $('.modal-spinner').hide();
          if(typeof this.citationsArray[publicationName] === 'object') {
            $.each(this.citationsArray[publicationName], function(key, value) {
              var title = value['title'];
              var link = value['link'];
              var HTML = '<div><a href="' + link + '">' + title + '</a></div>';
              $('.modal-content-citations').append(HTML);
            });
          } else {
            var alertHtml = '<div class="alert alert-danger">' + this.citationsArray[publicationName] + '</div>';
            $('.modal-content-citations').append(alertHtml);
          }
        }
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
  table {
    font-size: 13px;
  }
</style>

