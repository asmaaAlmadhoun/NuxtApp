<template>
    <div class="container p-5">
      <b-card title="COVID-19" sub-title="SPA">
        <b-card-text>
          Welcome at our application to track data about the COVID-19 virus.
        </b-card-text>
        <b-card-text>
          <b-input-group size="md" class="mb-2">
            <b-input-group-prepend is-text>
              <b-icon class="fa fa-search"></b-icon>
            </b-input-group-prepend>
            <b-form-input type="search" placeholder="Search for the country names"></b-form-input>
          </b-input-group>
        </b-card-text>

        <b-card-body>
          <b-table striped hover :items="items"></b-table>
        </b-card-body>
      </b-card>

    </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      items: [
        { Country_name: 40, num_active_cases: 'Dickerson', num_deaths: 'Macdonald', num_recoveries: 'Macdonald', TOTALS: 30 },
      ]
    }
  }
})
</script>

