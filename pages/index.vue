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
      headers: ['index','Country_name', 'no_active_cases', 'no_deaths', 'no_recoveries', 'TOTALS'],
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
      currentDate : new Date().toISOString(),

    }
  },
  methods: {
    async getCountry() {
      const result = await axios.get(this.$store.state.apiUrl+'/countries',this.config);
      this.ContryName = result.data.map((country: { Country: any; }) => ({
        name: country.Country,
      }));
      for(let i = 0; i< this.perPage ;i++) {
        this.getCases(this.ContryName[i].name);
      }
      setTimeout(()=> {this.fillTable()},1000)

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
        console.log(ActiveNum)

        let item = {
          active: ActiveNum,
          seaths: DeathsNum,
          recovered: RecoverdNum,
        }
        this.States.push(item);

      } catch (err) {
        console.log(err.message)
      }


    },
    fillTable: function () {
      for(let i = 0; i< this.perPage;i++){
        let item = { index: 0,Country_name: '', no_active_cases: 'Dickerson', no_deaths: 'Macdonald',
          no_recoveries: 'Macdonald', TOTALS: 30 };
        item.index = i ;
        item.Country_name = this.ContryName[i].name;
        console.log(this.States)
        item.no_active_cases = this.States[i].active;
        item.no_deaths = this.States[i].seaths;
        item.no_recoveries = this.States[i].recovered;


        this.items.push(item)
      }
      this.setPages();
      this.paginate(this.ContryName);
    },
    setPages () {
      let numberOfPages = Math.ceil(this.ContryName.length / this.perPage);
      for (let index = 1; index <= numberOfPages; index++) {
        this.pages.push(index);
      }
    },
    paginate (items: string | any[]) {
      let currentPage = this.currentPage;
      let perPage = this.perPage;
      let from = (currentPage * perPage) - perPage;
      let to = (currentPage * perPage);
      return  items.slice(from, to);
    }
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

