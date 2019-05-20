<template>
	<view class="setPayPassword">
		<label for="phone" class="uni-form-item">
			<input class="uni-input" v-model="phone" type="number" id="phone" placeholder="请输入手机号" />
		</label>
		<label for="code" class="uni-form-item">
			<input class="uni-input" v-model="code" type="number" id="code" placeholder="请输入验证码" />
			<button class="btn-code" type="text" @tap="getCode(phone)" v-if="sec==60">获取验证码</button>
			<button class="btn-code" v-else>{{sec}}s</button>
		</label>
		<view class="uni-form-item">
			<input v-model="password" class="uni-input" :maxlength="6" type="text" :password="hidePassword" placeholder="请输入支付密码" />
			<view class="iconfont" :class="{'icon-look':!hidePassword,'icon-eye-close':hidePassword,}" @tap="ctrlPassword"></view>
		</view>
		<view class="uni-form-item">
			<input v-model="password2" class="uni-input" :maxlength="6" type="text" :password="hidePassword2" placeholder="请再次输入支付密码" />
			<view class="iconfont" :class="{'icon-look':!hidePassword2,'icon-eye-close':hidePassword2,}" @tap="ctrlPassword2"></view>
		</view>
		<view class="tip-msg">支付密码为6位数字</view>
		<button class="btn-primary" @tap="submit">提交</button>
	</view>
</template>

<script>
	import validate from '../../common/validate.js'
	export default {
		data() {
			return {
				password:'',
				password2:'',
				phone:'',
				code:'',
				sec:60, //倒计时60s
				hidePassword:true,
				hidePassword2:true,
			};
		},
		async onShow(){
			var token= await uni.getStorageSync('Jwt');
			this.type=!token?1:2
		},
		methods:{
			//获取验证码
			getCode(phone){
				if(!validate.mobile(phone)){
					return;
				}
				this.$http.get({
					url:'/customer/sendCode',
					data:{
						phone:phone
					}
				}).then(r=>{
					if(r.code==0){
						uni.showToast({
							title:'验证码已发送！'
						})
						this.countdown();
					}
				})
			},
			//密码显示、隐藏
			ctrlPassword(){
				this.hidePassword=!this.hidePassword;
			},
			//确认密码显示、隐藏
			ctrlPassword2(){
				this.hidePassword2=!this.hidePassword2;
			},
			//倒计时
			countdown(){
				let timer=setInterval(()=>{
					this.sec--;
					if(this.sec==0){
						clearInterval(timer);
						this.sec=60;
					}
				},1000)
			},
			submit(){
				if(!validate.mobile(this.phone) || 
				!validate.code(this.code) || 
				!validate.payPassword(this.password)){
					return;
				}
				if(this.password!==this.password2){
					uni.showToast({
						title:'密码不一致，请确认密码',
						icon:'none'
					})
					return;
				}
				this.$http.post({
					url:'/customer/updatePayPassword',
					data:{
						phone:this.phone,
						code:this.code,
						pay_password:this.password,
					}
				}).then(r=>{
					if(r.code==0){
						uni.showToast({
							title:'设置成功!'
						});
						uni.navigateBack({
							delta:1
						})
					}
				})
			},
		}
	}
</script>

<style lang="scss">
.setPayPassword{
	background-color: #fff;
	min-height: 100vh;
	.tip-msg{
		padding: 20upx 30upx;
		color: #999;
		line-height: 1.5;
		font-size: 24upx;
	}
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
		padding: 16upx 25upx;
		font-size: 28upx;
		color: #333;
	}
	.btn-code{
		padding-right: 30upx;
		padding-left: 30upx;
		font-size: 14px;
		color: #00a0ff;
		height: 80upx;
		line-height: 80upx;
		min-width: 200upx;
		text-align: center;
		background-color: #fff;
		border-radius: 0;
		// background-color: $color_primary;
	}
	.iconfont{
		color: #ccc;
		padding:16upx 20upx;
	}
	.btn-code[disabled]{
		background-color: #ccc;
	}
	.btn-primary{
		margin:60upx 30upx;
	}
}
</style>
