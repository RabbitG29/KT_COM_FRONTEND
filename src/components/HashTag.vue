<template>
  <div class="container">
    <h2>Search by HashTag</h2><br>
    <div class="row form-group">
        <div class="col-sm-2"/>
        <label class="col-sm-1">태그 검색</label>
        <div class="col-sm-2">
        <b-form-select v-model="searchMode" class="mb-3">
          <option value="0" >게시판</option>
          <option value="1">코드</option>
        </b-form-select>
        </div>
        <div class="col-sm-5">
          <vue-tags-input id="tagtag" v-model="tag" :tags="tags" @tags-changed="newTags => tags = newTags"/>
        </div>
        <div class="col-sm-1">
          <button class="btn btn-sm btn-primary" @click.prevent="getData">검색</button>
        </div>
    </div>
    <div id="board">
        <div class="board-box">
            <div v-if="searchMode==0">
                <div class="row">
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
                            <tr v-for="(item, index) in posts" @click="readPost(item)" :key="index" style="cursor: pointer">
                                <td scope="col">{{index+1}}</td>
                                <td>{{item.카테고리명}}</td>
                                <td>{{item.이름}}</td>
                                <td width=400>{{item.제목}}</td>
                                <td>{{item.writetime}}</td>
                                <td width=100>{{item.추천수}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div v-else>
                <div class="row"> 
          <!-- 코드 리스트 출력 -->
          <table class="table table-striped">
            <thead>
               <tr class="text-center">
                <th class="text-center" scope="col">#</th>
                <th class="text-center">작성자</th>
                <th class="text-center">부서</th>
                <th class="text-center">코드</th>
                <th class="text-center">작성일시</th>
                <th class="text-center">다운로드/삭제</th>
              </tr>
            </thead>
            <tbody v-for="(item, index) in codes" :key="index"> <!-- TODO : 이름 클릭하면 대시보드로 갈 수 있게 해보자 -> 완료-->
              <tr>
                <td scope="col">{{index+1}}</td>
                <td>{{item.이름}}</td>
                <td>{{item.부서명}}</td>
                <td @click="readCode(item)" style="cursor: pointer">{{item.파일명}}</td>
                <td>{{item.writetime}}</td>
                <td>
                    <button v-if="isLogged" class="btn btn-sm btn-secondary" @click.prevent="downloadCode(item.코드번호)">다운로드</button>
                </td>
                </tr>
            </tbody>
          </table>
        </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import VueTagsInput from '@johmun/vue-tags-input';
export default {
  name: 'HelloWorld',
  computed: {
        
    },
    components: {
        VueTagsInput
    },
  methods: {
      readPost: function(item) {
            this.$router.push({
                name: 'PostViewer',
                query: {
                    postId: item.게시글번호
                }
            })
        },
        readCode: function(item) {
            window.open(item.링크);
        },
        downloadCode: function(codeId) {
            var url = this.$config.targetURL+`/review/download?id=${codeId}`;
            window.open(url);
        },
        getData: function(){
            var url = this.$config.targetURL+'/tags/bytag/'
            var texts = [];
            for(var i=0;i<this.tags.length;i++)
                texts.push(this.tags[i].text);
            var json = {
                "tags" : texts,
                "mode" : this.searchMode
            }
            console.log(texts);
            console.log(json);
            this.$http.post(url, json)
            .then(result=>{
                console.log(JSON.parse(result.data.result))
                if(this.searchMode==0) { // 게시글 검색
                    this.posts = [];
                    var temp = JSON.parse(result.data.result);
                    var temp2 = [];
                    var temp3 = [];
                    for(var i=0;i<temp.length;i++) {
                        
                        temp2.push(temp[i]);
                        console.log(temp2[i]);
                        for(var j=0;j<temp2[i].length;j++) {
                            console.log(temp2[i][j]);
                            temp3.push(temp2[i][j]);
                        }
                    }
                    this.posts = [...new Set(temp3)]; // 내용이 배열일 때는 중복이 안걸러지네
                    console.log(this.posts);
                    this.posts.forEach(v=>{
                        var dateinfo = v.작성시각
                        v.writetime = this.$moment(dateinfo).tz('Asia/Seoul').format('YYYY년 M월 D일 H시 m분')
                        console.log("왜")
                    })
                }
                else { // 코드 검색
                    this.codes = [];
                    var temp = JSON.parse(result.data.result);
                    var temp2 = [];
                    var temp3 = [];
                    for(var i=0;i<temp.length;i++) {
                        temp2.push(temp[i]);
                        console.log(temp2[i]);
                        for(var j=0;j<temp2[i].length;j++) {
                            console.log(temp2[i][j]);
                            temp3.push(temp2[i][j]);
                        }
                    }
                    this.codes = [...new Set(temp3)];
                    console.log(this.codes);
                    this.codes.forEach(v=>{
                        var dateinfo = v.작성시간
                        v.writetime = this.$moment(dateinfo).tz('Asia/Seoul').format('YYYY년 M월 D일 H시 m분')
                        console.log("왜")
                    })
                }
            })
            .catch(error=>{
                console.log('서버에러')
            }) 
        }
    },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      searchMode: '0',
      tag: '',
      tags: [],
      posts: [],
      codes: []
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
