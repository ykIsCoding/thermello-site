<template>
    <div class="main">
    <h1>Order Confirmed!</h1>
    <NSpace justify="center">
    <NCard v-show="orderDetails" title="Your Order Details">
        <NSpace justify="space-between">
        <h5>Order is {{orderDetails.status}}</h5>
        <NButton>Print</NButton>
        </NSpace>
        <NSpace vertical>
            <h5>Deliver To:</h5>
            <div class="detailsLeft">
                <h6>
                    {{recipientDetails('name')}}
                </h6>
                <h6>
                    {{addressLine}}
                </h6>
            </div>
        </NSpace>
        <NSpace vertical>
            <h5>Bill To:</h5>
            <div class="detailsLeft">
                <h6>
                    {{recipientDetails('name')}}
                    {{recipientDetails('email')}}
                </h6>
            </div>
        </NSpace>
        <template #footer>
            <NSpace vertical>
                 <p>Transaction ID: {{orderDetails.transactionId}}</p>
            <p>Order made on: 
                 <NTime :time="orderTime" format="yyyy-MM-dd hh:mm:ss" />
            </p>
            </NSpace>
        </template>
          <template #action>
      <NButton @click="navigateHome">Back To Home</NButton>
    </template>
    </NCard>
    </NSpace>
    <h2>Thank you for your purchase</h2>
    </div>
</template>
<script>
import {NTime} from "naive-ui"
export default {
    components:{
        NTime
    },
    data(){
        return {
            details:null
        }
    },
    methods:{
        recipientDetails(x){
            if(this.details==null) return "loading"
            return this.details.paymentDetails[x]
        },
        navigateHome(){
            this.$router.push({path:'/'})
        }
    },
    computed:{
        addressLine(){
            if(this.details==null) return "loading"
            const {
                address,
                zip,
                unit,
                buildingName,
                state
            } = this.details.deliveryDetails
            return `${unit} ${address}, ${buildingName} ${state} ${zip}`
        },
        orderTime(){
            if(this.details==null) return 0
            return new Date(this.details.orderPlacedOn)
        },
        orderDetails(){
            if(this.details==null) return false
            return this.details
        }
    },
    async mounted(){
        this.details = await this.$store.dispatch('getOrderByTransactionId',this.$route.params.transactionId)
        if(this.details==null){
            this.$router.replace({path:'/'})
        }
        console.log(this.details.deliveryDetails,'match')
        console.log(this.details,'match')
        console.log(this.details.paymentDetails,'match')
        console.log(this.details.orderDetails,'match')
    }
}
</script>

<style scoped>
.main{
    display:block;
}
.detailsLeft{
    display:flex;
    justify-content: start;
    justify-items: start;
}
</style>