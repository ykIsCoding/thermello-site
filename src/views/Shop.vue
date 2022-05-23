<template>
  <div class="base">
    <div class="content-row">
      <div class="left">
        <img class="image" :src="productDataImage" :alt="productData.color"/>
      </div>
      <div class="right">
        <div class="right-sub">
          <h2>Check Out</h2>
        </div>
        <NForm
          
          
          ref="formRef"
          
        >
          <div class="right-text">
            <h4>{{ productData.color }}</h4>
            <h4>${{ productData.price }}</h4>
            <NSpace justify="space-between">
              <NInputNumber
                :style="{ width: '40%' }"
                v-model:value="orderDetails.quantity"
                size="large"
              />
              <h3>Total: {{ orderDetails.quantity * product.price }}</h3>
            </NSpace>
          </div>
          <NDivider title-placement="center">Delivery Details</NDivider>

          <NSpace>
            <NFormItem :style="{ flex: 1 }" path="zip" label="ZIP Code">
              <NInput
                @keyup.enter.prevent="checkCode"
                v-model="deliveryDetails.zip"
                clearable
                placeholder="ZIP Code"
              />
            </NFormItem>
            <NFormItem :style="{ flex: 1 }" path="zip" label="State">
              <NInput
                v-model="deliveryDetails.state"
                clearable
                placeholder="State"
              />
            </NFormItem>
          </NSpace>

          <NFormItem path="zip" label="Address">
            <NInput
              v-model="deliveryDetails.address"
              clearable
              placeholder="Address"
            />
          </NFormItem>

          <NSpace justify="space-between">
            <NFormItem path="zip" label="Unit">
              <NInput
                :style="{ width: '40%' }"
                v-model="deliveryDetails.unit"
                clearable
                placeholder="Unit"
              />
            </NFormItem>
            <NFormItem path="zip" label="Building Name">
              <NInput
                v-model="deliveryDetails.buildingName"
                clearable
                placeholder="Building Name"
              />
            </NFormItem>
          </NSpace>

        </NForm>
                      <NDivider title-placement="center">Payment Details</NDivider>
          <NFormItem path="zip" label="Card Details">
            <NInput
              :style="{ flex: 5 }"
              v-model="paymentDetails.cardNumber"
              clearable
              placeholder="Card No."
            />
            <NInput
              :style="{ flex: 2 }"
              v-model="paymentDetails.cvc"
              clearable
              placeholder="CVC"
            />
            <NDatePicker
              :style="{ flex: 2 }"
              v-model:value="paymentDetails.expiryDate"
              type="month"
              clearable
            />
          </NFormItem>
          <NSpace justify="space-between">
            <NFormItem path="zip" label="Name">
              <NInput v-model="paymentDetails.name" clearable />
            </NFormItem>
            <NFormItem path="zip" label="Email">
              <NInput v-model="paymentDetails.email" clearable />
            </NFormItem>
          </NSpace>
          <NSpace justify="center">
          <NButton type="error" @click="handleFormCancel">Cancel</NButton>
          <NButton type="primary" @click="handleFormSubmit">Pay</NButton>
          </NSpace>
      </div>
    </div>
  </div>
</template>
<script>
const axios = require("axios");
export default {
  props: ["productId"],
  data() {
    return {
      paymentOption: null,
      product: {
        price: 0,
      },
      deliveryDetails: {
        zip: null,
        address: null,
        state: null,
        buildingName: null,
        unit: null,
      },
      orderDetails: {
        quantity: 1,
      },
      paymentDetails: {
        name: null,
        email: null,
        cardNumber: null,
        cvc: null,
        expiryDate: null,
      },
    };
  },
  computed: {
    productDataImage(){
      if(this.product){
        switch(this.product.color){
          case "Asphalt Grey":
            return '/img/thermelloblack.png'
          case "Peach Pink":
            return '/img/thermellopink.png'
          case "Aqua Blue":
            return '/img/thermelloblue.png'
          default:
            return '/img/thermelloblack.png'
        }
        
      }else{
        return ''
      }
    },
    productData() {
      if (this.product) {
        return this.product;
      } else {
        return "loading";
      }
    },
  },
  async mounted() {
    let bottleInfo = await this.$store.dispatch(
      "getBottleInfoById",
      this.productId
    );
    this.product = bottleInfo;
    console.log(this.product);
  },
  methods: {
    backToHome(){
      this.$router.back()
    },
    handleFormCancel(){
      this.$store.dispatch("handleResetState")
      this.$router.replace({path:"/"})
    },
    async handleFormSubmit() {
      let transactionId = await this.$store.dispatch(
        "registerPurchase",
        {
            deliveryDetails: this.deliveryDetails,
        orderDetails: this.orderDetails,
        paymentDetails:this.paymentDetails}
      );
      if(!transactionId){
          //error
      }
      this.$router.replace({path:`/order-confirmed/${transactionId}`})
    },
    async checkCode(value) {
      const API_KEY =
        "QOvTRB2MqDpGezbwMe5TO9x3R9QvV9NsENmRvNw9VSi3SVJQrPeBcq9oetr0bv8A";
      let retrievedLocation = await axios.get(
        `https://www.zipcodeapi.com/rest/${API_KEY}/info.json/${value}/degrees`,
        {
          headers: {
            //    'Access-Control-Allow-Origin': '*',
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        }
      );
      this.deliveryDetails.zip = value;
      this.deliveryDetails.address =
        retrievedLocation["acceptable_city_names"][0].city;
      this.deliveryDetails.state =
        retrievedLocation["acceptable_city_names"][0].state;
    },
  },
};
</script>
<style scoped>
.base {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 96%;
  width: 96%;
  padding: 2%;
  overflow-x: hidden;
}

.content-row {
  overflow-x: hidden;
  display: flex;
  width: 80%;
}

.right-text {
  display: block;
  justify-content: start;
}


.right {
  flex: 3;
  height: 100%;
}

.right-sub {
  display: flex;
  justify-content: start;
}

.left {
  flex:2;
  background: red;
}

.right {
  background: #D3D3D3;
  display: inline-block;
  padding: 2.5%;
}

.image{
  flex-shrink: 0;
    width: 100%;
    height: 100%
}
</style>
