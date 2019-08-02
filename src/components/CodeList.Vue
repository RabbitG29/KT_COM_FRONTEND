<template>
    <div class="container">
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
        <h1 v-if="this.mode==1">My Code Review List</h1>
        <h1 v-if="this.mode==2">My Dept Review List</h1>
        <h1 v-if="this.mode!=1&&this.mode!=2">All Code Review List</h1>
        <br>
        <div id="board">
      <div class="board-box">
      <div v-show="isLogged" class="row form-group">
        
        <div class="col-sm-4" >
            <button type="button" class="btn btn-secondary"
        @click="gotoSonar()">과거 리뷰 보러가기</button>
          <button type="button" class="btn btn-secondary"
        @click="gotoUpload()">코드 등록 및 리뷰</button>
        </div>
      </div>
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
            <tbody> <!-- TODO : 이름 클릭하면 대시보드로 갈 수 있게 해보자 -> 완료-->
              <tr v-for="(item, index) in result" :key="index" >
                <td scope="col">{{index+1}}</td>
                <td>{{item.이름}}</td>
                <td>{{item.부서명}}</td>
                <td @click="readCode(item)" style="cursor: pointer">{{item.파일명}}</td>
                <td>{{item.writetime}}</td>
                <td>
                    <button v-if="isLogged" class="btn btn-sm btn-primary" @click.prevent="downloadCode(item.코드번호)">다운로드</button>
                    <button v-if="isLogged" class="btn btn-sm btn-danger" @click.prevent="deleteRequest(item)">삭제</button></td> <!-- TODO : 다운/삭제기능 -->
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <br>
      <div class="row form-group">
        <label class="col-sm-1">코드검색</label>
        <div class="col-sm-10">
          <input class="form-control" v-model="name" @input="getResult(true)" @keydown.enter="getResult(true)" placeholder="코드명을 입력해주세요(대소문자 구분).">
        </div>
        <div class="col-sm-1">
          <button class="btn btn-sm btn-primary" @click.prevent="getResult(true)">검색</button>
        </div>
      </div>
      
    </div>
    </div>
</template>

<script>
//TODO : 여기서 색인 기능?
var path = require('path');
export default {
  name: 'CodeList',
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
      }
    },
    mounted: function() {
        if(!this.isLogged) {
            $router.go(-1);
        }
        this.id=this.getId;
        this.mode = this.$route.query.mode;
        this.deptId = this.getDeptId;
        console.log(this.id);
        this.getData();
    },
    methods: {
        gotoSonar: function() {
            window.open("https://sonarcloud.io/organizations/kt/projects");
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
                        v.writetime = this.$moment(dateinfo).tz('Asia/Seoul').format('YYYY년 M월 D일 H시 m분')
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
              if(this.name && this.list[i].파일명.indexOf(String(this.name)) == -1)
                continue;
              arr_base.push(this.list[i]);
            }
            this.result = arr_base;
            console.log(this.result);
            //this.result = arr_base.slice(this.page_max*this.page, this.page_max*(this.page+1));
        }
    },
    data () {
    return {
      msg: 'Code List',
      id: '',
      counter: '1',
      list: [],
      path: '',
      result: [],
      name: '',
      mode: '',
      deptId: '',
      deptName: ''
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
</style>
