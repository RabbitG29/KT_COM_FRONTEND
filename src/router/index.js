import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login'
import CodeList from '@/components/CodeList'
import CodeUploader from '@/components/CodeUploader'
import PostList from '@/components/PostList'
import PostViewer from '@/components/PostViewer'
import PostUploader from '@/components/PostUploader'
import HashTag from '@/components/HashTag'
import FollowPost from '@/components/FollowPost'

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
        },
        {
            path: '/postlist',
            name: 'PostList',
            component: PostList
        },
        {
            path: '/postviewer',
            name: 'PostViewer',
            component: PostViewer
        },
        {
            path: '/postuploader',
            name: 'PostUploader',
            component: PostUploader
        },
        {
            path: '/hashtag',
            name: 'HashTag',
            component: HashTag
        },
        {
            path: '/followpost',
            name: 'FollowPost',
            component: FollowPost
        }
    ],
    scrollBehavior (to, from, savedPosition) {
        return { x: 0, y: 0 } // 라우터 뷰 변화 시에 맨 위가 되도록
    }
})