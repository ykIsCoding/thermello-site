<template>
    <h1>PAGE NOT FOUND</h1>
    <h3>{{this.$route.path}} does not exist.</h3>
    <h5>You will be redirected back to home in</h5>
    <NCountdown :on-finish="redirectBackHome" :duration="10000" :active="active" />
</template>
<script>
import {NCountdown} from "naive-ui"
export default {
    methods:{
        redirectBackHome(){
            this.$router.replace({path:"/"})
        }
    },
    components:{
        NCountdown
    },
}
</script>

