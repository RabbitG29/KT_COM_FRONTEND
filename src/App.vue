<template>
  <div id="app">
      <div id="header">
            <div id="login-box">
                <div>
                    <img src="./assets/kt_ci2.png" width="40px" align="left"/>
                </div>
                <div id="login-menu">
                    <router-link v-if="!isLogged" to="Login"> 로그인 </router-link>
                    <span v-else>
                        <a href="" @click="logOut"> 로그아웃 </a>
                    </span>
                </div>
            </div>
            <div class="header">
                <div class="container">
                    <div class="row">
                        <div class=" col-sm-8 col-xs-8 container">
                            <div id="navigation">
                                  <h1><router-link to="/">KT SW Developers Community</router-link></h1>
                            </div>
                        </div>
                        <div id="nav-menu" class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                            <app-menu-navigation/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <sidebar-menu :menu="menu"/>
        <router-view/>
        <div id="footer">
            <small>ⓒ Copyright 2019 developed by 권동현 All Rights Reserved</small>
        </div>
    </div>
</template>

<script>
// TODO : 디폴트로 접혀있게 하려면 어떻게 해야하지?
import { SidebarMenu } from 'vue-sidebar-menu';
export default {
  name: 'App',
  components: {
    SidebarMenu
  },
  computed: {
       
    },
    watch: {
        
    },
    methods: {
       
    },
    data(){
        return {
             menu: [ // TODO : 아이콘 바꾸자
                {
                    href: '/',
                    title: '홈',
                    //icon: '@/assets/kt_ci2.png'
                    icon: {
                            element: 'span',
                            class: 'fa fa-user',
                            attributes: {},
                            text: '홈'
                        }
                },
                {
                    href: '/',
                    title: '게시판',
                    icon: {
                            element: 'span',
                            class: 'fa fa-user',
                            attributes: {},
                            text: '게'
                        }
                },
                {
                    href: '/',
                    title: '채팅',
                    icon: {
                            element: 'span',
                            class: 'fa fa-user',
                            attributes: {},
                            text: '채'
                        }
                },
                {
                    href: '/',
                    title: '코드 리뷰',
                    icon: {
                            element: 'span',
                            class: 'fa fa-user',
                            attributes: {},
                            text: '코'
                        }
                },
                {
                    href: '/',
                    title: '사이트맵',
                    icon: {
                            element: 'span',
                            class: 'fa fa-user',
                            attributes: {},
                            text: '사'
                        }
                },
            ]
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
    font-weight : normal;
    font-style : normal;
}
div {
 font-family: 'Olleh','NanumGothic';
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
    background-color: #BBDEFB;
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
    background: white;
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
    margin-top: 800px;
    padding: 10px;
    position: relative;
    background: rgb(220, 220, 220);
    color: black;
}
</style>
