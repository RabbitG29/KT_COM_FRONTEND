<template>
  <div class="container">
    <div class="unlogin-box container" v-show="!isLogged">
          <h1>KT Code-Cleaner</h1>
          <br>
        <div class="alert alert-warning" role="alert" >로그인이 필요합니다!</div>
        <router-link tag="a" :to="{name: 'Login'}">클릭 시 로그인페이지로 이동합니다</router-link><br><br>
        <button type="button" class="btn btn-outline-secondary" @click="$router.go(-1)">뒤로가기</button>
    </div>
    <div v-show="isLogged">
      <div class="board-box container">
        <button type="button" :disabled="this.title=='' || this.content==''" class="btn btn-outline-primary" style="float:right" @click.prevent="submitPost">{{mode=='create'?'등록':'수정'}}</button>
        <button type="button" class="btn btn-outline-secondary" style="float:right" @click="$router.go(-1)">뒤로가기</button>
        <form>
          <div class="form-group row container">
            <div class="col-lg-8" id="content-box">
              <b-form-select v-model="categoryId" class="mb-10" id="category" >
                <option v-for="(category, index) in categories" :key="index" :value="category.카테고리번호" >{{category.카테고리명}}</option>
              </b-form-select>
            </div>
          <div class="col-lg-4" id="content-box">
            <input type="file" ref="file" id="files" class="form-control-file" @change="fileChanges">
          </div>
        </div>
        </form>
        <form>
          <div class="form-group">
            <input v-model="title" class="form-control" id="exampleFormControlInput1" placeholder="title">
          </div>
          <div class="form-group">
            <textarea class="md-text" rows="10" v-model="content" placeholder="content(markdown)"/>
            <br>
              <vue-tags-input v-if="this.mode=='create'" id="tagtag" v-model="tag" :tags="tags" @tags-changed="newTags => tags = newTags"/>
            <br>
            <h2>Markdown Preview</h2>
            <br>
            <markdown-it-vue class="md-body" :content="content" :options="options" />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
//import { Editor } from 'vuetify-markdown-editor';             
//<Editor ref="editor" :outline="true" :preview="true" v-model="content" />
import MarkdownItVue from 'markdown-it-vue'
import VueTagsInput from '@johmun/vue-tags-input';
import 'markdown-it-vue/dist/markdown-it-vue.css'
export default {
name: 'PostUploader',
components: {
//    Editor
  MarkdownItVue,
  VueTagsInput
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
    this.getCategories();
    if(this.mode=='edit') {
      this.postId = this.$route.query.postId;
      this.getTags();
   //   console.log(this.postId);
          this.$http.get(this.$config.targetURL+'/board/post/view?postId='+this.postId)
          .then(r=>{
           // console.log(r.data.result);
            if(r.data.status == 'success'){
              var result = JSON.parse(r.data.result)[0]
           //   console.log(result);
              this.title = result.제목
              this.writer = result.이름
              this.content = result.내용
              this.id = result.게시글번호
              this.writerID = result.작성자
              this.categoryId = result.소속카테고리
            }
          })
          .catch(e=>{
            console.log(e)
            this.$notice({
                type: 'error',
                text: '서버에 오류가 있습니다.'
            })
          })
    }
},
methods: {
        fileChanges: function(e){
       //   console.log(e)
          var file = e.target.files[0]
          this.file1 = file;
        },
        getCategories: function() {
          var url = this.$config.targetURL+'/board/categories/';
          this.$http.get(url)
          .then(r=>{
            if(r.data.status=="success") {
              this.categories = JSON.parse(r.data.result);
         //     console.log(this.categories);
            }
          })
        },
        getTags: function() {
          var url = this.$config.targetURL+'/tags/bypost?postId='+this.postId;
          this.$http.get(url)
          .then(r=>{
            if(r.data.status=='success') {
              var results = JSON.parse(r.data.result);
              for(var i=0;i<results.length;i++) {
                this.tags.push(results[i].태그명);
              }
            }
          })
        },
        submitPost: function() {
          if(this.mode == 'create'){
            var url = this.$config.targetURL+'/board/post/';
            var submitTags = [];
            for(var i=0;i<this.tags.length;i++) {
              submitTags.push(this.tags[i].text);
            }
            var json = {
              writer: this.getId,
              content: this.content,
              categoryId: this.categoryId,
              title: this.title,
              boardId: this.boardId,
              tags: submitTags
            }
         //   console.log(this.boardId)
            var formData = new FormData()
            formData.append('information', JSON.stringify(json))
            formData.append('userfile', this.file1)
            this.$http.post(url, formData)
            .then(result=>{
              console.log('success!')
              this.$notice({
                type: 'success',
                text: '글 등록이 성공적으로 완료되었습니다.'
              })
              this.$router.go(-1)
            })
            .catch(error=>{
                console.log(error)
            this.$notice({
                type: 'error',
                text: '서버에 오류가 있습니다.'
            })
              })
          }
          else {
            var url2 = this.$config.targetURL+'/board/post/';
            var json2 = {
              content: this.content,
              title: this.title,
              postId: this.postId,
              categoryId: this.categoryId
            }
            var formData2 = new FormData()
            formData2.append('information', JSON.stringify(json2))
            formData2.append('userfile', this.file1)
            this.$http.put(url2, formData2)
            .then(result=>{
              console.log('success!')
              this.$notice({
                type: 'success',
                text: '글 수정이 성공적으로 완료되었습니다.'
              })
              this.$router.go(-1)
            })
            .catch(error=>{
                console.log(error)
            this.$notice({
                type: 'error',
                text: '서버에 오류가 있습니다.'
            })
              })
          }
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
        file1: '',
        content: '',
        writerID:'',
        categoryId:1,
        categories: [],
        tag: '',
        tags: [],
        list: [],
        options: {
        markdownIt: {
          linkify: true
        },
        linkAttributes: {
          target: '_blank',
          rel: 'noopener'
        }, 
      }
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

.md-text {
 width: 100%;
}
.md-body {
  width: 100%;
}
</style>
