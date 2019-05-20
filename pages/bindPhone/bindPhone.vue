<template>
	<view class="bindPhone-page">
		<view class="uni-form-item">
			<input v-model="phone" class="uni-input" type="number" placeholder="请输入手机号" />
		</view>
		<view class="uni-form-item">
			<input v-model="code" class="uni-input" type="number" placeholder="请输入验证码" />
			<button class="btn-code" :disabled="countDown!=60" @tap="getCode">{{btnText}}</button>
		</view>
		<button class="btn-primary" @click="submit">确认</button>
	</view>
</template>

<script>
	import validate from '../../util/validate.js'
	export default {
		data() {
			return {
				phone:'',
				code:'',
				countDown:60,//倒计时
				btnText:'获取验证码',
			};
		},
		methods:{
			//获取验证码
			getCode(){
				this.$http.get({
					url:'/user/sendCode',
					data:{
						phone:this.phone
					}
				}).then(r=>{
					if(r.code==0){
						this.countDown=60;
						var timer=setInterval(()=>{
							this.countDown--;
							this.btnText=this.countDown+'s';
							if(this.countDown==0){
								this.countDown=60;
								this.btnText='获取验证码';
								clearInterval(timer);
							}
						},1000)
					}
				})
			},
			submit(){
				if(!validate.mobile(this.phone) || !validate.code(this.code) ){
					return;
				}
				this.$http.get({
					url:'/user/changePhone',
					data:{
						newPhone:this.phone,
						code:this.code,
						token:uni.getStorageSync('token')
					}
				}).then(r=>{
					if(r.code==0){
						uni.navigateTo({
							url:'../bindPhone/bindPhone'
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
.bindPhone-page{
	background-color: #fff;
	min-height: 100vh;
	.uni-form-item{
		display: flex;
		align-items: center;
		width: 100%;
		background-color: #fff;
		padding: 0;
		border-bottom: 1upx solid #ddd;
	}
	.uni-input{
		box-sizing: content-box;
		height: 48upx;
		line-height: 48upx;
		flex: 1;
		padding: 15rpx 25rpx;
	}
	.btn-code{
		padding-right: 30upx;
		padding-left: 30upx;
		font-size: 14px;
		color: #666;
		height: 80upx;
		line-height: 80upx;
		min-width: 200upx;
		text-align: center;
		background-color: #fff;
		border-radius: 0;
		// background-color: $color_primary;
	}
	.btn-code[disabled]{
		background-color: #ccc;
	}
	.btn-primary{
		margin:60upx 30upx;
	}
}
</style>
