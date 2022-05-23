<template>

<div class="base">
<div class="firstlayer">
  <HomeCanvas ref="homeCanvas" @send-vb-to-hc="getBottleViewing" @send-learn-more-stage-content="getLearnMoreStageContent"/>
</div>

  <div class="home">
    <span v-show="page=='learn-more'" class="circle"></span>
    <span v-show="page=='learn-more'" class="circle-2"></span>
    <div v-show="page=='learn-more'" class="learnMoreLeft">
      <h2>{{computedlearnMoreInfo.heading}}</h2>
      <h4>{{computedlearnMoreInfo.content}}</h4>
      <NButton v-show="lmStage<2" class="button" ghost size="large" @click="toggleLearnMoreStage">Next</NButton>
      <NButton v-show="lmStage==2" class="button" ghost size="large" @click="handleHomeClick">Back To Home</NButton>
    </div>
    <div v-show="page=='home'" class="homeleft">

      <div>
    <h1 class="maintitle">THERMELLO</h1>
    </div>
    <div>
    <div class="buttongroup">
    <NButton class="button" ghost size="large" @click="handleLearnMore">Learn More</NButton>
     <NButton class="button" ghost size="large" @click="handleShopClick">Shop Now</NButton>
    </div>
    </div>
  </div>

  <div v-show="page=='home'" class="homeright">
    <h3>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </h3>
  </div>
  <NSpace v-if="page=='shop'" justify="space-between">
  <NButton  v-show="page=='shop'" @click="backToHome">Back to Home</NButton>
</NSpace>
  <div v-show="page=='shop'" class="shoppanel">
    <h2>Three colors, take your pick</h2>
    </div>
  <div v-if="page=='shop'" class="infocard">
    <NCard v-show="page=='shop' && !!bottleInfo" :title="bottleInfo?.color||'loading'">
      <div class="card-content">
      <h3>${{bottleInfo?.price||'loading'}}</h3>
      <NButton @click="handleCheckOut">Buy Now</NButton>
      </div>
    </NCard>
    </div>
</div>


  </div>
  
</template>

<script>
// @ is an alias to /src
import HomeCanvas from "../components/HomeCanvas.vue";

export default {
  name: "Home",
  data(){
    return {
      page:"home",
      bottleInfo:null,
      learnMoreInfo:null,
      lmStage:null
    }
  },
  computed:{
    currentPage(){
      console.log('cur',this.$store.getters.getCurrentPage)
      return this.$store.getters.getCurrentPage
    },
    computedlearnMoreInfo(){
      if(this.learnMoreInfo==null) return {heading:'loading',content:'loading'}
      return this.learnMoreInfo
    }
  },
  watch: {
    currentPage(v) {
      console.log(v,"HEY")
      if(v=='shop'){
        console.log("val",v,document.getElementsByClassName("home")[0])
        document.getElementsByClassName("home")[0].style.display = "block"
      }
      this.page = v;
    },
  },
  methods:{
    backToHome(){
      this.$router.replace({path:"/"})
      this.$router.go()
    },
    getLearnMoreStageContent(content){
      this.learnMoreInfo= content
    },
    toggleLearnMoreStage(){
      this.$refs.homeCanvas.toggleLearnMoreStage()
      this.lmStage = this.$refs.homeCanvas.learnMoreStage
      this.$refs.homeCanvas.learnMoreStageAnimation(this.$refs.homeCanvas.learnMoreStage)
    },
    async getBottleViewing(bv){
      this.$store.dispatch("handleViewingBottleChange",bv)
      this.bottleInfo =await this.$store.dispatch("getBottleInfo",bv)
     // console.log(await this.$store.dispatch("getBottleInfo",bv))
    },
    handleShopClick(){
      
      this.$store.dispatch("handlePageChange","shop")
      //this.$emit("go-to-shop")
    },
    handleHomeClick(){
     // this.$store.dispatch("handleResetState")
      this.$router.replace({path:"/"})
      this.$router.go()
    },
    handleLearnMore(){
      this.$store.dispatch("handlePageChange","learn-more")
    },
    handleCheckOut(){
      this.$store.dispatch("handlePageChange","checkout")
      this.$router.push({
        name:"Checkout",
        params:{
          productId:this.bottleInfo.id
        }
        })
    }
  },
  mounted(){
    this.$refs.homeCanvas.toggleLearnMoreStage()
  },
  components: {
    HomeCanvas
  },
};
</script>
<style>
  #app{
    font-family: 'Red Hat Display', sans-serif;
    height: 100%;
  }
</style>
<style scoped>
template{
  overflow-x:hidden
}
.h2{
  width:100%
}
.card-content{
  display:flex;
  justify-content: space-evenly;
  width:100%
}
.firstlayer{
  display:inline-flex;
  position:absolute;
  top:10%;
  left: 0;
  width:100%;
  height: 100%;
  justify-content: start;
  overflow-x:hidden
}

.circle,.circle-2{
  height:25px;
  width: 25px;
  background: white;
  position:absolute;
  border-radius: 50%;
  left:44%;
  opacity:0;
}

.blink-class{
  animation: blink 1.2s infinite ease-in-out
}

@keyframes blink {
  0%{
    opacity:1
  }
  25%{
    opacity:0.5
  }
  50%{
    opacity:0
  }
  75%{
    opacity:0.5
  }
  100%{
    opacity:1
  }
}

.infocard{
  justify-self: center;
  z-index:6;
  width:100%;
}
.home{
  padding:5%;
  padding-top: 5%;
  position:absolute;
  top:0;
  left: 0;
  width:90%;
  z-index:5;
  display:flex;
  align-content: space-between;
  align-items: flex-end;
  justify-content: space-between;
  overflow-x: hidden;
}
.button{
  margin:2px;
  color:#3B3C36;
  border-color: #3B3C36;
}
.homeleft{
  margin-top:3%;
  margin-bottom: 5%;
  display: inline-block;
  align-items: center;
}

.learnMoreLeft{
  width:30%;
  display:flex;
  justify-content: space-around;
  align-content: flex-start;
  align-items: center;
  flex-direction: column;
}

.homeleft div{
  width:100%;
}

.buttongroup{
  display:flex;
  justify-content:center;
}

.homeright{
  display: flex;
  justify-content: end;
  width:35vw;
}

.shoppanel{
  display: flex;
  justify-content: center;
  align-content: space-between;
  align-items: baseline;
  width:100%;
  height:70vh;
  z-index:6;
}

h1{
  font-size: 5rem;
  font-weight: 300;
}

.base{
  padding:5%;
  overflow-x:hidden;
  width:90%;
  height:100%;
  display:flex
}
</style>
