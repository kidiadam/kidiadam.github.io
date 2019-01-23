<template>
    <div>
        <loading :active.sync="isLoading"></loading>
            <table class="table mt-4">
                <thead>
                    <tr>
                        <th>下單時間</th>
                        <th>編號</th>
                        <th>姓名</th>
                        <th>email</th>
                        <th>電話</th>
                        <th>備註</th>
                        <th>金額</th>
                        <th>付款狀態</th>
                        <th>編輯</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item) in orders" :key="item.id">
                        <td>{{item.create_at | timestamps}}</td>
                        <td>{{item.id}}</td>
                        <td>{{item.user.name}}</td>
                        <td>{{item.user.email}}</td>
                        <td>{{item.user.tel}}</td>
                        <td>{{item.message}}</td>
                        <td>{{item.total | currency}}</td>
                        <td>
                            <span v-if="item.is_paid">已付款</span>
                            <span class="text-danger" v-else>未付款</span>
                        </td>
                        <td><button class="btn btn-outline-primary btn-sm" @click="openModal(item)">編輯</button></td>
                    </tr>
                </tbody>
            </table>
            <pagination :pagination="pagination" @pageChange="getList"></pagination>

            <div class="modal fade" id="listModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg" role="document">
                    <div class="modal-content border-0">
                        <div class="modal-header bg-dark text-white">
                            <h5 class="modal-title" id="exampleModalLabel">
                                <span>修改訂單</span>
                            </h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-sm-12">
                                    <div class="form-group">
                                        <label for="listId">訂單編號</label>
                                        <input type="text" v-model="tempOrder.id" class="form-control" id="listId" placeholder="請輸入編號">
                                    </div>
                                    <div class="form-row">
                                        <div class="form-group col-md-6">
                                            <label for="orderName">訂購人</label>
                                            <input type="text" v-model="tempOrder.user.name" class="form-control" id="orderName" placeholder="姓名">
                                        </div>
                                        <div class="form-group col-md-6">
                                            <label for="phoneNum">電話</label>
                                            <input type="number" v-model="tempOrder.user.tel" class="form-control" id="phoneNum" placeholder="email">
                                        </div>
                                    </div>
                                    <div class="form-row">
                                        <div class="form-group col-md-12">
                                            <label for="addr">地址</label>
                                            <input type="text" class="form-control" v-model="tempOrder.user.address" id="addr" placeholder="請輸入通訊地址">
                                        </div>
                                    </div>
                                    <div class="form-row">
                                        <div class="form-group col-md-6">
                                            <label for="emailAdd">電子郵件</label>
                                            <input type="email" v-model="tempOrder.user.email" class="form-control" id="emailAdd" placeholder="email">
                                        </div>
                                        <div class="form-group col-md-6">
                                            <label for="money">金額</label>
                                            <input type="number" class="form-control" v-model="tempOrder.total" id="money" placeholder="消費金額">
                                        </div>
                                    </div>
                                    <div class="form-row">
                                        <div class="form-group col-md-4">
                                            <input type="radio" name="paid" v-model="tempOrder.is_paid" id="paid" value="true">
                                            <label for="paid">付款完成</label>
                                        </div>
                                        <div class="form-group col-md-4">
                                            <input type="radio" name="paid" v-model="tempOrder.is_paid" id="notpaid" value="false">
                                            <label for="notpaid">尚未付款</label>
                                        </div>
                                    </div> 
                                    <hr>
                                </div>
                            </div>
                        </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
                        <button type="button" class="btn btn-primary" @click="updateOrderList(tempOrder.id)">確認</button>
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
            orders:[],
            pagination:{},
            tempOrder:{
                user:{}
            },
        }
    },
    methods:{
        getList(page = 1){
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/orders?page=${page}`
            const vm = this;
            vm.isLoading = true;
            this.$http.get(api).then((response) => {
            vm.orders = response.data.orders;
            console.log('訂單',response);
            vm.isLoading = false;
            vm.pagination = response.data.pagination;
            })
        },
        openModal(item){
            const vm = this;
            // vm.tempOrder = Object.assign({},item);
            vm.tempOrder = JSON.parse(JSON.stringify(item))
            console.log('aaa',vm.tempOrder)
            $('#listModal').modal('show');
        },
        updateOrderList(id){
            const api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/order/${id}`
            const vm = this;
            vm.isLoading = true;
            this.$http.put(api,{data:vm.tempOrder}).then((response) => {
                if(response.data.success){
                    $('#listModal').modal('hide');
                    vm.getList();
                }else{
                    $('#listModal').modal('hide');
                    vm.getList();
                    cosole.log('新增失敗');
                }
            vm.isLoading = false;
            })
        }
    },
    created(){
        this. getList()
    }
}
</script>
