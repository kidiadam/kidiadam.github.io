<template>
    <div>
        <loading :active.sync="isLoading"></loading>
        <div class="row mt-4">
        <div class="col-md-4 mb-4" v-for="item in products" :key="item.id">
            <div class="card border-0 shadow-sm">
                <div style="height: 150px; background-size: cover; background-position: center"
                :style="{backgroundImage:`url(${item.imageUrl})`}"></div>
                <div class="card-body">
                    <span class="badge badge-secondary float-right ml-2">{{item.category}}</span>
                    <h5 class="card-title">
                        <a href="#" class="text-dark">{{item.title}}</a>
                    </h5>
                    <p class="card-text">{{item.content}}</p>
                    <div class="d-flex justify-content-between align-items-baseline">
                        <!-- <div class="h5">2,800 元</div> -->
                        <del class="h6">原價 {{item.origin_price | currency}} 元</del>
                        <div class="h5">現在只要 {{item.price | currency}} 元</div>
                    </div>
                </div>
                <div class="card-footer d-flex">
                    <button type="button" class="btn btn-outline-secondary btn-sm" @click="getDetail(item.id)">
                        <i class="fas fa-spinner fa-spin" v-if="status.itemLoading == item.id"></i>
                    查看更多
                    </button>
                    <button type="button" class="btn btn-outline-danger btn-sm ml-auto" @click="addToCar(item.id)">
                        <i class="fas fa-spinner fa-spin" v-if="status.itemLoading == item.id"></i>
                        加到購物車
                    </button>
                </div>
            </div>
            </div>
        </div>
        <table class="table" v-if="orederLen != 0">
            <thead>
                <th></th>
                <th>品名</th>
                <th>數量</th>
                <th class="align-middle text-right">小計</th>
            </thead>
            <tbody>
                <tr v-for="item in carts.carts" :key="item.id">
                <td class="align-middle">
                    <button type="button" class="btn btn-outline-danger btn-sm" @click="removeCartItem(item.id)">
                    <i class="far fa-trash-alt"></i>
                    </button>
                </td>
                <td class="align-middle">
                    {{ item.product.title }}
                    <!-- <div class="text-success" v-if="item.coupon">
                    已套用優惠券
                    </div> -->
                </td>
                <td class="align-middle">{{ item.qty }}{{ item.product.unit }}</td>
                <td class="align-middle text-right">{{ item.final_total | currency }}</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                <td colspan="3" class="text-right">總計</td>
                <td class="text-right">{{ carts.total | currency }}</td>
                </tr>
                <tr v-if="carts.total !== carts.final_total">
                <td colspan="3" class="text-right text-success">折扣價</td>
                <td class="text-right text-success">{{ carts.final_total | currency }}</td>
                </tr>
            </tfoot>
        </table>
            <div class="input-group mb-5 input-group-sm" v-if="orederLen != 0">
                <input type="text" class="form-control" placeholder="請輸入優惠碼" v-model="coupon_code">
                <div class="input-group-append">
                    <button class="btn btn-outline-secondary" type="button" @click="addCouponCode">套用優惠碼</button>
                </div>
            </div>

            <div class="my-5 row justify-content-center" v-if="orederLen != 0">
                <form class="col-md-6" @submit.prevent="orderForm">
                    <div class="form-group">
                        <label for="useremail">Email</label>
                        <input type="email" class="form-control" name="email" id="useremail" v-validate="'required|email'"
                        v-model="form.user.email" placeholder="請輸入 Email" :class="{'is-invalid':errors.has('email')}">
                        <span class="text-danger" v-if="errors.has('email')">{{ errors.first('email') }}</span>
                    </div>              
                    <div class="form-group">
                        <label for="username">收件人姓名</label>
                        <input type="text" class="form-control" name="name" id="username" v-model="form.user.name"
                         placeholder="輸入姓名" v-validate="'required'" :class="{'is-invalid':errors.has('name')}">
                        <span class="text-danger" v-if="errors.has('name')">姓名不得為空</span>
                    </div>
                
                    <div class="form-group">
                        <label for="usertel">收件人電話</label>
                        <input type="tel" class="form-control" id="usertel" v-model="form.user.tel" placeholder="請輸入電話">
                    </div>              
                    <div class="form-group">
                        <label for="useraddress">收件人地址</label>
                        <input type="address" class="form-control" name="address" id="useraddress" v-model="form.user.address"
                        placeholder="請輸入地址" v-validate="'required'" :class="{'is-invalid':errors.has('address')}">
                        <span class="text-danger" v-if="errors.has('address')">地址欄位不得留空</span>
                    </div>
                
                    <div class="form-group">
                        <label for="useraddress">留言</label>
                        <textarea name="" id="" class="form-control" cols="30" rows="10" v-model="form.message"></textarea>
                    </div>
                    <div class="text-right">
                       <button class="btn btn-danger">送出訂單</button>
                    </div>
                </form>
            </div>
