<template>
  <div class="hello" align="center">
    <tags-ball v-bind:style='{"border":"1px solid black"}' :width='1000' :tags='tags'/>
    <br>
     <br>
      <br>
    <div class="form-group row container" align="center">
    <div class="col-lg-0"></div>
      <div class="col-lg-4" id="content-box">
        <div class="card">
          <div class="card-header">
            <h4><b>📜 최근 게시글 </b></h4>
          </div>
          <div class="card-body" style="cursor: pointer">
            <router-link tag="div" class="form-group" v-for="(post, index) in posts" :key="index" :to="'/postviewer?postId='+post.게시글번호">
              <h5>{{index+1}}. {{post.제목}}({{post.게시판명}})</h5>{{post.이름}}({{post.부서명}})
            </router-link>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="card"  id="content-box">
          <div class="card-header">
            <h4><b>📃 HOT 게시글 </b></h4>
          </div>
          <div class="card-body" style="cursor: pointer">
            <router-link tag="div" class="form-group" v-for="(hot, index) in hots" :key="index" :to="'/postviewer?postId='+hot.게시글번호">
              <h5>{{index+1}}. {{hot.제목}}({{hot.게시판명}}) - 추천 : {{hot.추천수}}</h5>{{hot.이름}}({{hot.부서명}})
            </router-link>
          </div>
        </div>
      </div>
      <div class="col-lg-4"  id="content-box">
        <div class="card"  id="content-box">
          <div class="card-header">
            <h4><b>📃 최근 코드리뷰(전체공개) </b></h4>
          </div>
          <div class="card-body" style="cursor: pointer">
            <router-link tag="div" class="form-group" v-for="(code, index) in codes" :key="index" :to="'/codelist'">
              <h5>{{index+1}}. {{code.파일명}}</h5>{{code.이름}}({{code.부서명}})
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TagsBall from 'vue-tags-ball'
export default {
  name: 'HelloWorld',
  components: {
    "tags-ball":TagsBall
  },
  computed: {
        
    },
  props: {
    font: {
      type: String,
      default: "200px Olleh",
    },
    fontMax: {
      type: Number,
      default: 1200
    },
    radius: {
      type: Number,
      default: 1200
    }
  },
  created: function(){
    this.getCodes();
    this.getPosts();
    this.getHots();
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
      }
    },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      codes: [],
      posts: [],
      hots: [],
      tags: ["C++","Java","JavaScript","KT","SW아키텍처","SW개발단","Python","Dev-Ops","Agile","DB","node.js","Vue.js","React.js","Angular.js","Git","Jenkins","Spring","MySQL","Express.js"]
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
</style>
