import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      apiUrl: 'https://api.covid19api.com'
    }
  })
}

export default createStore


