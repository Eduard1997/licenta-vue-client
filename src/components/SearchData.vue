<template>
  <div class="container">
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
        </div>
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
      </div>
      <div class="col-md-6">
        <div class="card" style="width: 18rem;" v-if="displayAuthor">
          <img :src="responseSearchAuthor.url_picture" class="card-img-top" alt="Avatar" height="200">
          <div class="card-body">
            <h5 class="card-title">{{responseSearchAuthor.author_name}}</h5>
            <p class="card-text">{{responseSearchAuthor.affiliation}}</p>
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">
              <b>Interests:</b> <span v-for="(interests, key) in responseSearchAuthor.interests">{{interests}}<span v-if="key !== responseSearchAuthor.interests.length -1">,</span>  </span>
            </li>
            <li class="list-group-item" style="height: 86px; overflow-y: auto;">
              <b>Cites per year:</b> <br/>
              <template v-for="(cites,key) in responseSearchAuthor.cites_per_year">
                <span>{{key}}: {{cites}}, </span>
              </template>
            </li>
            <li class="list-group-item">
              <b>Email: </b> <span>{{responseSearchAuthor.email}}</span>
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
            <li class="list-group-item publications-list" style="overflow-y: auto; ">
              <span @click="showPublications()" style="cursor: pointer">
                <b>View publications:</b>
              </span>
              <b-collapse id="collapse-4" v-model="publicationsVisible" class="mt-2">
                <div style="text-align: center">
                  <b-spinner label="Spinning" v-if="publicationsSpinner"></b-spinner>
                </div>
                <div>
                  <template v-for="(publication, key) in authorPublications">
                    <b>{{key}}</b> <br/>
                    <span>Year: {{publication.year}}</span> <br/>
                    <span class="badge badge-primary" style="cursor: pointer" @click="viewSource(publication.url)" >View source</span> <br/>
                  </template>
                </div>
              </b-collapse>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';
  import PulseLoader from 'vue-spinner/src/PulseLoader.vue';

  export default {
    components: { PulseLoader },
    name: 'SearchData',
    data() {
      return {
        authorName: '',
        loading: false,
        color: 'green',
        size: '20px',
        responseSearchAuthor: {
          url_picture: ''
        },
        authorPublications: '',
        alertText: '',
        publicationsVisible: false,
        publicationsSpinner: false,
        displayAuthor: false,
        showAlert: false
      };
    },
    methods: {
      searchAuthor() {
        if(this.authorName) {
          this.displayAuthor = false;
          const path = `${this.test_url}/get-docs-by-author`;
          var data = {};
          data['author_name'] = this.authorName;
          this.loading = true;
          axios.post(path, data)
            .then((response) => {
              this.loading = false;
              if(typeof response.data.error !== 'undefined') {
                this.alertText = response.data.error;
                this.showAlert = true;
                setTimeout(() => {
                  this.showAlert = false;
                },2000);
              } else {
                this.displayAuthor = true;
                this.responseSearchAuthor = response.data;
              }
            });
          this.getPublicationsForAuthor(this.authorName)
        } else {
          this.alertText = 'Please type an author name';
          this.showAlert = true;
          setTimeout(() => {
            this.showAlert = false;
          },2000);
        }
      },
      getPublicationsForAuthor(authorName) {
        const path = `${this.test_url}/get-publications-for-author`;
        var data = {};
        data['authorName'] = authorName;
        axios.post(path, data).then((response) => {
          if(typeof response.data.error === 'undefined') {
            this.authorPublications = response.data.publications;
            this.publicationsSpinner = false;
          }
        });
      },
      viewSource(url) {
        window.open(url)
      },
      showPublications() {
        if(!document.getElementsByClassName('publications-list')[0].classList.contains('js-active')) {
          document.getElementsByClassName('publications-list')[0].style.height="193px";
          document.getElementsByClassName('publications-list')[0].classList.add('js-active');
        } else {
          document.getElementsByClassName('publications-list')[0].style.height="auto";
          document.getElementsByClassName('publications-list')[0].classList.remove('js-active');
        }

        this.publicationsVisible = !this.publicationsVisible;
        this.publicationsSpinner = !this.publicationsSpinner;
      }
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
</style>
