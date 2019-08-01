<template>
  <div class="container">
    <div class="card">
      <div class="card-header">
        <div class="container" id="post-box">
          <h3 font-style="bold" v-html="title"></h3>
          <h5>작성자 : {{writer}}</h5>
          <h5><small class="text-right">{{writetime}}(추천수 : {{thumbsup}})</small></h5>
          <div id="edit-box">
            <div v-show="isLogged && getId == writerID">
              <button type="button" class="btn btn-primary" style="cursor: pointer" @click.prevent="editLog">수정</button>
              <button type="button" class="btn btn-danger" style="cursor: pointer" @click.prevent="deleteLog">삭제</button>
            </div>
          </div>
        </div>
      </div>
      <div class="card-body">
    <!--    <h5 class="card-title">Special title treatment</h5> -->
        <div class="card-text">
            <markdown-it-vue class="md-body" :content="content" />
        </div>
        <br>
        <div>
          <a v-if="filename" :href="path">첨부파일 다운로드 ({{filename}})</a>
          <br v-if="filename">
        </div>
        <button type="button" class="btn btn-primary" style="float:right cursor: pointer" @click.prevent="goBack">추천하기</button>
        <button type="button" class="btn btn-secondary" style="float:right cursor: pointer" @click.prevent="goBack">뒤로가기</button>
      </div>
    </div>
    <br>

        <!--댓글작성-->
    <div v-if="isLogged" class="list-group col-sm-12">
      <div id="comment-post-box">
      <textarea v-model="comment" class="form-control"  placeholder="Comment" rows="3"></textarea>
      <button type="button" class="btn btn-primary" style="cursor: pointer" @click.prevent="commentEroll">댓글작성</button>
      </div>
    </div>

    <!--댓글 보이기-->
    <div class="row" id="comment">
      <div class="col-sm-2"></div>
      <div class="list-group col-sm-12">
        <div class="text-left card comment-card"
        v-for="(item, index) in list" :key="index+item.mode">
            <div class="card-body" id="comment-box">
              <h5 class="comment-writer">{{item.이름}}
                <sub class="comment-timestamp" style="color: #5cb85c">{{item.작성시각}}</sub>
              </h5>
              <br>
              <h6 v-if="item.mode == 'view'">{{item.내용}}</h6>
              <h6 v-else><textarea class="form-control" v-model="item.내용"></textarea></h6>

              <div class="row" id="edit-box">
                <div v-show="getId==item.작성자">
                  <button v-if="item.mode == 'edit'" type="button" class="btn btn-light btn-sm" style="cursor: pointer" @click="changeCommentMode(index)">취소</button>
                  <button v-if="item.mode == 'view'" type="button" class="btn btn-light btn-sm" style="cursor: pointer" @click="changeCommentMode(index)">수정</button>
                  <button v-else type="button" class="btn btn-light btn-sm" style="cursor: pointer" @click.prevent="editComment(item)">확인</button>
                  <button type="button" class="btn btn-light btn-sm" style="cursor: pointer" @click.prevent="deleteComment(item.댓글번호)">삭제</button>
                </div>

              </div>
            </div>
        </div>
      </div>
      <div class="col-sm-2"></div>
    </div>
  </div>
</template>

