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
      <h1>리뷰할 코드 업로드</h1>
      <br>
        <b-form-select v-model="mode" class="mb-3" v-b-tooltip.hover title="코드 공개 범위 설정">
          <option value="1" >비공개</option>
          <option value="2">부서 공개</option>
          <option value="3">전체 공개</option>
        </b-form-select>
      <modal id="spinner" name="spinner" height="auto" :scrollable="true" :clickToClose="false" >
        <pulse-loader id="myspinner" :loading="loading" :color="color" :size="size"></pulse-loader>
      </modal>
      <br>
    <div class="dropbox">
      <input class="input-file" type="file" name="userfile" @change="upload($event.target.name, $event.target.files)" @drop="upload($event.target.name, $event.target.files)">
      <h2 v-if="!this.file1">압축파일(zip, 코드 파일만 압축) 혹은 코드파일을 드래그해서 드랍해주세요. </h2>
      <h2 v-if="this.file1" style="left:25%;">첨부한 파일명 : {{this.filename}}</h2>
    </div>
    <br>
    <br>
    <div class="form-group">
      <label for="id">SonarCloud Organization(기본 : kt)</label>
      <input class="form-control" id="id" placeholder="organization(기본 : kt)" v-model="organization">
      <br>HashTags
    <div class="form-group">
      <vue-tags-input id="tagtag" v-model="tag" :tags="tags" @tags-changed="newTags => tags = newTags"/>
    </div>
    </div>
    <button v-if="isLogged" class="btn btn-sm btn-primary" :disabled="this.organization=='' || !this.file1" @click.prevent="submit()">등록하기</button>
    <button class="btn btn-sm btn-secondary" @click="$router.go(-1)">뒤로가기</button>
  </div>
  </div>
</template>

<script>
// TODO : 아오 프로그레스 스피너 외않되? -> 해결
// TODO : 코드 파일 형식 or .zip 파일만 올릴 수 있게 -> 해결
// TODO : 유효성 검사 -> 파일이 코드 파일이나 zip이 아닌 경우를 거를 수 있을까? -> 일단은 하드 코딩으로 해결
import VueCircle from 'vue2-circle-progress'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import VueTagsInput from '@johmun/vue-tags-input';

export default {
  components: {
      VueCircle,
      PulseLoader,
      VueTagsInput
  },
  name: 'CodeUploader',
  computed: {
        
    },
    mounted: function() {
        this.id=this.getId;
    },
  methods: {
        fileCheck() { // SonarCloud가 지원하는 언어 파일 혹은 압축 파일인지 확인
          this.fileExt = this.filename.slice(this.filename.indexOf(".")+1).toLowerCase(); // 뒤에서부터 보게 하면?
          for(var i=0;i<this.languages.length;i++) {
            if(this.languages[i]==this.fileExt) { // 더 좋은 방법이 있을까?
              //console.log(true);
              return true;
            }
          }
          //console.log(false);
          return false;
        },
        progress(event,progress,stepValue){
          //console.log(stepValue);
        },
        progress_end(event){
         // console.log("Circle progress end");
        },
        spinner() {
          this.$modal.show('spinner');
          //this.$modal.hide('spinner');
        },
        redraw(){
          this.$refs.myprogress.updateProgress(60);
        },
        upload: function(name, files) {
            //console.log(name); 
            //console.log(files[0].name);
            this.filename=files[0].name;
            this.file1=files[0];
        },
        submit: function() {
            if(!this.fileCheck()) {
              this.$notice({
                type: 'error',
                text: '코드 파일이나 압축 파일(zip)이 맞는지 다시 확인해 주세요.'
              })
              return;
            }
            this.$modal.show('spinner');
            var url = 'http://45.119.147.154:8080/review'; // 따로 포트 운용(다른 사이트 작업이 멈추지 않게)
            //console.log(url);
            var formData = new FormData()
            formData.append('id', this.id)
            formData.append('userfile', this.file1)
            formData.append('mode', this.mode);
            formData.append('organization', this.organization);
            var submitTags = [];
            for(var i=0;i<this.tags.length;i++) {
              submitTags.push(this.tags[i].text);
            }
            formData.append('tags', JSON.stringify(submitTags));
            this.$http.post(url, formData)
            .then(result=>{
              //console.log(result);
               this.$modal.hide('spinner');
               if(result.data.status=='success') {
                  console.log('success!')
                  this.$notice({
                    type: 'success',
                    text: '코드 등록이 성공적으로 완료되었습니다.'
                  })
                }
                else { // 서버에는 정상적으로 올라갔으나 SonarScanner 오류인 경우
                 // console.log('fail')
                  this.$notice({
                    type: 'error',
                    text: '코드 등록에 실패하였습니다(SonarScanner 오류).'
                  })
                }
              this.$router.push({
                name: 'CodeList'
              })
            })
            .catch(error=>{
                console.log(error)
                this.$notice({
                type: 'error',
                text: '서버에 오류가 있습니다.'
            })
              this.$router.push({
                name: 'CodeList'
              })
            })
        }
    },
  data () {
    return {
      msg: 'CodeCode',
      filename: '',
      file1: '',
      fileExt: '',
      id: '',
      fill : { gradient: ["red", "green", "blue"] },
      mode: '3',
      organization: 'kt',
      tag: '',
      tags: [],
      languages: ['cpp', 'java', 'js', 'vue', 'php', 'css', 'html', 'xml', 'py', 'cs', 'ts', 'go', 'zip', 'rb', 'rbz', 'kt', 'sc', 'mxml', 'jsx', ]
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
.dropbox {
    outline: 2px dashed #000000;
    background: #ffffff;
    width: 1100px;
    height: 300px;
    position: relative; 
     margin: 0 auto;
  } 
  .dropbox > h2{
    position: absolute;
    top: 45%;
    left: 6%;
    z-index: 2;
  }
  .input-file{
    position: absolute;
    opacity: 0;
    width:100%;
    height:100%;
    top:0;
    left:0;
    z-index: 3;
  }
  
  .modal-container {
  width: 0px;
  margin: 0px auto;
  background:transparent;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  align-content: center;
  align-items: center;
}
#myspinner {
  margin-left: 250px;
}
.tagtag {
  width: 1200px;
}

</style>