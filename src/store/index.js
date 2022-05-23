import { createStore } from "vuex";
import { v4 as uuidv4 } from 'uuid';

const bottleInformation = [
  {
    id:1,
    name:"blueGroup",
    color:"Aqua Blue",
    price:15.00
  },
  {
    id:2,
    name:"pinkGroup",
    color:"Peach Pink",
    price:15.00
  },
  {
    id:3,
    name:"blackGroup",
    color:"Asphalt Grey",
    price:15.00
  }
]

export default createStore({
  state: {
    currentPage: "home",
    viewingBottle:null,
    orders:[]
  },
  mutations: {
    changeCurrentPage(state,np){
      state.currentPage = np
    },
    changeViewingBottle(state,nvb){
      state.viewingBottle = nvb
    },
    addOrders(state,order){
      state.orders.push(order)
    },
    resetState(state){
      state.currentPage= "home",
      state.viewingBottle=null,
      state.orders=[]
    }
  },
  getters:{
    getCurrentPage(state){
      console.log("getter")
      return state.currentPage
    },
    getViewingBottle(state){
      return state.viewingBottle
    }
  },
  actions: {
    handleResetState(context){
      context.commit("resetState")
    },
    registerPurchase(context,allData){
      let order = {
        status:'Processed',
        transactionId:uuidv4(),
        orderPlacedOn: Date.now(),
        ...allData
      }
      context.commit("addOrders",order)
      return order.transactionId
    },
    handlePageChange(context,np){
      context.commit("changeCurrentPage",np)
    },
    handleViewingBottleChange(context,nvb){
      context.commit("changeViewingBottle",nvb)
    },
    getBottleInfo(_,bv){
      return bottleInformation.find(bi=>bi.name==bv)
    },
    getBottleInfoById(_,bv){
      return bottleInformation.find(bi=>bi.id==bv)
    },
    getOrderByTransactionId(context,tid){
      //console.log(context.state.orders.find(x=>x.transactionId==tid))
      return context.state.orders.find(x=>x.transactionId==tid)
    }
  },
  modules: {

  },
});