<script>
// TODO : Markdown Viewer 적용하기 https://github.com/markdown-it/markdown-it 
import MarkdownItVue from 'markdown-it-vue'
import 'markdown-it-vue/dist/markdown-it-vue.css'
export default {
  components: {
    MarkdownItVue
  },
  name: 'HelloWorld',
  mounted: function() {
      this.postId = this.$route.query.postId;
      this.getData();
      this.getComment();
  },
  computed: {
    isLogged: function(){
      return this.$store.getters.isLogged
    },
    getId(){
      return this.$store.getters.getId
    }
  },
  methods: {
    goBack: function(){
      this.$router.go(-1)
    },
    changeCommentMode: function(index){
      if(this.list[index].mode == 'view')
        this.list[index].mode = 'edit'
      else
        this.list[index].mode = 'view'
      this.$forceUpdate()
    },
    getComment: function(){
      this.$http.get(this.$config.targetURL+'/board/comment?postId='+this.postId)
      .then(result=>{
          console.log(result)
          console.log(result.data.status)
          this.list = JSON.parse(result.data.result)
          console.log(this.list);
          this.list.forEach(v=>{
            var ct = v.작성시각
            console.log(ct)
            v.작성시각 = this.$moment(ct).tz('Asia/Seoul').format('YYYY년 M월 D일 h시 m분')
            v.mode = 'view'
          })
      })
      .catch(error=>{
          console.log('서버에러')
          this.$notice({
                type: 'alert',
                text: '서버에 오류가 있습니다.'
            })
      })
    },
    commentEroll : function(){
     var url = this.$config.targetURL+'/board/comment';
     var json = {
       postId: this.postId,
       content: this.comment,
       writer: this.getId
     }
     this.$http.post(url, json)
     .then(result=>{
       if(result.data.status == 'success'){
         this.getComment()
         this.comment = ''
         this.$notice({
           type: 'success',
           text: '댓글 등록이 성공적으로 완료되었습니다.'
         })
       }
     })
     .catch(error=>{
         console.log('서버에러')
         this.$notice({
                type: 'alert',
                text: '서버에 오류가 있습니다.'
            })
       })
    },
    deleteComment : function(commentId){
      this.$http.delete(this.$config.targetURL+'/board/comment?commentId='+commentId)
      .then(result=>{
        if(result.data.status == 'success'){
          console.log('삭제성공')
          this.getComment()
          this.$notice({
            type: 'success',
            text: '삭제가 성공적으로 완료되었습니다.'
          })
        }
      })
      .catch(error=>{
        console.log('서버에러')
        this.$notice({
                type: 'alert',
                text: '서버에 오류가 있습니다.'
            })
      })
    },
    editComment : function(item){
      var commentId = item.댓글번호
      var comment = item.내용
      console.log(commentId + '  ' +comment)
      var url = this.$config.targetURL+'/board/comment';
      var json = {
        commentId: commentId,
        content: comment
      }
      this.$http.put(url, json)
      .then(result=>{
        if(result.data.status == 'success'){
          console.log('수정성공')
          this.getComment()
          this.$notice({
            type: 'success',
            text: '수정이 성공적으로 완료되었습니다.'
          })
        }
      })
      .catch(error=>{
        console.log('서버에러')
      })
    },
    getData: function() {
      this.$http.get(this.$config.targetURL+'/board/post/view?postId='+this.postId)
    .then(r=>{
      if(r.data.status == 'success'){
        var result = JSON.parse(r.data.result)[0]
        console.log(result)
        this.title = result.제목
        this.writer = result.이름
        this.writetime = this.$moment(result.작성시각).tz('Asia/Seoul').format('YYYY년 M월 D일 h시 m분')
        this.writerID = result.작성자
        this.content = result.내용
        this.thumbsup = result.추천수
        this.filename = path.basename(result.첨부파일경로||'')
      }
    })
    .catch(e=>{
        this.$Progress.fail()
    })
    this.path = this.$config.targetURL+'/board/post/download?postId='+this.id // 만들어야댐
    }
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      postId: '',
      content: '# your markdown content',
      title : '',
      writer: '',
      writerID: '',
      context: '',
      writetime: '',
      comment: '',
      path: '',
      id: '',
      thumbsup: '',
      filename: '',
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
#mobile-comment {
  width: 100%;
}
#comment-box #edit-box {
  position: absolute;
  bottom: 15px;
  right: 30px;
}
#comment-post-box button {
  position: absolute;
  top: 35px;
  right: 30px;
}
#comment-post-box {
  margin-top: 15px;
  margin-bottom: 15px;
}
#comment-box {
  margin-top: 10px;
  margin-bottom: 10px;
}
.comment-card:hover {
  background-color: rgb(241,241,241);
  transition-duration: 0.3s;
}
.comment-writer {
  margin-left: 5px;
}
.comment-timestamp {
  position: absolute;
  top: 40px;
  right: 30px;
}
.board-box{
  margin-left: 150px;
  margin-right: 150px;
  margin-top: 80px;
}
#mobile-edit-box {
  position: absolute;
  bottom: 9px;
  right: 9px;
}
#post-box #edit-box {
  position: absolute;
  top: 20px;
  right: 20px;
}
.list-group .card {
  margin: 5px;
}
.card{
  margin-bottom:10px;
}
#comment{
  width: 100%;
}
@media (min-width: 999px){
    #comment {
        display: inline-block;
    }
    #mobile-comment{
        display: none;
    }
}
@media (max-width: 1000px){
    #comment {
        display: none;
    }
    #mobile-comment{
        display: inline-block;
    }
}
</style>
