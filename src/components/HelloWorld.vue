<template>
  <div class="container" align="center">
    <go-top></go-top>
    <div class="form-group row container" align="center" style=" text-align: center;">
      <div class="col-lg-4" id="img">
        <img src="../assets/kt_home.png" style="max-width: 100%; height: auto;">
      </div>
      <div class="col-lg-8" id="content-box">
        <div class="card">
          <div class="card-body" style="text-align: left;" >
            <h3 style="text-align: center;">More Clean, Code-Cleaner</h3><br>
            <h4>코드는 깔끔하게,
            개발은 Agile하게,
            성능은 더 높게</h4>
            <h5>더 빠르고 좋은 개발을 위한
            KT 소프트웨어개발단의 커뮤니티입니다.</h5>
            <br>
          </div>
        </div>
      </div>
    </div>
    <br>
    <div class="form-group row container" align="center">
      <div class="col-lg-12" id="content-box">
        <div class="card">
          <div class="card-body" style="text-align: center; background-color: rgb(42, 42, 46); color: white; padding: 50px" >
            <h3>KT Code-Cleaner에 오신 것을 환영합니다</h3>
          </div>
        </div>
      </div>
    </div>
    <br>
    <div class="form-group row container" align="center">
      <div class="col-lg-4">
        <div class="card"  id="content-box">
          <div class="card-header" style="text-align: center;">
            <h6><b>📜 HOT 게시글 </b></h6>
          </div>
          <div class="card-body" style="cursor: pointer">
            <router-link tag="div" class="form-group" v-for="(hot, index) in hots" :key="index" :to="'/postviewer?postId='+hot.게시글번호">
              {{index+1}}. {{hot.제목}}({{hot.추천수}}추천)
            </router-link>
          </div>
        </div>
      </div>
      <div class="col-lg-4" id="content-box">
        <div class="card">
          <div class="card-header" style="text-align: center;">
            <h6><b>📜 HOT 코드리뷰 </b></h6>
          </div>
          <div class="card-body" style="cursor: pointer">
            <router-link  tag="div" class="form-group" v-for="(code, index) in codes2" :key="index" :to="'/codelist'">
              {{index+1}}. {{code.파일명}} - {{code.이름}}
            </router-link>
          </div>
        </div>
      </div>
      <div class="col-lg-4" id="content-box">
        <div class="card">
          <div class="card-header" style="text-align: center;">
            <h6><b>📜 HOT 태그 </b></h6>
          </div>
          <div class="card-body" style="cursor: pointer">
            <router-link style="text-align: left;" tag="div" class="form-group" v-for="(tag, index) in tags2" :key="index" :to="{name:'HashTag', query: {tag:tag.태그명}}" >
              {{index+1}}. {{tag.태그명}}({{tag.태그횟수}}회) <br>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TagsBall from 'vue-tags-ball'
import GoTop from '@inotom/vue-go-top';
export default {
  name: 'HelloWorld',
  components: {
    "tags-ball":TagsBall,
    GoTop
  },
  computed: {
        
    },
  props: {
    font: {
      type: String,
      default: "200px Olleh",
    },
  },
  created: function(){
    this.getCodes();
    this.getPosts();
    this.getHots();
    this.getTags();
    this.getCodes2();
  },
  methods: {
        getCodes: function() {
          this.$http.get(this.$config.targetURL + '/review/recent')
          .then(r=>{
          if(r.data.status == 'success'){
            console.log(r)
            this.codes = JSON.parse(r.data.result)
          }
        })
      },
      getCodes2: function() {
          this.$http.get(this.$config.targetURL + '/review/many')
          .then(r=>{
          if(r.data.status == 'success'){
            console.log(r)
            this.codes2 = JSON.parse(r.data.result)
          }
        })
      },
      getPosts: function() {
          this.$http.get(this.$config.targetURL + '/board/post/recent')
          .then(r=>{
          if(r.data.status == 'success'){
            console.log(r)
            this.posts = JSON.parse(r.data.result)
          }
        })
      },
      getHots: function() {
          this.$http.get(this.$config.targetURL + '/board/post/hot')
          .then(r=>{
          if(r.data.status == 'success'){
            console.log(r)
            this.hots = JSON.parse(r.data.result)
          }
        })
      },
      getTags: function() {
        this.$http.get(this.$config.targetURL + '/tags/liketag')
        .then(r=>{
          if(r.data.status == 'success') {
            console.log(r)
            this.tags2 = JSON.parse(r.data.result)
            for(var i=0;i<this.tags2.length;i++) {
              this.tags.push(this.tags2[i].태그명);
            }
            console.log(this.tags);
          }
        })
      }
    },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      codes: [],
      codes2: [],
      posts: [],
      hots: [],
      tags2: [],
      tags: []
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
    src:url('../assets/Droid-Sans-Fallback.ttf') format('truetype');
    font-weight : normal;
    font-style : normal;
}
div {
 font-family: 'Olleh','NanumGothic';
}
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.hello {
    vertical-align: middle;
}
.form-group {
  text-align: left;
}
.card-body {
  font-size: 13px;
}
</style>
