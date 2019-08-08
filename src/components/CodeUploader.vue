<template>
  <div class="container">
      <h1>리뷰할 코드 업로드</h1>
      <br>
        <b-form-select v-model="mode" class="mb-3">
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
      <h2>압축파일 혹은 코드파일을 드래그해서 드랍해주세요. </h2>
    </div>
    <br>
    <h5>파일명 : {{this.filename}}</h5>
    <br>
    <div class="form-group">
      <label for="id">SonarCloud Organization(기본 : kt)</label>
      <input class="form-control" id="id" placeholder="organization(기본 : kt)" v-model="organization">
      <br>HashTags
    <div class="form-group">
      <vue-tags-input id="tagtag" v-model="tag" :tags="tags" @tags-changed="newTags => tags = newTags"/>
    </div>
    </div>
    <button v-if="isLogged" class="btn btn-sm btn-primary" @click.prevent="submit()">등록하기</button>
    <button class="btn btn-sm btn-secondary" @click="$router.go(-1)">뒤로가기</button>
  </div>
</template>

<script>
// TODO : 아오 프로그레스 스피너 외않되? -> 해결
// TODO : 코드 파일 형식 or .zip 파일만 올릴 수 있게 -> 해결
// TODO : 유효성 검사
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
        progress(event,progress,stepValue){
          console.log(stepValue);
        },
        progress_end(event){
          console.log("Circle progress end");
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
            console.log(files[0].name);
            this.filename=files[0].name;
            this.file1=files[0];
        },
        submit: function() {
            this.$modal.show('spinner');
            var url = this.$config.targetURL+'/review';
            console.log(url);
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
              console.log(result);
               this.$modal.hide('spinner');
              console.log('success!')
              this.$notice({
                type: 'success',
                text: '코드 등록이 성공적으로 완료되었습니다.'
              })
              
              this.$router.go(-1)
            })
            .catch(error=>{
                console.log('서버에러')
                this.$notice({
                type: 'alert',
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
      id: '',
      fill : { gradient: ["red", "green", "blue"] },
      mode: '3',
      organization: 'kt',
      tag: '',
      tags: []
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
    outline: 2px dashed #aaa;
    background: #7fb4dd;
    width: 1100px;
    height: 300px;
    position: relative; 
     margin: 0 auto;
  } 
  .dropbox > h2{
    position: absolute;
    top: 45%;
    left: 20%;
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