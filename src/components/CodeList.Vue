<template>
    <div class="container">
        <h1>My Code Review List</h1>
        <div id="board">
      <div class="board-box">
      <div v-show="isLogged" class="row form-group">
        
        <div class="col-sm-50" >
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
                <th class="text-center">코드</th>
                <th class="text-center">작성일시</th>
                <th class="text-center">다운로드/삭제</th>
              </tr>
            </thead>
            <tbody> <!-- TODO : 이름 클릭하면 대시보드로 갈 수 있게 해보자 -->
              <tr v-for="(item, index) in list" @click="readBoard(item)" :key="index" style="cursor: pointer">
                <td scope="col">{{index+1}}</td>
                <td>{{item.이름}}</td>
                <td>{{item.파일명}}</td>
                <td>{{item.writetime}}</td>
                <td>
                    <button v-if="isLogged" class="btn btn-sm btn-primary" @click.prevent="downloadCode(item.코드번호)">다운로드</button>
                    <button v-if="isLogged" class="btn btn-sm btn-danger" @click.prevent="deleteCode(item.코드번호)">삭제</button></td> <!-- TODO : 다운/삭제기능 -->
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
</template>

<script>
var path = require('path');
export default {
  name: 'CodeList',
  computed: {
        isLogged () {
            return this.$store.getters.isLogged;
        }
    },
    mounted: function() {
        if(!this.isLogged) {
            $router.go(-1);
        }
        this.id=this.getId;
        console.log(this.id);
        this.getData();
    },
    methods: {
        getId: function() {
            return this.$store.getters.getId;
        },
        gotoSonar: function() {
            window.open("https://sonarcloud.io/organizations/kt/projects");
        },
        getData: function() {
            var url = this.$config.targetURL+`/review?id=${this.id}`;
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
                }
            })
            .catch(e=>{
              console.log(e);
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
                  this.getData();
                }
            })
            .catch(e=>{
                console.log(e);
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
        }
    },
    data () {
    return {
      msg: 'Code List',
      id: '',
      counter: '1',
      list: [],
      path: ''
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
</style>
