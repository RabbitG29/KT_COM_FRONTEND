import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate"
Vue.use(Vuex)
    /* eslint-disable */
export const store = new Vuex.Store({
    state: {
        isLogged: false
    },
    plugins: [createPersistedState()],
    getters: {
        isLogged: function(state){
            return state.isLogged
        }
    },
    mutations: {

    }
});