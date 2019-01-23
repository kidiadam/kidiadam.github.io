<template>
    <div>
        <loading :active.sync="isLoading"></loading>
        <div class="text-right">
            <button class="btn btn-primary mt-4" @click="openModal(true)">建立新的優惠券</button>
        </div>
            <table class="table mt-4">
                <thead>
                    <tr>
                        <th>名稱</th>
                        <th>代碼</th>
                        <th>折扣內容</th>
                        <th>到期日</th>
                        <th>是否啟用</th>
                        <th>編輯</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item) in coupons" :key="item.id">
                        <td>{{item.title}}</td>
                        <td>{{item.code}}</td>
                        <td>{{item.percent}}</td>
                        <td>{{item.due_date}}</td>
                        <td>
                            <span class="text-success" v-if="item.is_enabled == 1">啟用</span>
                            <span v-else>未啟用</span>
                        </td>
                        <td align="right" class="d-flex">
                            <button class="btn btn-outline-primary btn-sm" @click="openModal(false,item)">編輯</button>
                            <button class="btn btn-outline-warning btn-sm text-danger" @click="delCouponModal(item)">刪除</button>                          
                        </td>
                    </tr>
                </tbody>
            </table>
            <pagination :pagination="pagination" @pageChange="getCoupon"></pagination>
<!-- ---------------------------------modal------------------------------- -->
            <div class="modal fade" id="couponModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-sm" role="document">
                    <div class="modal-content border-0">
                        <div class="modal-header bg-dark text-white">
                            <h5 class="modal-title" id="exampleModalLabel">
                                <span v-if="isNew">新增優惠券</span>
                                <span v-else>編輯優惠券</span>
                            </h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-sm-12">
                                    <div class="form-group">
                                        <label for="title">標題</label>
                                        <input type="text" v-model="tempCoupon.title" class="form-control" id="title" placeholder="請輸入標題">
                                    </div>
                                    <div class="form-row">
                                    <div class="form-group col-md-10">
                                        <label for="percent">折扣內容</label>
                                        <input type="number" v-model="tempCoupon.percent" class="form-control" id="percent" placeholder="請輸入1~100之整數">
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label for="code">優惠券代碼</label>
                                        <input type="text" v-model="tempCoupon.code" class="form-control" id="code" placeholder="英數組成">
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label for="duedate">到期日</label>
                                        <input type="text" class="form-control" v-model="tempCoupon.due_date" id="duedate" placeholder="例2019/01/31">
                                    </div>
                                </div>
                                <hr>
                                <div class="form-group">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="is_enabled" 
                                        v-model="tempCoupon.is_enabled" :true-value="1" :false-value="0">
                                        <label class="form-check-label" for="is_enabled">是否啟用</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-primary" @click="updateCoupon">確認</button>
                    </div>
                </div>
                </div>
            </div>

            <div class="modal fade" id="delCouponModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content border-0">
                        <div class="modal-header bg-danger text-white">
                            <h5 class="modal-title" id="exampleModalLabel">
                                <span>刪除優惠券</span>
                            </h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            是否刪除 <strong class="text-danger">{{ tempCoupon.title }}</strong> 優惠券(刪除後將無法恢復)。
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                            <button type="button" class="btn btn-danger" @click="deleteCoupon"
                            >確認刪除</button>
                        </div>
                    </div>
                </div>
            </div>
    </div>
</template>
<script>
import $ from 'jquery';
import Pagination from '@/components/pagination';

export default {
    components:{
        Pagination,
    },
    data(){
        return {
            coupons:[],
            pagination:{},
            tempCoupon:{},
            isNew:false,
            isLoading:false,
            status:{
                fileUploading:false,
            }
        }
    },
    methods:{
        getCoupon(page = 1){
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupons?page=${page}`
            const vm = this;
            vm.isLoading = true;
            this.$http.get(api).then((response) => {
            console.log(response.data);
            vm.isLoading = false;
            vm.coupons = response.data.coupons;
            vm.pagination = response.data.pagination;
            })
        },
        openModal(New,item){

            if(New){
                this.tempCoupon = {};
                this.isNew = true;
            }else{
                this.tempCoupon = Object.assign({},item);
                this.isNew = false;
            };
            $('#couponModal').modal('show');
        },
        updateCoupon(){
            let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon`;
            let httpMethod = 'post'
            const vm = this;
            if(!vm.isNew){
                api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${vm.tempCoupon.id}`;
                httpMethod = 'put'
            }
            this.$http[httpMethod](api,{data: vm.tempCoupon}).then((response) => {
                console.log(response.data);
                if(response.data.success){
                    $('#couponModal').modal('hide');
                    vm.getCoupon();
                }else{
                    $('#couponModal').modal('hide');
                    vm.getCoupon();
                    cosole.log('新增失敗');
                }
            })
        },
        delCouponModal(item){
            $('#delCouponModal').modal('show')
             this.tempCoupon = Object.assign({},item);  
        },
        deleteCoupon(){
            const vm = this;
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/coupon/${vm.tempCoupon.id}`;
            this.$http.delete(api).then((response) => {
                console.log(response.data);
                $('#delCouponModal').modal('hide');
                vm.getCoupon();
            })
        },
    },
    created(){
        this.getCoupon();
    }
}
</script>