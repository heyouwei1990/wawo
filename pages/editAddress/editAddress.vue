<template>
	<view class="editAddress">
		<view class="form">
			<view class="form-item">
				<view class="label">收货人</view>
				<input class="input" type="text" v-model="recv_person" />
			</view>
			<view class="form-item">
				<view class="label">手机号码</view>
				<input class="input" type="number" v-model="recv_phone" />
			</view>
			<view class="form-item">
				<view class="label">所在地区</view>
				<div class="input" @tap="showPicker">
					<mpvue-city-picker :themeColor="themeColor" :address="recv_district" ref="mpvueCityPicker" @onConfirm="onConfirm"></mpvue-city-picker>
				</div>
			</view>
			<view class="form-item">
				<view class="label">详细地址</view>
				<textarea class="textarea" v-model="recv_addr" placeholder="请输入详细地址" />
			</view>
			<view class="form-item switch-item">
				<view class="label">设为默认地址</view>
				<switch :checked="is_default" @change="switchChange" />
			</view>
		</view>
		<button class="btn-save" type="primary" @tap="save">保存</button>
		<!-- <mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault"
		 @onCancel="onCancel" @onConfirm="onConfirm">
		</mpvue-city-picker> -->
	</view>
</template>

<script>
	import validate from '../../common/validate.js'
	import mpvueCityPicker from '../../components/mpvue-citypicker/mpvueCityPicker.vue'
	export default {
		components:{
			mpvueCityPicker
		},
		data() {
			return {
				themeColor:'#faa',
				addrId:'',
				recv_person:'',
				recv_phone:'',
				recv_district:'',
				recv_addr:'',
				is_default:false
			};
		},
		onLoad(option) {
			this.addrId=option.id;
			if(this.addrId){
				this.init();
			}
		},
		methods:{
			init(){
				this.$http.get({
					url:'/customer/getAddressById',
					data:{
						id:this.addrId
					}
				}).then(r=>{
					if(r.code==0){
						this.recv_person=r.data.recv_person;
						this.recv_phone=r.data.recv_phone;
						this.recv_district=r.data.recv_district;
						this.recv_addr=r.data.recv_addr;
						this.is_default=r.data.is_default==1?true:false;
					}
				})
			},
			//选择是否默认
			switchChange(){
				this.is_default=!this.is_default;
			},
			//打开城市选择器
			showPicker(){
				// #ifdef APP-PLUS
				document.activeElement.blur();//解决picker和软键盘冲突
				// #endif
				this.$refs.mpvueCityPicker.show();
			},
			//选择城市
			onConfirm(data){
				this.recv_district=data.label;
			},
			//保存提交
			save(){
				if(this.recv_person==''){
					uni.showToast({
						title:'请输入收货人姓名',
						icon:'none'
					})
					return;
				}
				if(!validate.mobile(this.recv_phone)){
					return;
				}
				if(this.recv_district==''){
					uni.showToast({
						title:'请选择收货地区',
						icon:'none'
					})
					return;
				}
				if(this.recv_addr==''){
					uni.showToast({
						title:'请输入详细收货地址',
						icon:'none'
					})
					return;
				}
				this.$http.post({
					url:'/customer/addOrUpdateAddress',
					data:{
						id:this.addrId,
						recv_person:this.recv_person,
						recv_phone:this.recv_phone,
						recv_district:this.recv_district,
						recv_addr:this.recv_addr,
						is_default:this.is_default?1:0
					}
				}).then(r=>{
					if(r.code==0){
						uni.showToast({
							title:'保存成功！'
						})
						uni.navigateBack({
							delta:1
						});
						/* uni.redirectTo({
							url:'../address/address'
						}) */
					}
				})
			}
		}
	}
</script>

<style lang="scss">
.editAddress{
	.form{
		background-color: #fff;
		.form-item{
			display: flex;
			padding: 0 30upx;
			border-bottom: 1upx solid #ddd;
		}
		.switch-item{
			justify-content: space-between;
			align-items: center;
			border-bottom:0;
		}
		.label{
			min-width: 130upx;
			line-height: 88upx;
			font-size: 28upx;
			color: #333;
		}
		.input{
			height: 80upx;
			flex: 1;
			font-size: 28upx;
			color: #333;
			line-height: 88upx;
		}
		.textarea{
			padding: 24upx 0;
			flex: 1;
			height: 200upx;
			font-size: 28upx;
			color: #333;
			line-height: 1.5;
		}
	}
	.btn-save{
		margin: 30upx;
		
	}
}
</style>
