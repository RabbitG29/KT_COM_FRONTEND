import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate"
import { satisfies } from 'semver';
Vue.use(Vuex)
    /* eslint-disable */
export const store = new Vuex.Store({
    state: {
        isLogged: false,
        id: '',
        token: '',
        name: '',
        deptId: ''
    },
    plugins: [createPersistedState()],
    getters: {
        isLogged: function(state){
            return state.isLogged
        },
        getId: function(state){
            return state.id
        },
        getName: function(state){
            return state.name
        },
        getDeptId: function(state) {
            return state.deptId
        }
    },
    mutations: {
        logIn: function(state, payload){
            state.isLogged = true
            state.id = payload.id
            state.name = payload.name
            state.deptId = payload.deptId
        },
        logOut: function(state, payload){
            state.isLogged = false
            state.id = ''
            state.name=''
            state.deptId=''
        }
    }
});