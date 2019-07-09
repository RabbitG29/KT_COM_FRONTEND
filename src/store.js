import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate"
Vue.use(Vuex)
    /* eslint-disable */
export const store = new Vuex.Store({
    state: {

    },
    plugins: [createPersistedState()],
    getters: {

    },
    mutations: {

    }
});