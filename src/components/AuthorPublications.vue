<template>
  <div>
    <pulse-loader class="centered" :loading="loading" :color="color" :size="size"></pulse-loader>
    <div class="alert alert-danger" v-if="showAlert">{{alertText}}</div>
    <div class="row">
      <div class="col">
        <div class="form-inline">
          <button class="btn btn-sm btn-success mb-2" v-on:click="showSearchPubModal()">Search for
            other publications
          </button>
          <button class="btn btn-sm btn-info mb-2 ml-2" v-on:click="exportData()">Export data
          </button>
          <button class="btn btn-sm btn-info mb-2 ml-2" v-on:click="exportFilteredData()">Export filtered data</button>
          <input id="search-table" class="form-control mb-2 ml-2" placeholder="Search title..."
                 v-model="searchedTitle" v-on:keyup.enter="searchTable()"/>
          <button type="button" id="search-title-btn" class="btn btn-sm btn-dark mb-2 ml-2"
                  @click="searchTable()">Search title
          </button>
          <button type="button" id="reset-table-btn" class="btn btn-sm btn-warning mb-2 ml-2"
                  @click="resetTable()">Show all rows
          </button>
        </div>

        <table class="table table-bordered table-responsive-xl table-hover"
               v-if="authorPublications">
          <thead class="thead-light">
          <tr>
            <th class="text-center"><a href="javascript:;" @click="nameOrder()"
                                       title="Order by title" v-b-tooltip.hover>Name</a></th>
            <th class="text-center">
              <a href="javascript:;" @click="yearOrder()" title="Order by year" v-b-tooltip.hover>Year</a>
            </th>
            <th class="text-center">Authors</th>
            <th class="text-center">Publication Name</th>
            <th class="text-center" style="white-space: nowrap">Scholar <br> - Cited By -</th>
            <th class="text-center" style="white-space: nowrap">Scholar <br> - Citations -</th>
            <th class="text-center" style="white-space: nowrap">Scopus <br> - Cited By -</th>
            <th class="text-center" style="white-space: nowrap">Scopus <br> - Citations -</th>
            <th class="text-center" style="white-space: nowrap">Scopus <br> - URL -</th>
            <th class="text-center" style="white-space: nowrap">Scopus <br> - Aggregation Type -
            </th>
            <th class="text-center" style="white-space: nowrap">Scopus <br> - Subtype Description -
            </th>
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
                <a v-b-tooltip.hover
                   href="javascript:;"
                   v-if="typeof(publication.eprint) !== 'undefined' && publication.eprint && publication.eprint !== '-'"
                   @click="openUrl(publication.eprint)"
                   style="cursor: pointer"
                   title="View document">{{publication.title}}</a>
                <a v-b-tooltip.hover
                   href="javascript:;"
                   v-else-if="typeof(publication.url) !== 'undefined' && publication.url"
                   @click="openUrl(publication.url)"
                   title="View document"
                   style="cursor: pointer">{{publication.title}}</a>
                <a v-b-tooltip.hover
                   href="javascript:;"
                   title="View document"
                   v-else
                   @click="documentNotAvailable()" style="cursor: pointer">{{publication.title}}</a>
              </td>
              <td class="text-center">
                  <b-form-radio v-b-tooltip.hover title="Show publications only for this year" v-if="publication.year" name="year-radios" :value="publication.year" v-on:change="yearChanged()">
                    <span v-if="publication.year">{{publication.year}}</span>
                  </b-form-radio>
                <span v-else>-</span>
              </td>
              <td class="text-center">
                <b-form-radio v-b-tooltip.hover title="Show publications wrote by those authors" name="authors-radios" :value="publication.authors" v-on:change="authorsChanged()">
                  <span>{{publication.authors}}</span>
                </b-form-radio>

              </td>
              <td class="text-center">
                <b-form-radio v-if="typeof(publication.publication_name) !== 'undefined' && publication.publication_name" v-b-tooltip.hover title="Show documents from this publication" name="publications-radios" :value="publication.publication_name" v-on:change="publicationsChanged()">
                  <span >{{publication.publication_name}}</span>
                </b-form-radio>
                <span v-else>-</span>
              </td>
              <td class="text-center"><span
                v-if="typeof(publication.cited_by_scholar) !== 'undefined' && publication.cited_by_scholar">{{publication.cited_by_scholar}}</span>
                <span v-else>-</span></td>
              <td class="text-center"><span class="badge badge-warning"
                                            v-if="typeof(publication.cited_by_link_scholar) !== 'undefined' && publication.cited_by_link_scholar"
                                            @click="openUrl(publication.cited_by_link_scholar)"
                                            style="cursor: pointer">View citations</span> <span
                v-else>-</span></td>


              <td class="text-center"><span
                v-if="typeof(publication.cited_by_scopus) !== 'undefined' && publication.cited_by_scopus">{{publication.cited_by_scopus}}</span>
                <span v-else>-</span></td>
              <td class="text-center"><span class="badge badge-secondary"
                                            v-if="typeof(publication.cited_by_link_scopus) !== 'undefined' && publication.cited_by_link_scopus"
                                            @click="openUrl(publication.cited_by_link_scopus)"
                                            style="cursor: pointer">View citations</span> <span
                v-else>-</span></td>
              <td class="text-center"><span class="badge badge-info"
                                            v-if="typeof(publication.scopus_link) !== 'undefined' && publication.scopus_link"
                                            @click="openUrl(publication.scopus_link)"
                                            style="cursor: pointer">View document</span> <span
                v-else>-</span></td>
              <td class="text-center"><span
                v-if="typeof(publication.scopus_aggregation_type) !== 'undefined' && publication.scopus_aggregation_type">{{publication.scopus_aggregation_type}}</span>
                <span v-else>-</span></td>
              <td class="text-center"><span
                v-if="typeof(publication.scopus_subtype_description) !== 'undefined' && publication.scopus_subtype_description">{{publication.scopus_subtype_description}}</span>
                <span v-else>-</span></td>
              <td class="text-center"><span
                v-if="typeof(publication.dblp_type) !== 'undefined' && publication.dblp_type">{{publication.dblp_type}}</span>
                <span v-else>-</span></td>
              <td class="text-center"><span
                v-if="typeof(publication.dblp_venue) !== 'undefined' && publication.dblp_venue && !Array.isArray(publication.dblp_venue)">{{publication.dblp_venue}}</span>
                <span
                  v-else-if="typeof(publication.dblp_venue) !== 'undefined' && publication.dblp_venue && Array.isArray(publication.dblp_venue)">
                    <template v-for="item in publication.dblp_venue">{{item}}, </template>
                  </span>
                <span v-else>-</span>
              </td>
              <td class="text-center"><span class="badge badge-info"
                                            v-if="typeof(publication.dblp_link) !== 'undefined' && publication.dblp_link"
                                            @click="openUrl(publication.dblp_link)"
                                            style="cursor: pointer">View document</span> <span
                v-else>-</span></td>
              <td align="center">
                <i class="fa fa-trash delete-icon" v-on:click="deletePublication(publication.title)"
                   v-b-tooltip.hover title="Delete document"></i>
                <i class="fa fa-edit edit-icon ml-2" v-on:click="editPublication(publication.title)"
                   v-b-tooltip.hover title="Edit document"></i>
                <i class="fa fa-file-word-o citation-icon ml-2"
                   v-on:click="getCitations(publication.title, publication.cited_by_link_scholar)"
                   v-b-tooltip.hover title="View quick citations"></i>
              </td>
            </tr>
          </template>
          </tbody>
        </table>
      </div>
    </div>
    <b-modal id="citations-modal" size="xl" :title="modalTitle" :ok-only="true">
      <div class="row text-center">
        <b-spinner variant="success" class="modal-spinner" type="grow"
                   style="margin: auto; display: none"></b-spinner>
      </div>
      <div class="modal-content-citations">
        <b-alert variant="danger" v-if="citationsAlert && !showScolarTable" show>No citations
          found!
        </b-alert>
        <table class="table table-bordered table-responsive-xl table-hover scholar-ciations-table"
               v-if="showScolarTable && !citationsAlert">
          <thead class="thead-light">
          <tr>
            <th>Title</th>
            <th>Year</th>
            <th>Authors</th>
            <th>Domains</th>
            <th>Cited no. Scholar</th>
            <th>Cited By Scholar</th>
            <th>URL</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          <template v-for="(item, key) in this.citationsArray[this.usedCitationTitle]">
            <tr v-if="key !== 'message'">
              <td>
                <span :class="'title-' + item.title">{{item.title}}</span>
                <b-input v-model="item.title" :name="item.title" style="display: none"></b-input>
              </td>
              <td>
                <span :class="'title-' + item.title">{{item.year}}</span>
                <b-input v-model="item.year" :name="item.title" style="display: none"></b-input>
              </td>
              <td>
                <span :class="'authors-' + item.title">{{item.authors}}</span>
                <b-input v-model="item.authors" :name="item.title" style="display: none"></b-input>
              </td>
              <td>
                <span v-if="typeof item.domains !== 'undefined'" :class="'domains-' + item.title">{{item.domains}}</span>
                <span v-else :class="'domains-' + item.title">-</span>
                <b-input v-model="item.domains" :name="item.title" style="display: none"></b-input>
              </td>
              <td>
                <span v-if="typeof item.cited_by_scholar !== 'undefined'"
                      :class="'title-' + item.title">{{item.cited_by_scholar}}</span>
                <span v-else :class="'title-' + item.title">-</span>
                <b-input v-model="item.cited_by_scholar" :name="item.title"
                         style="display: none"></b-input>
              </td>
              <td>
                <span v-if="typeof item.cited_by_link_scholar !== 'undefined'"
                      class="badge badge-warning" :data-id="item.title" style="cursor: pointer"
                      @click="openUrl(item.cited_by_link_scholar)">View citations</span>
                <span v-else :data-id="item.title" style="cursor: pointer">-</span>
                <b-input v-model="item.cited_by_link_scholar" :name="item.title"
                         style="display: none"></b-input>
              </td>
              <td>
                <span v-if="typeof item.eprint !== 'undefined'" class="badge badge-success"
                      :data-id="item.title" style="cursor: pointer" @click="openUrl(item.eprint)">View document</span>
                <span v-else-if="typeof item.link !== 'undefined'" class="badge badge-success"
                      :data-id="item.title" style="cursor: pointer" @click="openUrl(item.link)">View document</span>
                <b-input v-if="typeof item.eprint !== 'undefined'" v-model="item.eprint"
                         :name="item.title" style="display: none"></b-input>
                <b-input v-else-if="typeof item.link !== 'undefined'" v-model="item.link"
                         :name="item.title" style="display: none"></b-input>
              </td>
              <td>
                <i title="Edit citation" :data-id="'icon-edit-' + item.title" v-b-tooltip.hover
                   class="fa fa-edit citation-icon" style="color: #2a80ff !important;"
                   @click="editCitationsData(item.title)"></i>
                <i title="Edit citation" :data-id="'icon-submit-' + item.title" v-b-tooltip.hover
                   class="fa fa-check citation-icon" style="display: none"
                   @click="confirmCitationData(item.title)"></i>
              </td>
            </tr>
          </template>
          </tbody>
        </table>
      </div>
    </b-modal>
    <b-modal id="edit-publication-modal" size="xl" :title="editModalTitle" :ok-title="'Save'"
             ok-variant="success" cancel-variant="danger" @ok="saveEditData()">
      <b-input-group>
        <template v-slot:prepend>
          <b-input-group-text class="edit-input-text">Title</b-input-group-text>
        </template>
        <b-form-input v-model="editTitle"></b-form-input>
      </b-input-group>

      <b-input-group class="mt-2">
        <template v-slot:prepend>
          <b-input-group-text class="edit-input-text">Authors</b-input-group-text>
        </template>
        <b-form-input v-model="editAuthorsPublication"></b-form-input>
      </b-input-group>

      <b-input-group class="mt-2">
        <template v-slot:prepend>
          <b-input-group-text class="edit-input-text">Publication</b-input-group-text>
        </template>
        <b-form-input v-model="editPublicationText"></b-form-input>
      </b-input-group>

      <b-input-group class="mt-2">
        <template v-slot:prepend>
          <b-input-group-text class="edit-input-text">Eprint</b-input-group-text>
        </template>
        <b-form-input v-model="editModalUrl"></b-form-input>
      </b-input-group>

      <b-input-group class="mt-2">
        <template v-slot:prepend>
          <b-input-group-text class="edit-input-text">Scholar Citations</b-input-group-text>
        </template>
        <b-form-input v-model="editScholarCitations"></b-form-input>
      </b-input-group>

      <b-input-group class="mt-2">
        <template v-slot:prepend>
          <b-input-group-text class="edit-input-text">Scopus Citations</b-input-group-text>
        </template>
        <b-form-input v-model="editScopusCitations"></b-form-input>
      </b-input-group>

    </b-modal>

    <b-modal id="search-publication-modal" size="xl" title="Search publication" ok-variant="success"
             ok-title="Add to list" @ok="addToList()">
      <b-input-group>
        <template v-slot:prepend>
          <b-input-group-text class="edit-input-text">Publication Name</b-input-group-text>
        </template>
        <b-form-input v-model="publicationSearch"></b-form-input>
        <button type="button" class="btn btn-sm btn-primary" v-on:click="searchPublication()">
          Search
        </button>
      </b-input-group>
      <div class="row mt-2 text-center" v-if="searchPubSpinner">
        <b-spinner variant="success" class="modal-spinner" type="grow"
                   style="margin: auto;"></b-spinner>
      </div>
      <div class="results-container mt-2" v-if="searchHasResults">
        <span class="mt-2"><b>Results found:</b></span>
        <div class="row mt-2">
          <div class="col">
            <b-list-group>
              <b-list-group-item>{{pubResultTitle}}</b-list-group-item>
            </b-list-group>
          </div>
        </div>
      </div>
      <b-alert class="mt-2" v-model="searchNotFound" variant="danger">Publication not found
      </b-alert>
      <b-alert class="mt-2" v-model="pubAlreadyExist" variant="danger">Publication already exists
      </b-alert>
    </b-modal>
  </div>
