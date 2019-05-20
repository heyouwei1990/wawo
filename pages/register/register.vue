<template>
	<view class="registerPage" :class="{isH5:isH5}">
		<view class="form">
			<label for="invitation" class="form-item">
				<input class="input" v-model="recommendPhone" type="number" id="invitation" placeholder="推荐人手机号" />
			</label>
			<label for="phone" class="form-item">
				<input class="input" v-model="phone" type="number" id="phone" placeholder="请输入手机号" />
			</label>
			<label for="code" class="form-item">
				<input class="input" v-model="code" type="number" id="code" placeholder="请输入验证码" />
				<button class="btn-code" @tap="getCode(phone)" v-if="sec==60">获取验证码</button>
				<button class="btn-code" v-else>{{sec}}s</button>
			</label>
			<label for="password" class="form-item">
				<input class="input" v-model="password" type="text" id="password" :password="hidePassword" placeholder="请输入密码" />
				<view class="iconfont" :class="{'icon-look':!hidePassword,'icon-eye-close':hidePassword,}" @tap="ctrlPassword"></view>
			</label>
			<label for="password2" class="form-item">
				<input class="input" v-model="password2" type="text" id="password2" :password="hidePassword2" placeholder="请确认密码" />
				<view class="iconfont" :class="{'icon-look':!hidePassword2,'icon-eye-close':hidePassword2,}" @tap="ctrlPassword2"></view>
			</label>
			<view class="tip">密码须为6-20个英文字母或数字,区分大小写</view>
			<view class="uni-center">
				<view class="agree" @click="agree">
					<text class="uni-icon" :class="{'uni-icon-checkmarkempty':isAgree}"></text>我已阅读并同意 
					<view class="deal" @tap="lookDeal">《哇喔用户协议》</view>
					</view>
			</view>
			<button class="btn-register" @tap="submit">注册</button>
		</view>
	</view>
</template>

<script>
	import validate from '../../common/validate.js'
	export default {
		data() {
			return {
				isH5:false,
				hidePassword:true,
				hidePassword2:true,
				isAgree:false,
				phone:'',
				code:'',
				recommendPhone:'',
				password:'',
				password2:'',
				sec:60,
				dealUrl:'http://wawoapi.haomaieco.cn/api/h5/wawoprivacy'
			};
		},
		onLoad() {
			// #ifdef H5
			this.isH5=true;
			// #endif
		},
		methods:{
			//密码显示、隐藏
			ctrlPassword(){
				this.hidePassword=!this.hidePassword;
			},
			//确认密码显示、隐藏
			ctrlPassword2(){
				this.hidePassword2=!this.hidePassword2;
			},
			//同意协议
			agree(){
				this.isAgree=!this.isAgree;
			},
			lookDeal(){
				uni.navigateTo({
					url:'../webview/webview?url='+this.dealUrl
				})
			},
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
			//注册
			submit(){
				if(!validate.mobile(this.phone) || 
				!validate.optionalMobile(this.recommendPhone) || 
				!validate.code(this.code) || 
				!validate.password(this.password)){
					return;
				}
				if(this.password!==this.password2){
					uni.showToast({
						title:'密码不一致，请确认密码',
						icon:'none'
					})
					return;
				}
				if(!this.isAgree){
					uni.showToast({
						title:'请阅读并同意《哇喔用户协议》',
						icon:'none'
					})
					return;
				}
				this.$http.post({
					url:'/customer/register',
					data:{
						phone:this.phone,
						code:this.code,
						recommendPhone:this.recommendPhone,
						password:this.password
					}
				}).then(r=>{
					if(r.code==0){
						uni.showToast({
							title:'注册成功'
						})
						uni.reLaunch({
							url:'../login/login'
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
.registerPage{
	background-color: #fff;
	min-height: 100vh;
	&.isH5{
		min-height: calc(100vh - var(--window-top));
	}
	.form{
		padding: 30upx;
		.form-item{
			background-color: #f8f8f8;
			margin-bottom: 20upx;
			border-radius: 4px;
			display: flex;
		}
		.input{
			flex: 1;
			min-width: 100upx;
			height: 48upx;
			padding: 20upx;
			box-sizing: content-box;
			color: #333;
			font-size: 28upx;
			line-height: 48upx;
		}
		.btn-code{
			font-size: 28upx;
			color: #007AFF;
			line-height: 88upx;
			padding-right: 20upx;
			padding-left: 20upx;
		}
		.iconfont{
			color: #ccc;
			padding: 20upx;
		}
		.tip{
			font-size: 24upx;
			color: #333;
			line-height: 1.5;
		}
		.btn-register{
			height: 88upx;
			font-size: 32upx;
			line-height: 88upx;
			color: #fff;
			margin-top: 40upx;
			background:#0193fe;
			&[disabled]{
				background: #ccc;
			}
		}
	}
	.agree{
		display: inline-block;
		margin-top: 20upx;
		color: #333;
		font-size: 24upx;
		.uni-icon{
			display: inline-block;
			vertical-align: middle;
			overflow: hidden;
			width: 28upx;
			height: 28upx;
			border: 1upx solid #ccc;
			position: relative;
			margin-right: 10upx;
			margin-top: -5upx;
			&.uni-icon-checkmarkempty{
				color: #66D27E;
				border-color: #66D27E;
			}
			&:before{
				position: absolute;
				left: 50%;
				top: 50%;
				margin-top: 1px;
				transform: translate(-50%,-50%);
			}
		}
		.deal{
			display: inline;
			color: #007AFF;
			font-size: 24upx;
		}
	}
}
</style>
