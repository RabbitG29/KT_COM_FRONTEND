<template>
  <div id="app">
      <div id="header">
                <div id="login-menu" style="margin-top: 5px;">
                    <router-link v-if="!isLogged" to="Login"> 로그인 </router-link>
                    <span v-else>
                        <a>안녕하세요 {{getName}}님</a>
                        <a href="" @click="logOut"> 로그아웃 </a>
                    </span>
                </div>
        </div>
        <!-- 사이드 바 -->
        <sidebar-menu @collapse="onToggleCollapse" v-bind:style=" isCallapsed ? 'width: 2.5%;' : 'width: 15%'" :menu="menu" :collapsed="collapsed" @item-click="onItemClick" id="sidebar">
            <span slot="collapse-icon">↔</span>
            <span slot="dropdown-icon">▶</span>
        </sidebar-menu>
        <br><br>
        <div style="margin-left: auto; margin-right: auto;">
        <router-view v-bind:style=" !isCallapsed ? 'transform: translateX(10%);' : ''" style="margin-bottom: 50px;" />
        </div>
    </div>
</template>

<script>
// TODO : 디폴트로 접혀있게 하려면 어떻게 해야하지? -> 해결
import { SidebarMenu } from 'vue-sidebar-menu';
import customIcon from 'vue-icon/lib/vue-feather.esm'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'

export default {
  name: 'App',
  components: {
    SidebarMenu,
    customIcon
  },
  computed: {
        isLogged: function() {
            return this.$store.getters.isLogged
        },
        getId() {
            return this.$store.getters.getId
        },
        getName() {
            return this.$store.getters.getName
        }
    },
    watch: {
        
    },
    methods: {
        logOut: function() {
            this.$store.commit('logOut')
        },
        onToggleCollapse: function(collapsed) {
            console.log(collapsed);
            this.isCallapsed=collapsed;
        },
       onItemClick(event, item) { // 여기서 메뉴 선택 시 분기해서 처리 가능
            if(item.title=='kt.com')
                window.open("http://www.kt.com","new page");
            else if(item.title=='설문조사')
                window.open("https://form.office.naver.com/form/responseView.cmd?formkey=NTcxNGU4ZmMtMDIxYy00NTQxLWIxYmQtMjVkYjJmN2MyNDQ1&sourceId=urlshare","new page");
            else if(item.title=='보안취약점 가이드')
                window.open("https://wiki.sei.cmu.edu/confluence/display/c/SEI+CERT+C+Coding+Standard", "new page");
            else if(item.title=='공지사항') {
                this.$router.push({
                    name: 'PostList',
                    query: { boardId:1, boardName:item.title }
                })
            }
            else if(item.title=='자유게시판') {
                this.$router.push({
                    name: 'PostList',
                    query: { boardId:2, boardName:item.title }
                })
            }
            else if(item.title=='Q&A') {
                this.$router.push({
                    name: 'PostList',
                    query: { boardId:3, boardName:item.title }
                })
            }
            else if(item.title=='지식 공유') {
                this.$router.push({
                    name: 'PostList',
                    query: { boardId:4, boardName:item.title }
                })
            }
            else if(item.title=='내 코드') {
                this.$router.push({
                    name: 'CodeList',
                    query: { mode:1 }
                })
            }
            else if(item.title=='부서 코드') {
                this.$router.push({
                    name: 'CodeList',
                    query: { mode:2 }
                })
            }
            else if(item.title=='전체 코드') {
                this.$router.push({
                    name: 'CodeList',
                    query: { mode:3 }
                })
            }
       }
    },
    data(){
        return {
            baseClass: 'v-icon',
            isCallapsed: false, // 메뉴가 접혔을 때 margin 조절을 위해서 접혔는지 여부 체크
             menu: [ // TODO : 아이콘 바꾸자 -> 해결
                {
                    href: '/',
                    title: 'KT Code Cleaner',
                    icon: 'fa fa-home'
                },
                {
                    header: true,
                    title: '게시판',
                },
                        {
                            href: '/postlist?boardId=1&boardName=%EA%B3%B5%EC%A7%80%EC%82%AC%ED%95%AD',
                            query: 'boardId=1',
                            title: '공지사항',
                            icon: 'fa fa-flag',
                        },
                        {
                            href: '/postlist?boardId=2&boardName=%EC%9E%90%EC%9C%A0%EA%B2%8C%EC%8B%9C%ED%8C%90',
                            title: '자유게시판',
                            icon: 'fa fa-comments',
                        },
                        {
                            href: '/postlist?boardId=3&boardName=Q%26A',
                            title: 'Q&A',
                            icon: 'fa fa-question-circle',
                        },
                        {
                            href: '/postlist?boardId=4&boardName=%EC%A7%80%EC%8B%9D%20%EA%B3%B5%EC%9C%A0',
                            title: '지식 공유',
                            icon: 'fa fa-exclamation',
                },
                {
                    header: true,
                    title: '코드 리뷰',
                },
                        {
                            href: '/codelist?mode=1',
                            title: '내 코드',
                            icon: 'fa fa-user',
                        },
                        {
                            href: '/codelist?mode=2',
                            title: '부서 코드',
                            icon: 'fa fa-users',
                        },
                        {
                            href: '/codelist?mode=3',
                            title: '전체 코드',
                            icon: 'fa fa-code',
                },
                {
                    header: true,
                    title: '검색',
                },
                                {
                    title: '태그검색',
                    icon: 'fa fa-search',
                    href: '/hashtag'
                },
                {
                    title: '구독 게시글',
                    icon: 'fa fa-newspaper',
                    href: '/followpost'
                },
                {
                    header: true,
                    title: '사이트맵',
                },
                        {
                            //href: 'http://www.kt.com',
                            title: 'kt.com',
                            icon: 'fa fa-hashtag',
                        },
                        {
                            //href: 'http://www.kt.com',
                            title: '설문조사',
                            icon: 'fa fa-hashtag',
                        },
                        {
                            title: '보안취약점 가이드',
                            icon: 'fa fa-hashtag',
                        }

            ],
            collapsed: false,
        }
    }
}
</script>

