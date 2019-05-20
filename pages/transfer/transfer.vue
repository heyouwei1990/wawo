<template>
	<view class="transferPage">
		<view class="payee" v-if="payee">
			<image class="avatar" :src="payee.avatar" mode="aspectFill"></image>
			<view class="fullname">{{payee.customer_name}}</view>
			<view class="phone">{{payee.phone}}</view>
		</view>
		<view class="form">
			<view class="label">转账信用额度</view>
			<input class="input" type="digit" v-model="amount" placeholder="请输入转账额度" />
			<view class="max">剩余额度：{{totalScore}}</view>
			<button class="btn-primary" @tap="transfer">转账</button>
		</view>
		<pay-password :show="showPassword" @completed="confirm" @hidePopup="showPassword=false"></pay-password>
	</view>
</template>

<script>
	import PayPassword from '../../components/pay-password.vue'
	export default {
		components:{
			PayPassword,
		},
		data() {
			return {
				payeeId:'',
				payee:'',
				userInfo:'',
				amount:'',
				totalScore:'',
				showPassword:false,
			};
		},
		async onLoad(option) {
			this.payeeId=option.id;
			this.userInfo=await uni.getStorageSync('userInfo');
			this.totalScore=this.userInfo.total_score;
			this.init();
		},
		methods:{
			init(){
				this.$http.get({
					url:'/my/previewTransfer',
					data:{
						friend_id:this.payeeId
					}
				}).then(r=>{
					if(r.code==0){
						this.payee=r.data.friend;
					}
				})
			},
			transfer(){
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
				this.showPassword=true;
			},
			confirm(data){
				// console.log(data);
				// return;
				this.$http.get({
					url:'/order/transfer',
					data:{
						friend_id:this.payeeId,
						amount:this.amount,
						pay_password:data,
					}
				}).then(r=>{
					if(r.code==0){
						uni.showToast({
							title:'转账成功'
						})
						this.totalScore=this.totalScore-this.amount;
						this.userInfo['total_score']=this.totalScore;
						uni.setStorageSync('userInfo',this.userInfo);
						this.amount='';
						this.showPassword=false;
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	.transferPage {
		.payee {
			width: 100%;
			text-align: center;
			overflow: hidden;
			padding: 100upx 30upx 40upx;
			background-color: #fff;

			.avatar {
				width: 200upx;
				height: 200upx;
				border-radius: 50%;
				background-color: #aff;
			}

			.fullname {
				font-size: 32upx;
				line-height: 1.5;
				color: #333;
			}

			.phone {
				font-size: 28upx;
				line-height: 1.5;
				color: #333;
			}
		}

		.form {
			width: 100%;
			overflow: hidden;
			padding: 20upx 30upx 40upx;
			background-color: #fff;

			.label {
				font-size: 28upx;
				line-height: 1.5;
				color: #333;
				margin-bottom: 10upx;
			}

			.input {
				width: 100%;
				height: 88upx;
				line-height: 88upx;
				border: 1upx solid #ddd;
				border-radius: 4px;
				font-size: 28upx;
				color: #333;
				padding: 0 20upx;
			}

			.max {
				font-size: 24upx;
				line-height: 1.5;
				color: #999;
				text-align: right;
				margin-top: 10upx;
			}

			.btn-primary {
				width: 100%;
				border-radius: 4px;
				margin-top: 40upx;
			}
		}
		
	}
</style>