</template>

<script>
  import axios from 'axios';
  import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
  import $ from 'jquery';

  export default {
    components: {PulseLoader},
    props: {
      'authorName': String,
      'authorTopData': String,
      'fileCitations': Object,
      'fromFile': Boolean,
      "filePublications": Object
    },
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
        editAuthorsPublication: '',
        editScopusCitations: '',
        editScholarCitations: '',
        publicationSearch: '',
        searchPubSpinner: false,
        pubResultTitle: '',
        searchHasResults: false,
        searchNotFound: false,
        pubAlreadyExist: false,
        searchResponse: '',
        titleAscending: true,
        searchedTitle: '',
        usedCitationTitle: '',
        showScolarTable: false,
        citationsAlert: true,
        yearChecked: '',
        citationsArray: {},
        filteredData: {},
        filteredMode: false
      };
    },
    methods: {
      getAuthorPublications() {
        if (!this.fromFile) {
          const path = `${this.test_url}/get-publications-for-author`;
          var data = {};
          data['authorName'] = this.authorName;
          axios.post(path, data)
            .then((response) => {
              this.loading = false;
              if (typeof response.data.error === 'undefined') {
                this.authorPublications = response.data.publications;
              } else {
                console.log('intra');
                this.openExportError('Author publications not found!');
              }
            });
        } else {
          this.loading = false;
          this.authorPublications = this.filePublications;
          this.citationsArray = this.fileCitations;
        }
      },
      openUrl(url) {
        window.open(url);
      },
      getCitations(publicationName, scholarLink) {
        this.$root.$emit('bv::show::modal', 'citations-modal');
        this.modalTitle = 'Citations for: ' + publicationName;
        this.usedCitationTitle = publicationName;
        this.showScolarTable = false;
        this.citationsAlert = false;
        $('.modal-spinner').show();

        if (typeof this.citationsArray[publicationName] === 'undefined') {
          const path = `${this.test_url}/get-citations-for-publication`;
          var data = {};
          data['publicationName'] = publicationName;
          data['authorName'] = this.authorName;
          if (typeof scholarLink !== 'undefined') {
            data['scholarURL'] = scholarLink;
          } else {
            data['scholarURL'] = '-'
          }

          axios.post(path, data)
            .then((response) => {
              $('.modal-spinner').hide();
              if (typeof response.data.scholar_citations !== 'undefined') {
                if (typeof response.data.scholar_citations.publications.message !== 'undefined' && Object.keys(response.data.scholar_citations.publications).length === 1) {
                  this.citationsAlert = true;
                  this.showScolarTable = false;
                  this.citationsArray[publicationName] = response.data.scholar_citations.publications.message;
                } else {
                  this.citationsArray[publicationName] = response.data.scholar_citations.publications;
                  this.showScolarTable = true;
                  this.citationsAlert = false;
                }

              }
            });
        } else {
          $('.modal-spinner').hide();

          if (this.citationsArray[publicationName] === 'Article not found on Semantic Scholar') {
            this.citationsAlert = true;
            this.showScolarTable = false;
          } else {
            this.citationsAlert = false;
            this.showScolarTable = true;
          }

          //this.$root.$emit('bv::show::modal', 'citations-modal');
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
        })
          .then((result) => {
            if (result.value === true) {
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
        this.editAuthorsPublication = this.authorPublications[publicationName]['authors'];
        this.editModalUrl = this.authorPublications[publicationName]['eprint'];
        this.editScholarCitations = this.authorPublications[publicationName]['cited_by_scholar'];
        this.editScopusCitations = this.authorPublications[publicationName]['cited_by_scopus'];
        this.$root.$emit('bv::show::modal', 'edit-publication-modal');
      },
      saveEditData() {
        let newPublicationName = this.editTitle.charAt(0)
          .toUpperCase() + this.editTitle.slice(1);
        let oldPublicationName = this.editModalTitle;
        this.authorPublications[oldPublicationName]['title'] = newPublicationName;
        this.authorPublications[oldPublicationName]['publication_name'] = this.editPublicationText;
        this.authorPublications[oldPublicationName]['authors'] = this.editAuthorsPublication;
        this.authorPublications[oldPublicationName]['eprint'] = this.editModalUrl;
        this.authorPublications[oldPublicationName]['cited_by_scholar'] = this.editScholarCitations;
        this.authorPublications[oldPublicationName]['cited_by_scopus'] = this.editScopusCitations;
        if (oldPublicationName !== newPublicationName) {
          Object.defineProperty(this.authorPublications, newPublicationName, Object.getOwnPropertyDescriptor(this.authorPublications, oldPublicationName));
          delete this.authorPublications[oldPublicationName];
        }
        this.$forceUpdate();
        this.authorPublications = this.orderKeys(this.authorPublications);
        var index = Object.keys(this.authorPublications)
          .indexOf(newPublicationName);
        $('tr').eq(index + 1).addClass('table-success');
        $('tr').eq(index + 1).attr('id', 'scroll-to');
        window.location.href = '#scroll-to';
        setTimeout(function () {
          $('tr').eq(index + 1).removeClass('table-success');
          $('tr').eq(index + 1).removeAttr('id');
        }, 3000);
      },
      showSearchPubModal() {
        this.$root.$emit('bv::show::modal', 'search-publication-modal');
      },
      addToList() {
        this.authorPublications[Object.keys(this.searchResponse)[0]] = this.searchResponse[Object.keys(this.searchResponse)[0]];
        this.authorPublications = this.orderKeys(this.authorPublications);
        this.$forceUpdate();
        var index = Object.keys(this.authorPublications)
          .indexOf(this.searchResponse[Object.keys(this.searchResponse)[0]].title);
        setTimeout(function () {
          $('tr').eq(index + 1).addClass('table-success');
          $('tr').eq(index + 1).attr('id', 'scroll-to');
          window.location.href = '#scroll-to';
          setTimeout(function () {
            $('tr').eq(index + 1).removeClass('table-success');
            $('tr').eq(index + 1).removeAttr('id');
          }, 3000);
          this.searchResponse = '';
        }, 1000);
      },
      verifyPubExistance(name) {
        $.each(Object.keys(this.authorPublications), (index, val) => {
          if (val === name) {
            this.pubAlreadyExist = true;
            return false;
          }
        });
        return true;
      },
      searchPublication() {
        var existance = this.verifyPubExistance(this.publicationSearch);

        this.searchNotFound = false;
        this.searchHasResults = false;
        existance = false;
        if (!existance) {
          this.searchPubSpinner = true;
          this.pubAlreadyExist = false;
          var authorName = this.authorName;
          var publicationName = this.publicationSearch;
          var data = {};
          data['authorName'] = authorName;
          data['publicationName'] = publicationName;
          const path = `${this.test_url}/get-searched-publication`;
          axios.post(path, data)
            .then((response) => {
              this.searchPubSpinner = false;
              if (Object.keys(response.data.publications).length) {
                this.searchResponse = response.data.publications;
                this.searchHasResults = true;
                this.pubResultTitle = response.data.publications[Object.keys(response.data.publications)[0]].title;
              } else {
                this.searchNotFound = true;
              }
            });
        }
      },
      orderKeys(obj) {
        var keys = Object.keys(obj)
          .sort(function keyOrder(k1, k2) {
            if (k1 < k2) {
              return -1;
            } else if (k1 > k2) {
              return +1;
            } else {
              return 0;
            }
          });

        var i,
          after = {};
        for (i = 0; i < keys.length; i++) {
          after[keys[i]] = obj[keys[i]];
          delete obj[keys[i]];
        }

        for (i = 0; i < keys.length; i++) {
          obj[keys[i]] = after[keys[i]];
        }
        return obj;
      },
      exportData() {
        var data = {};
        var date = new Date();
        var timestamp = date.getFullYear().toString() + date.getMonth().toString() + date.getDate().toString() + date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString();
        data['topData'] = this.authorTopData;
        data['authorPublications'] = this.authorPublications;
        data['citationsData'] = this.citationsArray;
        var encoded_data = JSON.stringify(data);
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(encoded_data));
        element.setAttribute('download', 'scholartechData_' + timestamp);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      },
      exportFilteredData() {
        if(this.filteredMode === false) {
          this.openExportError();
        } else {
          var data = {};
          var date = new Date();
          var timestamp = date.getFullYear().toString() + date.getMonth().toString() + date.getDate().toString() + date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString();
          data['topData'] = this.authorTopData;
          data['authorPublications'] = this.filteredData;
          data['citationsData'] = this.citationsArray;
          var encoded_data = JSON.stringify(data);
          var element = document.createElement('a');
          element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(encoded_data));
          element.setAttribute('download', 'scholartechFilteredData_' + timestamp);
          element.style.display = 'none';
          document.body.appendChild(element);
          element.click();
          document.body.removeChild(element);
        }
      },
      documentNotAvailable() {
        this.$swal({
          title: 'Sorry',
          text: 'Document not available',
          icon: 'warning',
          showCancelButton: false,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Close'
        })
      },
      sortByTitle(data, attr) {
        var self = this;
        self.titleAscending = !self.titleAscending;
        var arr = [];
        for (var prop in data) {
          if (data.hasOwnProperty(prop)) {
            var obj = {};
            obj[prop] = data[prop];
            obj.tempSortName = data[prop][attr].toLowerCase();
            arr.push(obj);
          }
        }

        arr.sort(function (a, b) {
          var at = a.tempSortName,
            bt = b.tempSortName;
          if (self.titleAscending === true) {
            return at > bt ? 1 : (at < bt ? -1 : 0);
          } else {
            return at < bt ? 1 : (at > bt ? -1 : 0);
          }

        });

        var result = [];
        for (var i = 0, l = arr.length; i < l; i++) {
          var obj = arr[i];
          delete obj.tempSortName;
          for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
              var id = prop;
            }
          }
          var item = obj[id];
          result.push(item);
        }
        return result;
      },
      sortByYear(data, attr) {
        var self = this;
        self.yearAscending = !self.yearAscending;
        var arr = [];
        for (var prop in data) {
          if (data.hasOwnProperty(prop)) {
            var obj = {};
            obj[prop] = data[prop];
            obj.tempSortName = data[prop][attr].toLowerCase();
            arr.push(obj);
          }
        }

        arr.sort(function (a, b) {
          var at = a.tempSortName,
            bt = b.tempSortName;
          if (self.yearAscending === true) {
            return at > bt ? 1 : (at < bt ? -1 : 0);
          } else {
            return at < bt ? 1 : (at > bt ? -1 : 0);
          }

        });

        var result = [];
        for (var i = 0, l = arr.length; i < l; i++) {
          var obj = arr[i];
          delete obj.tempSortName;
          for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
              var id = prop;
            }
          }
          var item = obj[id];
          result.push(item);
        }
        return result;
      },
      nameOrder() {
        this.authorPublications = this.sortByTitle(this.authorPublications, 'title');
        this.renameAuthorPubArray();

      },
      yearOrder() {
        this.authorPublications = this.sortByYear(this.authorPublications, 'year');
        this.renameAuthorPubArray();
      },
      searchTable() {
        $('tbody>tr').show();
        var self = this;
        $.each(this.authorPublications, function (key, value) {
          if (value.title.toLowerCase().search(self.searchedTitle.toLowerCase()) == -1) {
            var index = Object.keys(self.authorPublications).indexOf(value.title);
            $('tbody > tr').eq(index).hide();
          }
        })
      },
      resetTable() {
        $('input[name=year-radios]').prop('checked', false);
        $('input[name=authors-radios]').prop('checked', false);
        $('input[name=publications-radios]').prop('checked', false);
        $('tbody>tr').show();
        this.searchedTitle = '';
        this.filteredData = {};
        this.filteredMode = false;
      },
      editCitationsData(title) {
        var editButtonId = 'icon-edit-' + title;
        var submitButtonId = 'icon-submit-' + title;
        $("input[name='" + title + "']").show();
        $("span[class='title-" + title + "']").hide();
        $("span[class='authors-" + title + "']").hide();
        $('span[data-id="' + title + '"]').hide();
        $("span[class='domains-" + title + "']").hide();
        $('i[data-id="' + editButtonId + '"]').hide();
        $('i[data-id="' + submitButtonId + '"]').show();
      },
      confirmCitationData(title) {
        var editButtonId = 'icon-edit-' + title;
        var submitButtonId = 'icon-submit-' + title;

        $("input[name='" + title + "']").hide();
        $("span[class='authors-" + title + "']").show();
        $("span[class='title-" + title + "']").show();
        $("span[class='domains-" + title + "']").show();
        $('span[data-id="' + title + '"]').show();
        $('i[data-id="' + editButtonId + '"]').show();
        $('i[data-id="' + submitButtonId + '"]').hide();
        this.$forceUpdate();
      },
      renameAuthorPubArray() {
        var data_arr = {};
        $.each(this.authorPublications, (key, data) => {
          data_arr[data.title] = data;
        });
        this.authorPublications = data_arr;
      },
      yearChanged() {
        this.filteredMode = true;
        this.filteredData = {};
        var yearSelected = $('input[name=year-radios]:checked').val();
        $('tbody>tr').show();
        $('input[name=authors-radios]').prop('checked', false);
        $('input[name=publications-radios]').prop('checked', false);
        var self = this;
        $.each(this.authorPublications, function (key, value) {
          if (parseInt(value.year) !== parseInt(yearSelected)) {
            var index = Object.keys(self.authorPublications).indexOf(value.title);
            $('tbody > tr').eq(index).hide();
          } else {
            self.filteredData[key] = self.authorPublications[key];
          }
        })
      },
      authorsChanged() {
        this.filteredData = {};
        this.filteredMode = true;
        var authorsSelected = $('input[name=authors-radios]:checked').val();
        var self = this;
        $('tbody>tr').show();
        $('input[name=year-radios]').prop('checked', false);
        $('input[name=publications-radios]').prop('checked', false);
        $.each(this.authorPublications, function (key, value) {
          if (value.authors.replace(/\,/g, '').replace(/\./g, '').toLowerCase().search(authorsSelected.replace(/\,/g, '').replace(/\./g, '').toLowerCase()) == -1) {
            var index = Object.keys(self.authorPublications).indexOf(value.title);
            $('tbody > tr').eq(index).hide();
          } else {
            self.filteredData[key] = self.authorPublications[key];
          }
        })
      },
      publicationsChanged() {
        this.filteredData = {};
        this.filteredMode = true;
        var publciationsSelected = $('input[name=publications-radios]:checked').val();
        var self = this;
        $('tbody>tr').show();
        $('input[name=year-radios]').prop('checked', false);
        $('input[name=authors-radios]').prop('checked', false);
        $.each(this.authorPublications, function (key, value) {
          if (value.publication_name !== publciationsSelected) {
            var index = Object.keys(self.authorPublications).indexOf(value.title);
            $('tbody > tr').eq(index).hide();
          } else {
            self.filteredData[key] = self.authorPublications[key];
          }
        })
      },
      openExportError(message) {
        this.$vToastify.error({
          errorDuration: 1000,
          title: "Error!",
          body: typeof message === 'undefined' ? "You need to filter the data from table!" : message,
          type: "error",
          theme: 'dark'
        });
      },
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

  th, td {
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

  .citation-icon {
    color: green;
    font-size: 21px;
    cursor: pointer;
    margin-top: 7px;
  }

  .edit-input-text {
    font-weight: 600;
  }

  .success-border {
    box-shadow: 0 0 0 3px green;
  }

  .custom-control-label::before {
    top: 0.1rem !important;
  }
  .custom-control-label::after {
    top: 0.10rem !important;
    left: -1.5rem !important;
  }
  .vt-notification-container {
    top: 0 !important;
    right: 0 !important;
  }
</style>

