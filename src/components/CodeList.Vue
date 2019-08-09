<template>
    <div class="container">
      <div class="unlogin-box container" v-show="!isLogged">
          <h1>KT Code-Cleaner</h1>
          <br>
        <div class="alert alert-warning" role="alert" >로그인이 필요합니다!</div>
        <router-link tag="a" :to="{name: 'Login'}">클릭 시 로그인페이지로 이동합니다</router-link><br><br>
        <button type="button" class="btn btn-outline-secondary" @click="$router.go(-1)">뒤로가기</button>
    </div>
      <div v-show="isLogged" >
      <modal id="code-delete" name="code-delete" height="auto" :scrollable="true" padding="10px">
        <div class="modal-container">
            <h3>코드를 정말 삭제하시겠습니까?</h3>
            <hr>
            <div>
                <button class="btn btn-danger" @click.prevent="deleteCode(item.코드번호)">삭제</button>
                <button class="btn btn-secondary" @click="$modal.hide('code-delete')">닫기</button>
            </div>
        </div>
    </modal>
      <!-- mode에 따라 제목 다르게 -->
        <h1 v-if="this.mode==1">My Code Review List</h1>
        <h1 v-if="this.mode==2">My Dept's Code Review List</h1>
        <h1 v-if="this.mode!=1&&this.mode!=2">All Code Review List</h1>
        <br>
        <div id="board">
      <div class="board-box">
      <div class="row form-group">
        <div class="col-sm-4" >
            <button type="button" class="btn btn-secondary"
        @click="gotoSonar()">과거 리뷰 보러가기</button>
          <button type="button" class="btn btn-secondary"
        @click="gotoUpload()">코드 등록 및 리뷰</button>
        </div>
      </div>
      <div class="row form-group">
        <label class="col-sm-1">코드검색</label>
        <div class="col-sm-10">
          <input class="form-control" v-model="name" @input="getResult(true)" @keydown.enter="getResult(true)" placeholder="코드명 혹은 작성자를 입력해주세요(대소문자 구분).">
        </div>
        <div class="col-sm-1">
          <button class="btn btn-sm btn-primary" @click.prevent="getResult(true)">검색</button>
        </div>
      </div>
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
                <th class="text-center">다운로드/삭제</th>
                <th class="text-center"></th>
              </tr>
            </thead>
            <tbody v-for="(item, index) in result" :key="index"> <!-- TODO : 이름 클릭하면 대시보드로 갈 수 있게 해보자 -> 완료-->
              <tr>
                <td scope="col">{{index+1}}</td>
                <td style="text-align: left;">{{item.부서명}}</td>
                <td width=400 @click="readCode(item)" style="cursor: pointer; text-align: left;">{{item.파일명}}</td>
                <td>{{item.이름}}</td>
                <td>{{item.writetime}}</td>
                
                <td>
                    <button v-if="isLogged" class="btn btn-sm btn-primary" @click.prevent="downloadCode(item.코드번호)">다운로드</button>
                    <button v-if="isLogged && item.작성자==getId" class="btn btn-sm btn-danger" @click.prevent="deleteRequest(item)">삭제</button></td> <!-- TODO : 다운/삭제기능 -->
                <td width=10><button v-if="isLogged" class="btn btn-sm btn-light" @click.prevent="changeIndex(index+1,item)" v-b-toggle="'accordion-'+(index+1)" >▼</button>
                </td>
              <tr> <!-- row of row로 table 내에서 처리 가능 -->
              <td colspan="7" style="padding: 0px;"> <!-- 모든 열의 자리를 차지하도록 -->
                <div class="row" id="comment" >
                  <div v-if="isLogged" class="list-group col-sm-12"> 
                  <!-- collapse 위치를 테이블 내로 이동하면서 accordion에서 일반 collapse로 변경-->
                    <b-collapse :id="'accordion-'+(index2+1)" role="tabpanel" v-for="(code, index2) in result" :key="index2">
                      <div v-if="index==index2"> <!-- 본인 collapse만 펴지게 -->
                      <br>
                      <h4>Tags : {{code.파일명}}</h4>
                      <br>
                      <div class="card">
                            <div class="card-body">
                              <h5 style="text-align: left;">
                                <a style="text-align: left;" class="card-text" v-for="(tag,index) in tags2[code.코드번호]" :key="index"> <!-- 해당 코드리뷰에 태그가 있을 경우 -->
                                  #{{tag.태그명}} 
                                </a>
                                <a style="text-align: left;" class="card-text" v-if="tags2[code.코드번호].length==0" :key="index"> <!-- 해당 코드리뷰에 태그가 없을 경우 -->
                                  태그가 없습니다.
                                </a>
                              </h5>
                              <br>
                            </div>
                            </div>
                            <br>
                        <h4>Comment : {{code.파일명}}</h4>
                        <div id="comment-post-box">
                          <textarea v-model="comment" class="form-control"  :placeholder="'Comment to '+code.파일명" rows="3"></textarea>
                          <button type="button" class="btn btn-primary" style="cursor: pointer" @click.prevent="commentEroll(code.코드번호)">댓글작성</button>
                        </div>
                        <div id="dummy" style="font-size: 0px;">
                          {{tags}}
                          {{tags2}}
                        {{list2}}
                        {{list3[code.코드번호]}}
                        </div>
                        <div class="row" id="comment">
                          <div class="col-sm-2"></div>
                            <div class="list-group col-sm-12">
                              <div class="text-left card comment-card" v-for="(item, index) in list3[code.코드번호]" :key="index+item.mode">
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
                                      <button type="button" class="btn btn-light btn-sm" style="cursor: pointer" @click.prevent="deleteComment(item.댓글번호,item.소속코드)">삭제</button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div class="col-sm-2"></div>
                          </div>
                          
                          </div>
                        </b-collapse>
                      </div>
                    </div>
                  </td>
                </tr>
            </tbody>
          </table>
        </div>
      </div>
      <br>
      <div>
      </div>
      </div>

    </div>
    </div>
