<template>
	<view class="userInfoPage" v-if="userInfo">
		<view class="form-item icon-link" @tap="resetAvatar">
			<view class="label">头像</view>
			<image :src="userInfo.avatar" class="avatar" mode="aspectFill"></image>
		</view>
		<view class="form-item icon-link" @tap="popup">
			<view class="label">昵称</view>
			<view class="val">{{userInfo.customer_name}}</view>
		</view>
		<view class="form-item">
			<view class="label">手机号</view>
			<view class="val">{{userInfo.phone}}</view>
		</view>
		<view class="form-item icon-link">
			<view class="label">性别</view>
			<picker class="picker" mode="selector" range-key="label" :value="userInfo.gender" :range="genderArr" @change="genderChange">
				<view class="picker-value" v-if="userInfo.gender==0">保密</view>
				<view class="picker-value" v-if="userInfo.gender==1">男</view>
				<view class="picker-value" v-if="userInfo.gender==2">女</view>
			</picker>
		</view>
		<navigator class="form-item icon-link" url="../address/address">
			<view class="label">收货地址</view>
		</navigator>
		<view class="form-item icon-link" v-if="false">
			<view class="label">实名认证</view>
			<view class="val">{{userInfo.auth_status}}</view>
		</view>
		<popup :show="popupShow" type="middle">
			<view class="popup-inner">
				<input class="input" type="text" v-model="nickname" placeholder="请输入昵称" />
				<view class="btn-group">
					<button class="btn-default" @tap="popupShow=false">取消</button>
					<button class="btn-primary" @tap="confirm">保存</button>
				</view>
			</view>
		</popup>
	</view>
</template>

<script>
	import Popup from '../../components/uni-popup.vue'
	import Upload from '../../common/uploader.js'
	import config from '../../common/config.js'
	export default {
		components:{
			Popup
		},
		data() {
			return {
				fileName:'avatar',
				nickname:'',
				count:1,
				userInfo:'',
				genderArr:[
					{
						label:'保密',
						value:0
					},
					{
						label:'男',
						value:1
					},
					{
						label:'女',
						value:2
					},
				],
				popupShow:false,
				
			};
		},
		onLoad() {
			this.userInfo=uni.getStorageSync('userInfo');
			this.init();
		},
		methods:{
			init(){
				//获取用户信息
				this.$http.get({
					url:'/customer',
				}).then(r=>{
					if(r.code==0){
						uni.setStorageSync('userInfo',r.data);
						this.userInfo=r.data;
					}
				})
			},
			//更改头像
			async resetAvatar(){
				var path=config.host+'/img/insertImage?folder='+this.fileName;
				var url=await new Upload().choose_and_upload(this.count,path);
				this.userInfo.avatar=config.imgBaseUrl+url;
				this.$http.get({
					url:'/customer/updateAvatar',
					data:{
						avatar:this.userInfo.avatar,
					}
				}).then(r=>{
					if(r.code==0){
						this.userInfo['avatar']=r.data;
						uni.setStorageSync('userInfo',this.userInfo);
						uni.showToast({
							title:'上传成功！'
						})
					}
				})
			},
			//更改性别
			genderChange(e){
				var index=e.detail.value;
				var gender=this.genderArr[index].value
				if(this.userInfo.gender==gender){
					return false;
				}
				this.userInfo['gender']=gender;
				this.$http.get({
					url:'/customer/updateGender',
					data:{
						gender:gender,
					}
				}).then(r=>{
					if(r.code==0){
						uni.showToast({
							title:'修改成功！'
						})
						uni.setStorageSync('userInfo',this.userInfo);
					}
				})
			},
			//
			popup(){
				this.popupShow=true;
				this.nickname=this.userInfo.customer_name;
			},
			confirm(){
				if(this.nickname==''){
					uni.showToast({
						title:'请输入昵称'
					})
					return;
				}
				this.$http.get({
					url:'/customer/updateUserName',
					data:{
						customer_name:this.nickname,
					}
				}).then(r=>{
					if(r.code==0){
						uni.showToast({
							title:'修改成功！'
						})
						this.userInfo['customer_name']=this.nickname;
						uni.setStorageSync('userInfo',this.userInfo);
						this.popupShow=false;
					}
				})
			}
		}
	}
</script>

<style lang="scss">
.userInfoPage{
	.form-item{
		background-color: #fff;
		display: flex;
		align-items: center;
		justify-content: space-between;
		min-height: 88upx;
		border-bottom: 1upx solid #ddd;
		padding: 20upx 60upx 20upx 30upx;
		&:after{
			right:20upx;
		}
		.avatar{
			width: 120upx;
			height: 120upx;
			border-radius: 50%;
			background-color: #f8f8f8;
		}
		.label{
			font-size: 28upx;
			color: #333;
			line-height: 1.5;
		}
		.val{
			font-size: 28upx;
			color: #333;
			line-height: 1.5;
		}
		.picker{
			flex: 1;
			height: 48upx;
		}
		.picker-value{
			text-align: right;
		}
	}
	.popup-inner{
		padding: 40upx 60upx;
		width: 540upx;
		.input{
			width: 100%;
			height: 88upx;
			border: 1upx solid #ddd;
			border-radius: 4px;
			padding: 0 20upx;
			font-size: 28upx;
			line-height: 88upx;
		}
		.btn-group{
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-top: 30upx;
		}
		.btn-default{
			border: 1upx solid #48a7f9;
			background-color: #fff;
			color: #48a7f9;
			font-size: 28upx;
			line-height: 64upx;
			height: 64upx;
			width: 160upx;
			text-align: center;
		}
		.btn-primary{
			border: 1upx solid #48a7f9;
			background-color: #48a7f9;
			color: #fff;
			font-size: 28upx;
			line-height: 64upx;
			height: 64upx;
			width: 160upx;
			text-align: center;
		}
	}
}
</style>
