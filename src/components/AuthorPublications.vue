<template>
  <div>
    <pulse-loader class="centered" :loading="loading" :color="color" :size="size"></pulse-loader>
    <div class="alert alert-danger" v-if="showAlert">{{alertText}}</div>
    <div class="row">
      <div class="col">
        <table class="table table-bordered table-responsive-xl table-hover" v-if="authorPublications">
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
              <th class="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="publication in authorPublications">
              <tr>
                <td>
                  <a href="javascript:;" v-on:click="getCitations(publication.title)" v-b-tooltip.hover title="View document citations">{{publication.title}}</a>
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
                <td align="center">
                  <i class="fa fa-trash delete-icon" v-on:click="deletePublication(publication.title)" v-b-tooltip.hover title="Delete document"></i>
                  <i class="fa fa-edit edit-icon ml-2" v-on:click="editPublication(publication.title)" v-b-tooltip.hover title="Edit document"></i>
                </td>
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
    <b-modal id="edit-publication-modal" size="xl" :title="editModalTitle" :ok-title="'Save'" ok-variant="success" cancel-variant="danger" @ok="saveEditData()">
      <b-input-group>
        <template v-slot:prepend>
          <b-input-group-text class="edit-input-text">Title</b-input-group-text>
        </template>
        <b-form-input v-model="editTitle"></b-form-input>
      </b-input-group>

      <b-input-group class="mt-2">
        <template v-slot:prepend>
          <b-input-group-text class="edit-input-text">Publication</b-input-group-text>
        </template>
        <b-form-input v-model="editPublicationText"></b-form-input>
      </b-input-group>

      <b-input-group class="mt-2">
        <template v-slot:prepend>
          <b-input-group-text class="edit-input-text">URL</b-input-group-text>
        </template>
        <b-form-input v-model="editModalUrl"></b-form-input>
      </b-input-group>

      <b-input-group class="mt-2">
        <template v-slot:prepend>
          <b-input-group-text class="edit-input-text">Scopus Aggregation Type</b-input-group-text>
        </template>
        <b-form-input v-model="editScopusAggregation"></b-form-input>
      </b-input-group>

      <b-input-group class="mt-2">
        <template v-slot:prepend>
          <b-input-group-text class="edit-input-text">Scopus Subtype Description</b-input-group-text>
        </template>
        <b-form-input v-model="editScopusDescription"></b-form-input>
      </b-input-group>

      <b-input-group class="mt-2">
        <template v-slot:prepend>
          <b-input-group-text class="edit-input-text">DBLP Type</b-input-group-text>
        </template>
        <b-form-input v-model="editDBLPType"></b-form-input>
      </b-input-group>

      <b-input-group class="mt-2">
        <template v-slot:prepend>
          <b-input-group-text class="edit-input-text">DBLP Venue</b-input-group-text>
        </template>
        <b-form-input v-model="editDBLPVenue"></b-form-input>
      </b-input-group>
    </b-modal>
  </div>
</template>

<script>
  import axios from 'axios';
  import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
  import $ from 'jquery';

  export default {
    components: { PulseLoader},
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
        editModalTitle: '',
        editTitle: '',
        editPublicationText: '',
        editModalUrl: '',
        editScopusAggregation:'',
        editScopusDescription:'',
        editDBLPType: '',
        editDBLPVenue: '',
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
      },
      deletePublication(publicationName) {
        this.$swal({
          title: 'Are you sure?',
          text: publicationName,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
          if(result.value === true) {
            this.confirmDeletion(publicationName);
          }
        });
      },
      confirmDeletion(publicationName) {
        delete this.authorPublications[publicationName];
        this.$forceUpdate();
      },
      editPublication(publicationName) {
        this.editModalTitle = publicationName;
        this.editTitle = publicationName;
        this.editPublicationText = this.authorPublications[publicationName]['publication_name'];
        this.editModalUrl = this.authorPublications[publicationName]['url'];
        this.editScopusAggregation = this.authorPublications[publicationName]['aggregation_type_scopus'] !== 'undefined' ? this.authorPublications[publicationName]['aggregation_type_scopus'] : '-';
        this.editScopusDescription = typeof this.authorPublications[publicationName]['subtype_description_scopus'] !== 'undefined' ? this.authorPublications[publicationName]['subtype_description_scopus'] : '-';
        this.editDBLPType = typeof this.authorPublications[publicationName]['dblp_type'] !== 'undefined' ? this.authorPublications[publicationName]['dblp_type'] : '-';
        this.editDBLPVenue = typeof this.authorPublications[publicationName]['dblp_venue'] !== 'undefined' ? this.authorPublications[publicationName]['dblp_venue'] : '-';
        this.$root.$emit("bv::show::modal", "edit-publication-modal");
      },
      saveEditData() {
        let newPublicationName = this.editTitle.charAt(0).toUpperCase() + this.editTitle.slice(1);
        let oldPublicationName = this.editModalTitle;
        this.authorPublications[oldPublicationName]['title'] = newPublicationName;
        this.authorPublications[oldPublicationName]['publication_name'] = this.editPublicationText;
        this.authorPublications[oldPublicationName]['url'] = this.editModalUrl;
        this.authorPublications[oldPublicationName]['aggregation_type_scopus'] = this.editScopusAggregation;
        this.authorPublications[oldPublicationName]['subtype_description_scopus'] = this.editScopusDescription;
        this.authorPublications[oldPublicationName]['dblp_type'] = this.editDBLPType;
        this.authorPublications[oldPublicationName]['dblp_venue'] = this.editDBLPVenue;
        Object.defineProperty(this.authorPublications, newPublicationName, Object.getOwnPropertyDescriptor(this.authorPublications, oldPublicationName));
        delete this.authorPublications[oldPublicationName];
        this.authorPublications = this.orderKeys(this.authorPublications);
        var index = Object.keys(this.authorPublications).indexOf(newPublicationName);
        $('tr').eq(index+1).addClass('table-success');
        $('tr').eq(index+1).attr('id', 'scroll-to');
        window.location.href = '#scroll-to';
        setTimeout(function() {
          $('tr').eq(index+1).removeClass('table-success');
          $('tr').eq(index+1).removeAttr('id');
        }, 3000);
      },
      orderKeys(obj) {
        var keys = Object.keys(obj).sort(function keyOrder(k1, k2) {
          if (k1 < k2) return -1;
          else if (k1 > k2) return +1;
          else return 0;
        });

        var i, after = {};
        for (i = 0; i < keys.length; i++) {
          after[keys[i]] = obj[keys[i]];
          delete obj[keys[i]];
        }

        for (i = 0; i < keys.length; i++) {
          obj[keys[i]] = after[keys[i]];
        }
        return obj;
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
  .delete-icon {
    color: red;
    font-size: 21px;
    cursor: pointer;
  }
  .edit-icon {
    color: dodgerblue;
    font-size: 21px;
    cursor: pointer;
  }
  .edit-input-text {
    font-weight: 600;
  }
  .success-border {
    box-shadow: 0 0 0 3px green;
  }
</style>

