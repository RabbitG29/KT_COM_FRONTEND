import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import CodeList from '@/components/CodeList'
import CodeUploader from '@/components/CodeUploader'


Vue.use(Router)

export default new Router({
    routes: [
        {
        path: '/',
        name: 'HelloWorld',
        component: HelloWorld
        },
        {
            path: '/login',
            name: 'Login',
            component: Login
        },
        {
            path: '/codelist',
            name: 'CodeList',
            component: CodeList
        },
        {
            path: '/codeuploader',
            name: 'CodeUploader',
            component: CodeUploader
        }
    ]
})