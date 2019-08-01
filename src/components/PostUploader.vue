<template>
  <div class="container">
    <h1>ㅎㅇ{{this.boardId}}</h1>
    <div v-show="isLogged">
      <div class="board-box container">
        <button type="button" class="btn btn-outline-primary" style="float:right" @click.prevent="submitLog">{{mode=='create'?'등록':'수정'}}</button>
        <button type="button" class="btn btn-outline-secondary" style="float:right" @click="$router.go(-1)">뒤로가기</button>
        <form>
          <div class="form-group">
            <input type="file" ref="file" id="files" class="form-control-file" @change="fileChanges">
          </div>
        </form>
        <form>
          <div class="form-group">
            <input v-model="title" class="form-control" id="exampleFormControlInput1" placeholder="title">
          </div>
          <div class="form-group">
            <Editor ref="editor" :outline="true" :preview="true" v-model="content" />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { Editor } from 'vuetify-markdown-editor';

export default {
name: 'PostUploader',
components: {
    Editor
},
computed: {
        isLogged: function() {
            return this.$store.getters.isLogged
        },
        getId() {
            return this.$store.getters.getId
        }
},
mounted: function() {
    this.boardId = this.$route.query.boardId;
    this.mode = this.$route.query.mode;
    if(this.mode=='edit') {
          this.$http.get(this.$config.targetURL+'/board/post/view?postId='+this.postId)
          .then(r=>{
            if(r.data.status == 'success'){
              var result = JSON.parse(r.data.result)
              this.title = result.제목
              this.writer = result.이름
              this.content = result.내용
              this.id = result.게시글번호
              this.writerID = result.작성자
            }
          })
          .catch(e=>{
          })
    }
},
methods: {
        fileChanges: function(e){
          console.log(e)
          var file = e.target.files[0]
          this.file1 = file;
        }
},
data () {
    return {
        msg: 'Welcome to Your Vue.js App',
        boardId: '',
        writer: '',
        mode: '',
        title: '',
        postId: '',
        cursorPos: '',
        boardId: '',
        file1: '',
        content: '',
        mode: '',
        writerID:'',
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
