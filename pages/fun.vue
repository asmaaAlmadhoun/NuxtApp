<template>
  <div class="container p-5">
    <b-card title="COVID-19" sub-title="SPA">
      <b-card-text>
        Welcome at our application to track data about the COVID-19 virus.
      </b-card-text>
      <b-card-text>
        <b-input-group size="md" class="mb-2">
          <b-input-group-prepend is-text>
            <i class="fa fa-search"></i>
          </b-input-group-prepend>
          <b-form-input type="search" v-model="search" v-on:change="filteredList()"  placeholder="Search for the country names"></b-form-input>
        </b-input-group>

        <Autocomplete
          ref="autocomplete"
          placeholder="Search Distribution Groups"
          :source="[{id:1,name:'abc'},{id:2,name:'def'}]"
          input-class="form-control"
          results-property="data">
        </Autocomplete>

      </b-card-text>
      <b-card-body>
        <div class="wrapper">
          <div class="card" v-for="item in filteredList">
            {{ item.name }}
          </div>
        </div>
         <table id="units-table" class="table table-striped table-bordered table-hover">
            <thead>
            <tr>
              <th rowspan="2" width="5%">#</th>
              <th rowspan="2" width="5%">country Name</th>
              <th rowspan="2" width="5%">no active cases</th>
              <th rowspan="2" width="5%">no deaths</th>
              <th rowspan="2" width="5%">no recoveries</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item) in ContryName2[currPage-1]">
              <td>{{ item.key }}</td>
              <td>{{ item.name }}</td>
            </tr>
            </tbody>
          </table>
        <nav aria-label="Page navigation" v-if="totalPage > 1" style="text-align: left;">
          <ul class="pagination justify-content-center">
            <li class="page-item"
                v-bind:class="[(currPage < 2)? 'disabled': '']"
            ><a @click.prevent="setPage(currPage-1)" v-if="currPage > 1" class="page-link" href="">prev</a>
              <span  class="page-link" aria-disabled="true" v-else>Prev</span>
            </li>
            <li class="page-item" v-bind:class="{'active': (currPage === (1))}"
                @click.prevent="setPage(1)">
              <a class="page-link" href="#">
                First
              </a>
            </li>
            <li class="page-item"
                v-for="n in list_of_pages"
                v-bind:class="{'active': (currPage === (n))}"
                @click.prevent="setPage(n)">
              <a class="page-link" href="" v-if="n !== (totalPage && 1) ">
                {{n}}
              </a>
            </li>

            <li class="page-item"
                v-if="currPage !== (totalPage) && currPage !==  (totalPage - 1)">
                <span class="page-link">
                    ...
                </span>
            </li>
            <li class="page-item" v-bind:class="{'active': (currPage === (totalPage))}"
                @click.prevent="setPage(totalPage)">
              <a class="page-link" href="#">
                Last
              </a>
            </li>

            <li class="page-item"
                v-bind:class="[(currPage === totalPage)? 'disabled': '']">
              <a @click.prevent="setPage(currPage+1)" v-if="currPage < totalPage" class="page-link"
                 href="">Next</a>
              <span class="page-link" aria-disabled="true" v-else>next</span>
            </li>
          </ul>
        </nav>

      </b-card-body>
    </b-card>


  </div>
</template>

<script>
  import Vue from 'vue';
  import axios from "axios";
  import Autocomplete  from 'vuejs-auto-complete'

  export default Vue.extend({
    components: {
      Autocomplete,
    },
    data() {
      return{
        search: '',
        ContryName: [],
        totalPage: '1',
        currPage: '1',
        perPage: 7,
        list_of_pages : [],
        ContryName2 : [],
        config : {
          headers: {'Access-Control-Allow-Origin': '*'}
        },
      }
    },
    methods: {
      async getCountry() {
        const result = await axios.get(this.$store.state.apiUrl + '/countries', this.config);
        this.ContryName = result.data.map((country,key) => ({
          key: key,
          name: country.Country,
        }));

        let n = this.perPage;
        let _this= this;
        const result2 = new Array(Math.ceil(_this.ContryName.length / n))
          .fill()
          .map(_ => _this.ContryName.splice(0, n));
        _this.ContryName2 = result2;
        _this.totalPage = _this.ContryName2.length;
        let arr = [];
        if (Number(_this.currPage) - 1 > 0) {
          arr.push(Number(_this.currPage) - 1);
        }
        arr.push(Number(_this.currPage));
        if (Number(_this.currPage) + 1 < _this.totalPage ) {
          arr.push(Number(_this.currPage) + 1);
        }
        if (Number(_this.currPage) + 2 < _this.totalPage ) {
          arr.push(Number(_this.currPage) + 2);
        }
        _this.list_of_pages = arr;
      },
      setPage: function(idx){
        this.currPage = idx;
        let start = Math.max(1, idx - 2)
        let end = Math.min(start + 3, this.totalPage - 1);
        let arr = [];
        for (let i = start; i <= end; i++) {
          // Render each element, but the active one differently.
          arr.push(i);
        }
        this.list_of_pages = arr;
      },
      filteredList() {
        let _this=this;
        return this.ContryName2.filter(item => {
          return item.name.toLowerCase().includes(_this.search.toLowerCase())
        })
      },
    },

    created () {
      this.getCountry();
    },
    computed: {

      filteredList1 (){
        let _this=this;
        if(this.search){
          return _this.ContryName2.filter((item)=>{
            return item.name.startsWith(_this.search);
          })
        }else{
          return _this.ContryName2;
        }
      }
    }
  })
</script>

<style scoped>

</style>