<!-- ---------modal------------ -->
        <div class="modal fade" id="detailModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header bg-dark text-white">
                        <h5 class="modal-title" id="exampleModalLabel">{{product.title}}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <img class="img-fluid" :src="product.imageUrl" alt="">
                        <blockquote class="blockquote mt-3">
                            <p>{{product.content}}</p>
                            <footer class="blockquote-footer text-right">{{product.description}}</footer>
                        </blockquote>
                        <div class="d-flex justify-content-between align-items-baseline">
                                <div class="h4" v-if="!product.price">{{product.origin_price | currency}}元</div>
                                <div class="h6" v-if="product.price">原價{{product.origin_price | currency}}元</div>
                                <div class="h4" v-if="product.price">現在只要{{product.price | currency}}元</div>
                        </div>
                        <select name="" class="form-control mt-3" v-model="product.num">
                            <option :value="num" v-for="num in 10" :key="num">選購{{num}}{{product.unit}}</option>
                        </select>
                    </div>
                    <div class="modal-footer">
                        <div class="text-muted text-nowrap mr-3">
                            小計<strong>{{product.num * product.price | currency}}</strong>元
                        </div>
                        <button class="btn btn-primary" @click="addToCar(product.id,product.num)">加到購物車</button>
                    </div>
                </div>
            </div>            
        </div>
    </div>
</template>
<script>
import $ from 'jquery';
export default {
    data(){
        return {
            products:[],
            isLoading:false,
            product:{},
            carts:{},
            coupon_code:'',
            orederLen:0,
            form:{
                user:{
                    name:'',
                    email:'',
                    tel:'',
                    address:''
                },
                message:'',
            },
            status:{
                itemLoading:'',
            }
        }
    },
    methods:{
        getProduct(){
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products`
            const vm = this;
            vm.isLoading = true;
            this.$http.get(api).then((response) => {
            console.log(response.data);
            vm.isLoading = false;
            vm.products = response.data.products;
            })
        },
        getDetail(id){
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/product/${id}`
            const vm = this;
            vm.status.itemLoading = id;
            this.$http.get(api).then((response) => {
            // console.log(response.data);
            vm.product = response.data.product;
            this.$set(vm.product,'num',1);
            $('#detailModal').modal('show');
             vm.status.itemLoading = '';

            })
        },
        addToCar(id,qty = 1){
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`
            const vm = this;
            const cart = {
                 product_id:id,
                 qty     //物件名稱與參數名稱相同可以直接省略
            }
            vm.status.itemLoading = id;
            this.$http.post(api,{data:cart}).then((response) => {
            // console.log(response);
            vm.status.itemLoading = '';
            vm.getCart();
            $('#detailModal').modal('hide');
            })
        },
        getCart(){
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`
            const vm = this;
            vm.isLoading = true;
            this.$http.get(api).then((response) => {
                vm.carts = response.data.data;
                vm.orederLen = vm.carts.carts.length;
                console.log(response);
                vm.isLoading = false;
            }) 
        },
        removeCartItem(id){
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart/${id}`
            const vm = this;
            vm.isLoading = true;
            this.$http.delete(api).then((response) => {
                vm.getCart();
                console.log(response);
                vm.isLoading = false;
            }) 
        },
        addCouponCode(){
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/coupon`
            const vm = this;
            const coupon = {
            code:vm.coupon_code
            };
            vm.isLoading = true;
            this.$http.post(api,{data:coupon}).then((response) => {
                console.log(response);
                vm.isLoading = false;
                vm.getCart();
            }) 
        },
        orderForm(){
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/order`
            const vm = this;
            const order = vm.form;
            this.$validator.validate().then((result) => {
                if (result) {
                   this.$http.post(api,{data:order}).then((response) => {
                        console.log('訂單：',response);
                        if(response.data.success){
                            vm.$router.push(`/checkout/${response.data.orderId}`)
                        }
                        vm.isLoading = false;
                    })  
                }else{
                    console.log('欄位不完整')
                }
            });
        }
    },
    created(){
        this.getProduct();
        this.getCart();
    }
}
</script>
