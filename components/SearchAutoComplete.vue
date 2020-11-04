<template>
  <Autocomplete
    ref="autocomplete"
    placeholder="Search For Country"
    :source="this.countryName2"
    input-class="form-control"
    results-property="data">
  </Autocomplete>
</template>

<script>
  import Vue from 'vue';
  import Autocomplete  from 'vuejs-auto-complete'

  export default Vue.extend({
    components: {
      Autocomplete,
    }
  })
</script>
