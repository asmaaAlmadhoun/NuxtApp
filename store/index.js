import axios from 'axios';
import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      counter: 0,
      table: null,
      apiUrl: 'https://api.covid19api.com'
    },
    mutations: {
      SET_TABLE(state, message){
        state.table = message
      },
      increment (state) {
        state.counter++
      }
    },
    actions: {
      async nuxtServerInit({commit}) {
        const {body} = await axios.get(this.state.apiUrl+'https://api.covid19api.com/countries')
          .then(response => response.json())
        commit('SET_TABLE', body)
      },
    }
  })
}

export default createStore


