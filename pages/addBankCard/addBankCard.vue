<template>
	<view class="addBankCard">
		<view class="tip-msg">请添加持卡人本人的银行卡</view>
		<view class="uni-form-item">
			<label class="label">持卡人：</label>
			<input class="input" type="text" v-model="userName" placeholder="请输入持卡人姓名" />
		</view>
		<view class="uni-form-item">
			<label class="label">卡号：</label>
			<input class="input" type="number" v-model="cardNo" placeholder="请输入银行卡号" />
		</view>
		<view class="uni-form-item">
			<label class="label">开户行：</label>
			<!-- <view class="input" @click="picker">
				请选择
			</view>
			<mpvue-picker ref="mpvuePicker" mode="selector" :pickerValueArray="bankList" :pickerValueDefault="defaultBank" :deepLength="1" :themeColor="themeColor">
				
			</mpvue-picker> -->
			<picker class="selector" mode="selector" :range="bankList" range-key="bank_name" @change="picker">
				<view class="select-value" >{{bankName}}</view>
			</picker>
		</view>
		<view class="fixed-bottom">
			<button class="btn-primary" @click="submit">保存</button>
		</view>
	</view>
</template>

<script>
	import validate from '../../common/validate.js'
	import MpvuePicker from '../../components/mpvue-picker/mpvuePicker.vue'
	export default {
		components:{
			MpvuePicker
		},
		data() {
			return {
				bankList:[],
				//themeColor:'#48a7f9'
				//defaultBank:[5],
				userName:'',
				cardNo:'',
				bankId:'',
				bankName:'请选择'
			};
		},
		onLoad() {
			this.getBankList();
		},
		methods:{
			submit(){
				if(this.userName==''){
					uni.showToast({
						title:'请输入持卡人姓名',
						icon:'none'
					})
					return;
				}
				if(!validate.bankcard(this.cardNo)){
					return;
				}
				if(this.bankId===''){
					uni.showToast({
						title:'请选择开户行',
						icon:'none'
					})
					return;
				}
				this.$http.post({
					url:'/bankcard/addBankCard',
					data:{
						name :this.userName,
						bank_card_no:this.cardNo,
						bank_id:this.bankId
					}
				}).then(r=>{
					if(r.code==0){
						uni.showToast({
							title:r.data,
						})
						this.userName='';
						this.cardNo='';
						this.bankId='';
						this.bankName='请选择';
					}
				})
			},
			getBankList(){
				this.$http.get({
					url:'/bankcard/getBankList'
				}).then(r=>{
					if(r.code==0){
						this.bankList=r.data;
					}
				})
			},
			picker(e){
				var item=this.bankList[e.detail.value];
				this.bankName=item.bank_name;
				this.bankId=item.id;
			}
		}
	}
</script>

<style lang="scss">
.addBankCard{
	.tip-msg{
		padding: 20upx 30upx;
		background-color: #fff;
		border-bottom: 1upx solid #ddd;
		font-size: 24upx;
		color: #f77;
		line-height: 1.5;
	}
	.uni-form-item{
		display: flex;
		align-items: center;
		width: 100%;
		background-color: #fff;
		padding: 20upx 30upx;
		border-bottom: 1upx solid #ddd;
	}
	.label{
		min-width: 120upx;
		font-size: 28upx;
		color: #333;
		line-height: 1.5;
	}
	.input{
		box-sizing: content-box;
		height: 48upx;
		line-height: 48upx;
		flex: 1;
		font-size: 28upx;
		color: #333;
	}
	.selector{
		flex: 1;
	}
	.select-value{
		height: 48upx;
		line-height: 48upx;
		font-size: 28upx;
		color: #333;
	}
}
</style>
