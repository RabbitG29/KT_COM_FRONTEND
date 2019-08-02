<template>
  <div class="container">
      <h1>{{this.boardName}}</h1>
      <div id="board">
      <div class="board-box">
      <div v-show="isLogged" class="row form-group">
        <div class="col-sm-10"></div>
        <div class="col-sm-2" >
          <button type="button" class="btn btn-secondary"
        @click="createPost()">글 등록</button>
        </div>
      </div>
      <div class="row">
          <!-- print meeting log list -->
          <table class="table table-striped">
            <thead>
               <tr class="text-center">
                <th class="text-center" scope="col">#</th>
                 <th class="text-center">카테고리</th>
                <th class="text-center">작성자</th>
                <th class="text-center">제목</th>
                <th class="text-center">작성일시</th>
                <th class="text-center">추천수</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in list" @click="readPost(item)" :key="index" style="cursor: pointer">
                <td scope="col">{{index+1}}</td>
                <td>{{item.카테고리명}}</td>
                <td>{{item.이름}}</td>
                <td width=500>{{item.제목}}</td>
                <td>{{item.writetime}}</td>
                <td width=100>{{item.추천수}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  mounted: function() {
    this.boardId = this.$route.query.boardId;
    this.boardName = this.$route.query.boardName;
    console.log(this.boardId);
    this.getData()
  },
  watch: {
      $route: function(to, from){
        this.boardId = this.$route.query.boardId
        this.boardName = this.$route.query.boardName;
        console.log('현재 게시판 번호 : '+this.boardId)
        this.getData()
      }
  },
  computed: {
        
    },
  methods: {
        getData: function(){
            var url = this.$config.targetURL+'/board/post?boardId='+this.boardId
            console.log(url)
            this.$http.get(url)
            .then(result=>{
                //console.log(result)
                console.log(JSON.parse(result.data.result))
                this.list = JSON.parse(result.data.result)
                //console.log(list)
                this.boardName = this.list[0].게시판명;
                this.list.forEach(v=>{
                  var dateinfo = v.작성시각
                  v.writetime = this.$moment(dateinfo).tz('Asia/Seoul').format('YYYY년 M월 D일 H시 m분')
                })
            })
            .catch(error=>{
                console.log('서버에러')
                
            })
        },
        createPost: function() {
            this.$router.push({
                name: 'PostUploader',
                query: {
                    boardId: this.boardId,
                    mode: 'create'
                }
            })
        },
        readPost: function(item) {
            this.$router.push({
                name: 'PostViewer',
                query: {
                    postId: item.게시글번호
                }
            })
        }
    },
    data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      boardId: '',
      boardName: '',
      list: []
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
</style>
