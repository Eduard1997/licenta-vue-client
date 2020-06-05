<template>
  <!--<div class="bg">-->
    <div class="container mt-2">
      <pulse-loader class="centered" :loading="loading" :color="color" :size="size"></pulse-loader>
      <div class="alert alert-danger" v-if="showAlert">{{alertText}}</div>
      <div class="row">
        <div class="col-md-6">
          <div class="form-inline">
            <label for="search-author-input" class="mr-2">Author:</label>
            <input type="text" class="form-control" id="search-author-input"
                   placeholder="Author name..." v-model="authorName">
            <button type="button" class="btn btn-primary btn-sm ml-2 search-author-btn"
                    v-on:click="searchAuthor()">Search author
            </button>
            <b-button v-b-toggle.metrics-collapse variant="primary" class="btn-sm ml-2">Metrics
              explanation
            </b-button>
            <div class="text-right w-100 mr-4">
              <b-button v-b-toggle.author-details-collapse variant="primary" size="sm" class="mt-2"
                        v-if="responseSearchAuthor">Author Details
              </b-button>
            </div>
          </div>

          <b-collapse id="metrics-collapse" visible class="mt-2">
            <div class="row">
              <div class="col mt-2">
                <span>Metrics explanations:</span>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <ul class="list-group">
                  <li class="list-group-item">
                <span class="ml-3">
                  The <b>h-index</b> of a publication is the largest number h such that at least h articles in that publication were cited at least h times each. For example, a publication with five articles cited by, respectively, 17, 9, 6, 3, and 2, has the h-index of 3.
                </span>
                  </li>
                  <li class="list-group-item">
                <span class="ml-3">
                  <b>The h5-index</b> is the the h-index of only those of its articles that were published in the last five complete calendar years.
                </span>
                  </li>
                  <li class="list-group-item">
                <span class="ml-3">
                  <b>I10 index</b> refers to the number of articles with 10 or more citations.
                </span>
                  </li>
                </ul>
              </div>
            </div>
          </b-collapse>
          <b-form-file
            class="mt-2 import-input"
            v-on:change="importData()"

            placeholder="Import data"
            drop-placeholder="Drop file here..."
            id="myFile"
          ></b-form-file>
        </div>

        <div class="col-md-6">
          <b-collapse id="author-details-collapse" visible>
            <div class="card" style="width: 100%;" v-if="displayAuthor">
              <img :src="responseSearchAuthor.url_picture" class="card-img-top " alt="Avatar"
                   height="200">
              <div class="card-body">
                <h5 class="card-title">{{responseSearchAuthor.author_name}}</h5>
                <p class="card-text">{{responseSearchAuthor.affiliation}}</p>
              </div>
              <ul class="list-group list-group-flush">
                <li class="list-group-item">
                  <b>Interests:</b> <span
                  v-for="(interests, key) in responseSearchAuthor.interests">{{interests}}<span
                  v-if="key !== responseSearchAuthor.interests.length -1">,</span>  </span>
                </li>
                <li class="list-group-item" style="height: 86px; overflow-y: auto;">
                  <b>Coauthors:</b> <br/>
                  <template v-for="(coauthors,key) in responseSearchAuthor.coauthors">
                    <span> <b><a href="javascript:;"
                                 v-on:click="searchCoauthor(Object.keys(coauthors)[0])">{{Object.keys(coauthors)[0]}}</a></b>: {{coauthors[Object.keys(coauthors)[0]]}} </span>
                    <br/>
                  </template>
                </li>
                <li class="list-group-item" style="height: 86px; overflow-y: auto;">
                  <b>Cites per year:</b> <br/>
                  <template v-for="(cites,key) in responseSearchAuthor.cites_per_year">
                    <span>{{Object.keys(cites)[0]}}: {{cites[Object.keys(cites)[0]]}}, </span>
                  </template>
                </li>
                <li class="list-group-item">
                  <b>H Index:</b> <span>{{responseSearchAuthor.h_index}}</span>
                </li>
                <li class="list-group-item">
                  <b>H5 Index:</b> <span>{{responseSearchAuthor.h5_index}}</span>
                </li>
                <li class="list-group-item">
                  <b>I10 Index:</b> <span>{{responseSearchAuthor.i10_index}}</span>
                </li>
                <li class="list-group-item">
                  <b>I10 5 Years Index:</b> <span>{{responseSearchAuthor.i10_index5y}}</span>
                </li>
                <!--<li class="list-group-item publications-list" style="overflow-y: auto; ">
                  <span @click="showPublications()" style="cursor: pointer">
                    <b>View publications:</b>
                  </span>
                  <b-collapse id="collapse-4" v-model="publicationsVisible" class="mt-2">
                    <div style="text-align: center">
                      <b-spinner label="Spinning" v-if="publicationsSpinner && authorPublications.length > 0"></b-spinner>
                    </div>
                    <div>
                      <template v-for="(publication, key) in authorPublications">
                        <b>{{key}}</b> <br/>
                        <span>Year: {{publication.year}}</span> <br/>
                        <span class="badge badge-primary" style="cursor: pointer" @click="viewSource(publication.url)" >View source</span> <br/>
                      </template>
                    </div>
                  </b-collapse>
                </li>-->
              </ul>
            </div>
          </b-collapse>
        </div>

      </div>
    </div>
    <div class="container-fluid mt-2">
      <author-publications v-if="showPublications" :authorName="authorName"
                           :authorTopData="responseSearchAuthor" :fromFile="fromFile" :filePublications="authorPublications" :fileCitations="citationsArray"></author-publications>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
  import AuthorPublications from './AuthorPublications';
  import $ from 'jquery';

  export default {
    components: {
      PulseLoader,
      AuthorPublications
    },
    name: 'SearchData',
    data() {
      return {
        authorName: '',
        loading: false,
        color: 'green',
        size: '20px',
        responseSearchAuthor: '',
        authorPublications: '',
        citationsArray: '',
        alertText: '',
        publicationsVisible: false,
        publicationsSpinner: false,
        displayAuthor: false,
        showAlert: false,
        showPublications: false,
        fromFile: false,
      };
    },
    methods: {
      searchAuthor() {
        this.fromFile = false;
        this.showPublications = false;
        if (this.authorName) {
          this.displayAuthor = false;
          this.authorPublications = '';
          this.responseSearchAuthor = '';
          const path = `${this.test_url}/get-docs-by-author`;
          var data = {};
          data['author_name'] = this.authorName;
          this.loading = true;
          axios.post(path, data)
            .then((response) => {
              this.loading = false;
              this.showPublications = true;
              if (typeof response.data.error !== 'undefined') {
                this.alertText = response.data.error;
                this.showAlert = true;
                setTimeout(() => {
                  this.showAlert = false;
                }, 2000);
              } else {
                this.displayAuthor = true;
                this.responseSearchAuthor = response.data;
              }
            });
        } else {
          this.alertText = 'Please type an author name';
          this.showAlert = true;
          setTimeout(() => {
            this.showAlert = false;
          }, 2000);
        }
      },
      searchCoauthor(coauthorName) {
        this.authorName = coauthorName;
        this.searchAuthor();

      },
      importData() {
        var decodedData;
        var self = this;
        this.fromFile = true;
        self.responseSearchAuthor = '';
        self.authorPublications = '';
        self.showPublications = false;
        var input = document.getElementById("myFile");
        if (input.files && input.files[0]) {
          var myFile = input.files[0];
          var reader = new FileReader();

          reader.addEventListener('load', function (e) {
            try {
              decodedData = JSON.parse(e.target.result);
            } catch (e) {
              self.openImportError();
              return false;
            }
            if(decodedData.hasOwnProperty('topData') && decodedData.hasOwnProperty('authorPublications') && decodedData.hasOwnProperty('citationsData')) {
              self.responseSearchAuthor = decodedData['topData'];
              self.authorPublications = decodedData['authorPublications'];
              self.citationsArray = decodedData['citationsData']
              self.showPublications = true;
              self.displayAuthor = true;
            } else {
              self.openImportError();
              return false;
            }
          });
          reader.readAsBinaryString(myFile);
        }
        $('.import-input > input').val('');
      },
      openImportError() {
        this.$vToastify.error({
          errorDuration: 1000,
          title: "Error!",
          body: "Invalid JSON!",
          type: "error",
          theme: 'dark'
        });
      },
      viewSource(url) {
        window.open(url);
      },
    },
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

  .vt-notification-container {
    top: 0 !important;
    right: 0 !important;
  }

  body, html {
    height: 100%;
  }
  /*.bg {
    !* The image used *!
    background-image: url("https://mdbootstrap.com/img/Photos/Horizontal/Nature/full page/img(20).jpg");

    !* Full height *!
    height: 100%;

    !* Center and scale the image nicely *!
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }*/
</style>
