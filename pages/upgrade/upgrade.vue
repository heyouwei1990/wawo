<template>
	<view class="upgradePage">
		<view class="sec-hd">
			<view class="title">会员权益</view>
		</view>
		<view class="content">
			
		</view>
		<view class="fixed-bottom">
			<button class="btn-primary" @tap="showPopup=true" v-if="price">¥{{price}} 立即购买</button>
		</view>
		<payment-popup :show="showPopup" @pay="submit" @hidePopup="showPopup=false"></payment-popup>
		<pay-password :show="showPayPassword" @completed="payByScore" @hidePopup="showPayPassword=false"></pay-password>
	</view>
</template>

<script>
	import uniPopup from '../../components/uni-popup.vue'
	import paymentPopup from '../../components/payment-popup.vue'
	import PayPassword from '../../components/pay-password.vue'
	export default {
		components:{
			paymentPopup,
			PayPassword
		},
		data() {
			return {
				rankId:2,
				price:0,
				showPayPassword: false,
				showPopup:false,
			};
		},
		onLoad(){
			this.init();
		},
		methods:{
			init(){
				this.$http.get({
					url:"/order/previewRankOrder",
					data:{
						rank_id:2
					}
				}).then(r=>{
					if(r.code==0){
						this.price=r.data.price;
						this.rankId=r.data.rank_id;
					}
				})
			},
			//选择支付方式
			payChange(index){
				this.checked=index;
			},
			//确认购买
			submit(data){
				var checkedVal=data.value;
				var type;
				switch (checkedVal){
					case 'wxpay':
						type=1;
						break;
					case 'alipay':
						type=2;
						break;
					case 'appleiap':
						type=4;
						break;
					default:
						type=3;
						this.showPayPassword=true;
						this.showPopup = false;
						return;
				}
				uni.showLoading({
					title:'请稍候……'
				})
				this.$http.get({
					url:'/order/createRankOrder',
					data:{
						rank_id:this.rankId,
						price:this.price,
						type:type
					}
				}).then(r=>{
					if(r.code==0){
						var orderInfo;
						if(type==4 && this.payment!=0){
							var orders=[r.data.order_no];
						}
						if(type==1 && this.payment!=0){
							orderInfo=JSON.stringify(r.data.pay)
						}else if(type==2 && this.payment!=0){
							orderInfo=r.data;
						}
						uni.requestPayment({
							provider:checkedVal,
							orderInfo:orderInfo,
							success(res) {
								uni.redirectTo({
									url:'../paySuccess/paySuccess'
								})
							},
							fail(err) {
								console.log('支付错误'+JSON.stringify(err))
							},
							complete() {
								uni.hideLoading();
							}
						})
						this.showPopup=false;
					}
				})
			},
			payByScore(password){
				this.$http.get({
					url: '/order/createRankOrder',
					data: {
						rank_id: this.rankId,
						price:this.price,
						type: 3,
						pay_password:password
					}
				}).then(r=>{
					if(r.code==0){
						uni.redirectTo({
							url:'../paySuccess/paySuccess'
						})
						this.showPayPassword = false;
					}
				})
			}
		}
	}
</script>

<style lang="scss">
.upgradePage{
	padding-bottom: 120upx;
	.content{
		font-size: 24upx;
		color: #666;
		line-height: 1.5;
		padding: 20upx 30upx;
		background-color: #fff;
	}
}
</style>