</template>

<script>
//TODO : 여기서 검색 기능? -> 완료
//TODO : Callapse Toggle을 자유롭게 다룰 수 있다면 가능할 듯? -> Arcodian 이용 codeId, 현재 펼쳐진 codeId 이용 https://bootstrap-vue.js.org/docs/components/collapse/
var path = require('path');
import { BCollapse } from 'bootstrap-vue'

export default {
  name: 'CodeList',
  component: {
    BCollapse
  },
  computed: {
        isLogged () {
            return this.$store.getters.isLogged;
        },
        getId: function() {
            return this.$store.getters.getId;
        },
        getDeptId: function() {
          return this.$store.getters.getDeptId;
        },
    },
    watch: {
      $route: function(to, from){
        this.msg = ''
        this.id = this.getId;
        this.mode = this.$route.query.mode;
        this.deptId = this.getDeptId;
        this.getData()
        
        //this.getComment(this.list[0].코드번호);
      }
    },
    mounted: function() {
        if(!this.isLogged) {
            $router.go(-1);
        }
        for(var i=0;i<5000;i++) {
          this.list3.push([]);
          this.tags2.push([]);
        }

        console.log("hoho");
        console.log(this.list3[1000]);
        this.id=this.getId;
        this.mode = this.$route.query.mode;
        this.deptId = this.getDeptId;
        console.log(this.id);
        this.getData();
        //this.getComment(this.list[0].코드번호);
    },
    methods: {
        gotoSonar: function() {
            window.open("https://sonarcloud.io/organizations/kt/projects");
        },
        getTags: function(index) {
          var url = this.$config.targetURL+'/tags/bycode?codeId='+index;
          this.$http.get(url)
          .then(r=>{
            if(r.data.status=='success') {
              this.tags=JSON.parse(r.data.result);
              if(this.tags.length!=0)
                this.tags2[this.tags[0].코드번호] = this.tags;
            }
          })
        },
        changeIndex: function(index,item) {
            this.currentIndex = index;
            this.getComment(item.코드번호);
            this.getTags(item.코드번호);
        },
        readCode: function(item) {
            window.open(item.링크);
        },
        deleteRequest: function(item) {
            this.item = item
            this.$modal.show('code-delete')
        },
        getData: function() {
            var url = this.$config.targetURL+`/review?id=${this.id}&mode=${this.mode}&deptId=${this.deptId}`;
            console.log(url);
            this.$http.get(url).then(r=>{
                console.log(r);
                if(r.data.status == 'success'){
                    console.log(JSON.parse(r.data.result));
                    this.list = JSON.parse(r.data.result);
                    //this.list = r.data.result;
                    console.log(this.list);
                    this.list.forEach(v=>{
                        var dateinfo = v.작성시간
                        v.writetime = this.$moment(dateinfo).tz('Asia/Seoul').format('YYYY.MM.DD HH:MM')
                        console.log(v);
                    })
                    this.getResult(true);
                }
            })
            .catch(e=>{
              console.log(e);
              this.$notice({
                type: 'alert',
                text: '서버에 오류가 있습니다.'
            })
            })
        },
        deleteCode: function(codeId) {
            var url = this.$config.targetURL+`/review?id=${codeId}`;
            console.log(url);
            this.$http.delete(url).then(r=>{
                if(r.data.status=='success') {
                    this.$notice({
                      type: 'success',
                      text: '정상적으로 삭제되었습니다.',
                  })
                  this.$modal.hide('code-delete')
                  this.getData();
                }
            })
            .catch(e=>{
                console.log(e);
                this.$notice({
                type: 'alert',
                text: '서버에 오류가 있습니다.'
            })
            })
        },
        downloadCode: function(codeId) {
            var url = this.$config.targetURL+`/review/download?id=${codeId}`;
            window.open(url);
        },
        gotoUpload: function() {
            this.$router.push({
                name: 'CodeUploader'
            })
        },
        getResult: function(flag){
            let arr_base=[];
            let arr=[];            
            for(var i=0;i<this.list.length;i++){
              console.log(this.name);
              if(this.name && ((this.list[i].파일명.indexOf(String(this.name)) == -1) && (this.list[i].이름.indexOf(String(this.name)) == -1)))
                continue;
              arr_base.push(this.list[i]);
            }
            this.result = arr_base;
            console.log(this.result);
            //this.result = arr_base.slice(this.page_max*this.page, this.page_max*(this.page+1));
        },
        changeCommentMode: function(index){
          if(this.list2[index].mode == 'view')
            this.list2[index].mode = 'edit'
          else
            this.list2[index].mode = 'view'
          console.log("good");
          //console.log(this.list[index].mode);
          this.$forceUpdate()
        },
        getComment: function(index){
          console.log("hihi");
          this.$http.get(this.$config.targetURL+'/review/comment?codeId='+index)
          .then(result=>{
            console.log("hi2");
            console.log(result.data)
          this.list2 = JSON.parse(result.data.result)
          console.log(this.list2);
          console.log("hi");
          //this.list3.push([]);
          //console.log("??" + this.list3[0]);
          this.list2.forEach(v=>{
            var ct = v.작성시각
            console.log(ct)
            v.작성시각 = this.$moment(ct).tz('Asia/Seoul').format('YYYY.MM.DD HH:MM')
            v.mode = 'view'
          })
          this.list3[index]=this.list2;
          console.log("list3");
          console.log(this.list3[index]);
      })
      .catch(error=>{
          console.log('서버에러')
          this.$notice({
                type: 'alert',
                text: '서버에 오류가 있습니다.'
            })
      })
    },
    commentEroll : function(index){
     var url = this.$config.targetURL+'/review/comment';
     var json = {
       codeId: index,
       content: this.comment,
       writer: this.getId
     }
     this.$http.post(url, json)
     .then(result=>{
       if(result.data.status == 'success'){
         this.getComment(index)
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
    deleteComment : function(commentId,index){
      this.$http.delete(this.$config.targetURL+'/review/comment?commentId='+commentId)
      .then(result=>{
        if(result.data.status == 'success'){
          console.log('삭제성공')
          this.getComment(index)
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
      var url = this.$config.targetURL+'/review/comment';
      var json = {
        commentId: commentId,
        content: comment
      }
      this.$http.put(url, json)
      .then(result=>{
        if(result.data.status == 'success'){
          console.log('수정성공')
          this.getComment(item.소속코드)
          this.$notice({
            type: 'success',
            text: '수정이 성공적으로 완료되었습니다.'
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
      msg: 'Code List',
      id: '',
      counter: '1',
      list: [],
      list2: [],
      list3: [],
      comment: '',
      path: '',
      result: [],
      name: '',
      mode: '',
      deptId: '',
      deptName: '',
      currentIndex: '1',
      tags: [],
      tags2: [],
      tag: ''
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
  font-family: 'Olleh','NanumGothic';
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
.modal {
  text-align: center;
}
.modal-container {
  width: auto;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
}
#comment {
  width: 100%;
  margin-left: 0px;
}
#comment-box #edit-box {
  position: absolute;
  bottom: 15px;
  right: 30px;
}
#comment-post-box button {
  position: absolute;
  top: 285px;
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
</style>
