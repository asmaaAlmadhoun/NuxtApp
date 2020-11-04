<template>
  <div class="container p-5">
    <b-card title="COVID-19" sub-title="SPA">
      <b-card-text>
        Welcome at our application to track data about the COVID-19 virus.
      </b-card-text>
      <b-card-text>
        <Autocomplete
          placeholder="Search By Country Name"
          :source="ContryNameForSearch"
          input-class="form-control"
          results-property="data"
          @selected="SearchForCountryFunc"
          @nothingSelected="ClearSearchData"
        >
        </Autocomplete>
        <b-button class="m-3" text-align="right" variant="outline-primary" v-on:click="View1 = !View1">Switch To Other View</b-button>
      </b-card-text>
      <b-card-body>
        <div v-if="View1 === false">
          <App></App>
        </div>
        <div v-else>
          <table id="units-table" class="table table-striped table-bordered table-hover">
            <thead>
            <tr>
              <th rowspan="2" width="5%">#</th>
              <th rowspan="2" width="5%">Country Name</th>
              <th rowspan="2" width="5%">no Active Cases</th>
              <th rowspan="2" width="5%">no Deaths</th>
              <th rowspan="2" width="5%">no Recoveries</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in ContryName2[currPage-1]">
              <td>{{ item.key }}</td>
              <td>{{ item.name }}</td>
              <td>{{ States[index].active }}</td>
              <td>{{ States[index].deaths }}</td>
              <td>{{ States[index].recovered }}</td>
            </tr>
            <tr v-if="search === null">
              <td colspan="2">Total</td>
              <td>{{totalActiveNum}}</td>
              <td>{{totalDeathsNum}}</td>
              <td>{{totalRecoverdNum}}</td>
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
        </div>

      </b-card-body>
    </b-card>
  </div>
</template>

<script>
  import Vue from 'vue';
  import axios from "axios";
  import Autocomplete  from 'vuejs-auto-complete'
  import App from "./App.vue";

  export default Vue.extend({
    components: {
      Autocomplete,
      App
    },
    data() {
      return{
        search: null,
        View1: 1,
        ContryName: [],
        ContryNameForSearch: [],
        totalPage: '1',
        currPage: '1',
        perPage: 7,
        list_of_pages : [],
        ContryName2 : [],
        ActiveState: [],
        States:[],
        totalActiveNum: 0,
        totalDeathsNum: 0,
        totalRecoverdNum: 0,
        config : {
          headers: {'Access-Control-Allow-Origin': '*'}
        },
      }
    },
    methods: {
      SearchForCountryFunc (search) {
        if(search === ''){
          this.getCountry();
        }
        else {
          this.search = search.display
          let array1 = [[]]
          this.ContryNameForSearch.map((mapItem) => {
            if (mapItem.name === this.search) {
              array1[0].push(mapItem);
              this.ContryName2 =  array1
              this.totalPage = 1
            }
          })
        }
      },
      ClearSearchData: function(search){
        console.log(search)
        if(search === null){
          this.getCountry();
        }
        this.search = null;
      },
      async getCountry() {
        const result = await axios.get(this.$store.state.apiUrl + '/countries', this.config);
        this.ContryName = result.data.map((country,key) => ({
          key: key,
          name: country.Country,
        }));
        this.ContryNameForSearch = this.ContryName.slice(0);

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

        for (let i=0; i < this.perPage; i++) {
          let name = this.ContryName2[0][i].name
          this.getCases(name);
        }


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
        let _this=this;
        this.States = [];
        for (let i=0; i < this.perPage; i++) {
          let name = this.ContryName2[idx][i].name
          this.getCases(name);
        }
        setTimeout(()=> this.generateTotal(),500)

      },
      resetArrayFunc: function(array){
        for (let i=0; i < array.length; i++) {
          array.pop()
        }
        return array
      },
      async getCases(countryName) {
        try {
          const result = await axios.get(this.$store.state.apiUrl+'/live/country/'+countryName+'/status/confirmed');
          this.ActiveState = result.data.map((state) => ({
            Active: state.Active,
            Deaths: state.Deaths,
            Recovered: state.Recovered,
          }))

          let totalActive = [];let totalDeaths = [];let totalRecoverd = [];
          Object.entries(this.ActiveState).forEach(([key, val]) => {
            totalActive.push(val.Active) // the value of the current key.
            totalDeaths.push(val.Deaths) // the value of the current key.
            totalRecoverd.push(val.Recovered) // the value of the current key.
          });
          let ActiveNum = totalActive.reduce(function(total, num){ return total + num }, 0);
          let DeathsNum = totalDeaths.reduce(function(total, num){ return total + num }, 0);
          let RecoverdNum = totalRecoverd.reduce(function(total, num){ return total + num }, 0);

          let item = {
            'active': ActiveNum,
            'deaths': DeathsNum,
            'recovered': RecoverdNum,
          }
          this.States.push(item);
        }
        catch (err) {
          console.log(err.message);
        }
      },
      generateTotal: function () {
        console.log(this.States);
        let totalActive = [];let totalDeaths = [];let totalRecoverd = [];
        let sums1 = 0;let sums2 = 0;let sums3 = 0;
        this.States.forEach(item => {
          sums1 += item.active
          sums2 += item.deaths
          sums3 += item.recovered
        });
        this.totalActiveNum = sums1;
        this.totalDeathsNum = sums2;
        this.totalRecoverdNum =sums3;
      }
    },
    created () {
      this.getCountry();
    },
    mounted() {
      setTimeout(()=> this.generateTotal(),500)
    }


  })
</script>

<style scoped>

</style>
