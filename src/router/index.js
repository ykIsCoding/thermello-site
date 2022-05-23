import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";
import Shop from "../views/Shop.vue"
import store from '../store/index'
import PageNotFound from '../views/404.vue'
import OrderConfirmation from '../views/OrderConfirmation.vue'

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path:"/checkout",
    name:"Checkout",
    props:true,
    component:Shop
  },
  {
    path:'/order-confirmed/:transactionId',
    props:true,
    component:OrderConfirmation
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    // will match everything
    path: '/:pathMatch(.*)*',
    name:'PageNotFound',
    component:PageNotFound
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, _, next) => {
  console.log(to,store.getters.getViewingBottle)
  if (to.name == 'Checkout' && !store.getters.getViewingBottle){
    //console.log('checkout')
    next({name:"PageNotFound"})
  }else{
    next()
  }
  //next()
})

export default router;
