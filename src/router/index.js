import Vue from 'vue';
import Router from 'vue-router';
// import HelloWorld from '@/components/HelloWorld';
import Dashbord from '@/components/dashbord';
import Login from '@/components/pages/login';
import Product from '@/components/pages/product';
import Orders from '@/components/pages/orders';
import Coupon from '@/components/pages/coupon';
import OrderList from '@/components/pages/orderList';
import Checkout from '@/components/pages/checkout';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'*',
      redirect:'login',
    },
    {
      path:'/login',
      name:'Login',
      component:Login
    },{
    path: '/admin',
    name: 'Dashbord',
    component: Dashbord,
    children:[
      {
        path:'product',  //子路徑不用加/
        name:'Product',
        component:Product,
        meta: { requiresAuth: true },
      },{
        path:'coupon',  
        name:'Coupon',
        component:Coupon,
        meta: { requiresAuth: true },
      },{
        path:'orderList',  
        name:'OrderList',
        component:OrderList,
        meta: { requiresAuth: true },
      }
    ]
    },{
    path: '/',
    name: '',
    component: Dashbord,
    children:[
      {
        path:'test_orders',  
        name:'Orders',
        component:Orders,
      },{
        path:'checkout/:orderId',  
        name:'Checkout',
        component:Checkout,
      },
    ]
    },
  ]
})
