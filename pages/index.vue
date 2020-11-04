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
            <b-form-input type="search" placeholder="Search for the country names"></b-form-input>
          </b-input-group>
          <b-alert v-model="showDismissibleAlert" v-if="showDismissibleAlert!==''" variant="danger" dismissible></b-alert>

        </b-card-text>
        <b-card-body>
          <b-table
            id="my-table"
            :fields="headers"
            :items="items"
            :per-page="perPage"
            :current-page="currentPage"
          ></b-table>
          <b-pagination
            v-model="currentPage"
            :total-rows="rows"
            :per-page="perPage"
            aria-controls="my-table"
            align="center"
            @page-click="setNewData()"
            first-number
            last-number
          ></b-pagination>
        </b-card-body>
      </b-card>


    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import axios from "axios";


export default Vue.extend({

  data() {
    return {
      headers: [
        {  key: 'index',
          label: '#'
        },
        {  key: 'index',
          label: '#'
        },
        {  key: 'Country_name',
          label: 'Country_name'
        },
        {  key: 'no_active_cases',
          label: 'no_active_cases'
        },
        {  key: 'no_deaths',
          label: 'no_deaths'
        },
        {  key: 'no_recoveries',
          label: 'no_recoveries'
        },
        {  key: 'TOTALS',
          label: 'TOTALS'
        }],
      ContryName: [],
      ActiveState: [],
      States: [],
      config : {
        headers: {'Access-Control-Allow-Origin': '*'}
      },
      items: [],
      currentPage: 1,
      perPage: 9,
      pages: [],
      showDismissibleAlert: '',
      currentDate : new Date().toISOString(),
    }
  },
  methods: {
    async getCountry() {
      const result = await axios.get(this.$store.state.apiUrl + '/countries', this.config);
      this.ContryName = result.data.map((country: { Country: any; }) => ({
        name: country.Country,
      }));
      for (let i=0; i < this.perPage; i++) {
        this.getCases(this.ContryName[i].name);
      }
      this.fillTable();
    },
    async getCases2() {
      let currentPage = this.currentPage;
      let perPage = this.perPage;
      let from = (currentPage * perPage) - perPage;
      let to = (currentPage * perPage);
      try {
        for (from; from < to; from++) {
          this.getCases(this.ContryName[from].name);
        }
        this.fillTable();
      }
      catch (e) {
        this.showDismissibleAlert = e.message;
      }
    },
    async getCases( countryName: string) {
      try {
        const result = await axios.get(this.$store.state.apiUrl+'/live/country/'+countryName+'/status/confirmed');
        this.ActiveState = result.data.map((state:any) => ({
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
          active: ActiveNum,
          deaths: DeathsNum,
          recovered: RecoverdNum,
        }
        this.States.push(item);

      } catch (err) {
        this.showDismissibleAlert = err.message;
      }
    },
    fillTable: function () {
      let currentPage = this.currentPage;
      let perPage = this.perPage;
      let from = (currentPage * perPage) - perPage;
      let to = (currentPage * perPage);

      for( from; from < to ; from++){
        let item = { index: 0,Country_name: '', no_active_cases: 0, no_deaths: 0,
          no_recoveries: 0, TOTALS: 0 };
        item.index = from ;
        console.log(from)

        item.Country_name = this.ContryName[from].name;
        // item.no_active_cases = this.States[from].active;
        // item.no_deaths = this.States[from].deaths;
        // item.no_recoveries = this.States[from].recovered;
        //
        // item.TOTALS = (item.no_active_cases + item.no_deaths + item.no_recoveries);

        this.items.push(item)
      }
      this.setPages();
      this.paginate(this.ContryName);
    },
    setPages () {
      console.log('asmaa 111 111');

      let numberOfPages = Math.ceil(this.ContryName.length / this.perPage);
      for (let index = 1; index <= numberOfPages; index++) {
        this.pages.push(index);
      }
    },
    paginate (items: string | any[]) {
      // this.fillTable();
      let currentPage = this.currentPage;
      let perPage = this.perPage;
      let from = (currentPage * perPage) - perPage;
      let to = (currentPage * perPage);
      return  items.slice(from, to);
    },
    setNewData: function(){
     //  this.getCases2();
    },
  },

  created () {
    this.getCountry();
  },
  computed: {
    rows() {
      return this.ContryName.length
    }
  },
  mounted() {

  },
})
</script>

