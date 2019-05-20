<template>
	<view class="bankCardList">
		<view class="list" v-if="cardList.length">
			<view class="bankcard-dl" :class="{active:checked===index}" v-for="(item,index) in cardList" :key="index" @tap="choose(index)">
				<view class="iconfont icon-bankcard"></view>
				<view class="dd">
					<view class="row">
						<view class="bank-name">{{item.bank_name}}</view>
						<text class="default" v-if="item.is_default">默认</text>
					</view>
					<view class="bank-num">尾号{{item.bank_card_no}}</view>
				</view>
			</view>
		</view>
		<navigator class="add-card" url="../addBankCard/addBankCard">
			<view class="icon-add iconfont"></view>
			<text>添加银行卡</text>
		</navigator>
		<view class="fixed-bottom" v-if="cardList.length">
			<button class="btn-primary" @tap="setDefault" :disabled="checked===''">设为默认卡</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cardList:[],
				checked:''
			};
		},
		onNavigationBarButtonTap() {
			this.remove();
		},
		onShow() {
			this.init();
		},
		methods:{
			init(){
				this.$http.get({
					url:'/bankcard/getBankCardList'
				}).then(r=>{
					if(r.code==0){
						this.cardList=r.data;
					}
				})
			},
			//选中银行卡
			choose(index){
				this.checked=index;
			},
			//设置默认银行卡
			setDefault(){
				var pkid=this.cardList[this.checked].id;
				this.$http.get({
					url:'/bankcard/updateDefault',
					data:{
						id:pkid
					}
				}).then(r=>{
					if(r.code==0){
						uni.showToast({
							title:'设置成功'
						})
						this.init();
					}
				})
			},
			//删除银行卡
			remove(){
				if(this.checked===''){
					uni.showToast({
						title: '请选择要删除的银行卡',
						icon: 'none'
					});
					return;
				}
				uni.showModal({
					content: '是否确认删除该银行卡？',
					showCancel: true,
					confirmText: '确认',
					success: res => {
						if(res.confirm){
							var pkid=this.cardList[this.checked].id;
							this.$http.get({
								url:'/bankcard/deleteById',
								data:{
									id:pkid
								}
							}).then(r=>{
								if(r.code==0){
									uni.showToast({
										title:'删除成功'
									})
									this.cardList.splice(this.checked,1);
								}
							})
						}
					},
					fail: () => {},
					complete: () => {}
				});
				
			}
		}
	}
</script>

<style lang="scss">
.bankCardList{
	padding-bottom: 98upx;
	.bankcard-dl{
		display: flex;
		align-items: center;
		padding: 20upx 30upx;
		background-color: #fff;
		border-bottom: 1upx solid #ddd;
		&.active{
			background-color: #f8f8f8;
		}
		.icon-bankcard{
			font-size: 80upx;
			color: #666;
			margin-right: 30upx;
		}
		.dd{
			flex: 1;
			min-width: 200upx;
		}
		.row{
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 20upx;
		}
		.default{
			font-size: 24upx;
			color: #999;
			line-height: 1.5;
		}
		.bank-name{
			font-size: 28upx;
			color: #333;
			line-height: 1.5;
		}
		.bank-num{
			font-size: 24upx;
			color: #999;
			line-height: 1.5;
		}
	}
	
	.add-card{
		display: flex;
		align-items: center;
		background-color: #fff;
		padding: 20upx 30upx;
		font-size: 28upx;
		color: #666;
		line-height: 1.5;
	}
	.icon-add{
		display: block;
		width: 100upx;
		height: 100upx;
		color: #ddd;
		border: 1upx solid #ddd;
		border-radius: 4px;
		margin-right: 30upx;
		position: relative;
		text-align: center;
		line-height: 100upx;
		font-size: 40upx;
	}
}
</style>
