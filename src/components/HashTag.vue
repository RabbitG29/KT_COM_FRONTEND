<template>
  <div class="container">
      <go-top></go-top>
      <div class="unlogin-box container" v-show="!isLogged">
          <h1>KT Code-Cleaner</h1>
          <br>
        <div class="alert alert-warning" role="alert" >로그인이 필요합니다!</div>
        <router-link tag="a" :to="{name: 'Login'}">클릭 시 로그인페이지로 이동합니다</router-link><br><br>
        <button type="button" class="btn btn-outline-secondary" @click="$router.go(-1)">뒤로가기</button>
    </div>
    <div v-show="isLogged" >
    <h2>Search by HashTag</h2><br>
    <div class="row form-group">
        <div class="col-sm-1" />
        <div class="col-sm-2">
        <b-form-select v-model="searchMode" class="mb-3">
          <option value="0" >게시판</option>
          <option value="1">코드</option>
        </b-form-select>
        </div>
        <div class="col-sm-2">
        <b-form-select v-model="detailMode" class="mb-3" v-b-tooltip.hover title="태그 옵션(&&, ||)">
          <option value="0" >OR</option>
          <option value="1">AND</option>
        </b-form-select>
        </div>
        <div class="col-sm-5">
          <vue-tags-input id="tagtag" v-model="tag" :tags="tags" @tags-changed="newTags => tags = newTags"/>
        </div>
        <div class="col-sm-1">
          <button class="btn btn-primary" v-b-tooltip.hover title="태그 검색" :disabled="(this.tags.length==0)" @click.prevent="getData">검색</button>
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
                                <th class="text-center">게시판</th>
                                <th class="text-center">카테고리</th>
                                <th class="text-center">제목</th>
                                <th class="text-center">작성자</th>
                                <th class="text-center">작성일시</th>
                                <th class="text-center">추천수</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in posts" @click="readPost(item)" :key="index" style="cursor: pointer">
                                <td scope="col">{{index+1}}</td>
                                <td>{{item.게시판명}}</td>
                                <td>{{item.카테고리명}}</td>
                                <td style="text-align: left;" width=500>{{item.제목}}</td>
                                <td>{{item.이름}}</td>
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
                <th class="text-center">부서</th>
                <th class="text-center">코드</th>
                <th class="text-center">작성자</th>
                <th class="text-center">작성일시</th>
                <th class="text-center">다운로드</th>
              </tr>
            </thead>
            <tbody v-for="(item, index) in codes" :key="index"> <!-- TODO : 이름 클릭하면 대시보드로 갈 수 있게 해보자 -> 완료-->
              <tr>
                <td scope="col">{{index+1}}</td>
                <td style="text-align: left;">{{item.부서명}}</td>
                <td width=400 @click="readCode(item)" style="cursor: pointer; text-align: left;">{{item.파일명}}</td>
                <td>{{item.이름}}</td>
                <td>{{item.writetime}}</td>
                <td>
                    <button v-if="isLogged" class="btn btn-sm btn-primary" @click.prevent="downloadCode(item.코드번호)">다운로드</button>
                </td>
                </tr>
            </tbody>
          </table>
        </div>
            </div>
        </div>
    </div>
    </div>
</div>
</template>

<script>
import VueTagsInput from '@johmun/vue-tags-input';
import GoTop from '@inotom/vue-go-top';
export default {
  name: 'HelloWorld',
  computed: {
        
    },
    components: {
        VueTagsInput,
        GoTop
    },
    mounted: function() {
        this.tag = this.$route.query.tag;
        console.log(this.tag);
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
                    console.log(this.detailMode);
                    this.posts = [];
                    var temp = JSON.parse(result.data.result);
                    var temp2 = [];
                    var temp3 = [];
                    for(var i=0;i<temp.length;i++) {
                        temp2.push(temp[i]);
                        //console.log(temp2[i]);
                        for(var j=0;j<temp2[i].length;j++) {
                            //console.log(temp2[i][j]);
                            temp3.push(temp2[i][j]);
                        }
                    }
                    // 중복 제거 혹은 필터링을 통해 AND 및 OR 검색이 가능하도록
                    if(this.detailMode==1 && this.tags.length > 1) { // AND 조건에서 1개짜리일 경우에는 중복이 없으므로 넘김
                        var temp4 = [];
                        temp4 = Object(temp3).filter((array,index,self) => self.findIndex((t)=> {
                            return t.게시글번호 === array.게시글번호;
                        }) !== index); // 중복으로 나온 것 즉, AND
                        console.log(temp4);
                        this.posts = Object(temp4).filter((array,index,self) => self.findIndex((t)=> {
                            return t.게시글번호 === array.게시글번호;
                        }) === index); // 중복으로 검출된 것이 여러개이니 다시 중복된 것을 걸러준다.
                        console.log(this.posts);
                    }
                    else { // OR 조건이거나 AND 조건에서 태그가 하나일 경우
                        this.posts = Object(temp3).filter((array,index,self) => self.findIndex((t)=> {
                            return t.게시글번호 === array.게시글번호;
                        }) === index); // 중복 제거
                    }
                    console.log(this.posts);
                    this.posts.forEach(v=>{
                        var dateinfo = v.작성시각
                        v.writetime = this.$moment(dateinfo).tz('Asia/Seoul').format('YYYY.MM.DD HH:MM')
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
                    // 중복 제거 혹은 필터링을 통해 AND 및 OR 검색이 가능하도록
                    if(this.detailMode==1 && this.tags.length > 1) { // AND 조건에서 1개짜리일 경우에는 중복이 없으므로 넘김
                        var temp4 = [];
                        temp4 = Object(temp3).filter((array,index,self) => self.findIndex((t)=> {
                            return t.코드번호 === array.코드번호;
                        }) !== index); // 중복으로 나온 것 즉, AND
                        this.codes = Object(temp4).filter((array,index,self) => self.findIndex((t)=> {
                            return t.코드번호 === array.코드번호;
                        }) === index); // 중복으로 검출된 것이 여러개이니 다시 중복된 것을 걸러준다.
                    }
                    else { // OR 조건이거나 AND 조건에서 태그가 하나일 경우
                        this.codes = Object(temp3).filter((array,index,self) => self.findIndex((t)=> {
                            return t.코드번호 === array.코드번호;
                        }) === index); // 중복 제거
                    }
                    console.log(this.codes);
                    this.codes.forEach(v=>{
                        var dateinfo = v.작성시간
                        v.writetime = this.$moment(dateinfo).tz('Asia/Seoul').format('YYYY.MM.DD HH:MM')
                        console.log("왜")
                    })
                }
            })
            .catch(error=>{
                console.log(error)
            this.$notice({
                type: 'error',
                text: '서버에 오류가 있습니다.'
            })
            }) 
        }
    },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      searchMode: '0',
      detailMode: '0',
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
