<template>
	<view class="withdrawPage">
		<view class="form">
			<view class="form-item">
				<view class="label">当前可提现金额：</view>
				<view class="val">{{balance}}</view>
			</view>
			<view class="form-item">
				<view class="label">提现金额：</view>
				<input class="input" type="digit" v-model="amount" placeholder="请输入提现金额" />
			</view>
			<view class="tip">提现将扣除手续费和税费共3%，提现申请处理成功后，将提现至中国建设银行尾号为2222的银行卡，请悉知。</view>
		</view>
		<view class="fixed-bottom">
			<button class="btn-primary" @tap="submit">提交</button>
		</view>
		<pay-password :show="showPayPassword" @completed="confirm" @hidePopup="showPayPassword=false"></pay-password>
	</view>
</template>

<script>
	import PayPassword from '../../components/pay-password.vue'
	export default {
		components:{
			PayPassword
		},
		data() {
			return {
				amount:'',
				balance:0,
				userInfo:'',
				showPayPassword: false,
			};
		},
		onLoad() {
			this.userInfo=uni.getStorageSync('userInfo');
			this.balance=this.userInfo.balance;
		},
		methods:{
			submit(){
				if(!/^[1-9]\d*$/g.test(this.amount)){
					uni.showToast({
						title:'转账额度请输入正整数',
						icon:'none'
					})
					return;
				}
				if(this.amount>this.banance){
					uni.showToast({
						title:'转账额度不能超过余额',
						icon:'none'
					})
					return;
				}
				this.showPayPassword=true;
			},
			confirm(data){
				this.$http.get({
					url:'/my/putForward',
					data:{
						price:this.amount,
						pay_password:data,
					}
				}).then(r=>{
					if(r.code==0){
						uni.showToast({
							title:'申请提现成功'
						})
						this.balance=this.balance-this.amount;
						this.userInfo['balance']=this.balance;
						uni.setStorageSync('userInfo',this.userInfo);
						this.amount='';
						this.showPayPassword=false;
					}
				})
			}
		}
	}
</script>

<style lang="scss">
.withdrawPage{
	.form{
		.form-item{
			display: flex;
			align-items: center;
			border-bottom: 1upx solid #ddd;
			background-color: #fff;
			height: 88upx;
			padding: 0 30upx;
		}
		.label{
			min-width: 140upx;
			font-size: 28upx;
			color: #333;
			line-height: 88upx;
		}
		.val{
			flex: 1;
			font-size: 28upx;
			color: #333;
			line-height: 88upx;
		}
		.input{
			flex: 1;
			height: 88upx;
			line-height: 88upx;
			padding: 0 10upx;
			font-size: 28upx;
			color: #333;
		}
		.tip{
			padding: 30upx;
			font-size: 24upx;
			color: #999;
			line-height: 1.5;
		}
	}
}
</style>