<style>
@import './assets/noty.css';
@import '../node_modules/vue-wysiwyg/dist/vueWysiwyg.css';

@import url(//fonts.googleapis.com/earlyaccess/nanumgothic.css);
@font-face {
  font-family: 'NanumGothic' ;
  src:url(//fonts.gstatic.com/ea/nanumgothic/v5/NanumGothic-Regular.eot);
  src:url(//fonts.gstatic.com/ea/nanumgothic/v5/NanumGothic-Regular.eot?#iefix) format('embedded-opentype'),
      url(//fonts.gstatic.com/ea/nanumgothic/v5/NanumGothic-Regular.woff2) format('woff2'),
      url(//fonts.gstatic.com/ea/nanumgothic/v5/NanumGothic-Regular.woff) format('woff'),
      url(//fonts.gstatic.com/ea/nanumgothic/v5/NanumGothic-Regular.ttf) format('truetype');
  font-weight : normal;
  font-style : normal;
}
@font-face {
    font-family: 'Olleh';
    src:url('assets/Droid-Sans-Fallback.ttf') format('truetype');
    font-weight : 700;
    font-style : normal;
}
div {
 font-family: 'Olleh','NanumGothic';
 font-weight: 700;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

}

</style>
<style scoped>
@media (min-width: 999px){
    #nav-menu {
        display: inline-block;
    }
}

@media (max-width: 1000px){
    #nav-menu {
        display: none;
    }
}
#login-box {
    position: fixed;
    z-index: 10000;
    width: 100%;
    height: 30px;
    background-color: rgb(42, 42, 46);
    
}
#login-menu {
    float: right;
    margin-right: 10px;
    margin-bottom: 5px;
    font-size: 15px;
    display: relative;
    color: black;
    z-index: 10;
}
a {
    margin-left: 5px;
}
#login-menu a {
    color: black;
}

#main-menu {
    background: black;
}

#main-menu a {
    box-sizing: border-box;
    width: 110px;
    color: black;
    background: white;
}
.header {
    background-color: #fff;
    z-index: 99;
    position: relative;
    padding-top: 50px;
    padding-bottom: 20px;
}
#footer {
    margin-top: 20%;
    padding: 10px;
    position: relative;
    background: rgb(220, 220, 220);
    color: black;
}
.v-sidebar-menu .vsm-arrow:after {
    content: '\f105';
    font-family: 'Font Awesome 5 Free';
}

.v-sidebar-menu .collapse-btn:after {
    content: '\f337';
    font-family: 'Font Awesome 5 Free';
}
.sidebar.v-sidebar-menu .vsm-arrow:after {
  content: '\f105';
  font-family: 'FontAwesome';
}

.sidebar.v-sidebar-menu .collapse-btn:after {
  content: '\f07e';
  font-family: 'FontAwesome';
}

</style>
