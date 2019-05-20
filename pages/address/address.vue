<template>
	<view class="addressPage">
		<view class="list" v-if="addressList.length">
			<view class="cell" v-for="(item,index) in addressList" :key="index">
				<view class="inner"
					@touchstart="swipeStart($event,index)"
					@touchmove="swipeMove($event,index)"
					@touchend="swipeEnd($event,index)"
					@tap="recover(index)"
					:style="{transform:'translate3d('+item.slideX+'px, 0, 0)'}"
				>
					<view class="item" :class="{active:index===checkedIndex}" @tap="choose(index)">
						<view class="addressee">
							<view class="label">收货人：</view>
							<view class="fullname">{{item.recv_person}}</view>
							<view class="phone">{{item.recv_phone}}</view>
							<view class="mark" v-if="item.is_default==1">默认</view>
						</view>
						<view class="address">
							<view class="label">收货地址：</view>
							<view class="val">{{item.recv_district}}{{item.recv_addr}}</view>
						</view>
					</view>
					<view class="swiper-btns">
						<navigator class="btn btn-edit" :url="'../editAddress/editAddress?id='+item.id"><text class="txt">编辑</text></navigator>
						<view class="btn btn-delete" @tap="remove(item)"><text class="txt">删除</text></view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import swipeCell from '../../components/uni-swipe-action.vue'
	export default {
		components:{
			swipeCell
		},
		data() {
			return {
				addressList:[],
				checkedIndex:'',//选中的地址
				startTime:0,
				btnWidth: 0,
				startX: 0,
				LastX: 0,
				startSlideX:0,
			};
		},
		onNavigationBarButtonTap() {
			uni.navigateTo({
				url:'../editAddress/editAddress'
			})
		},
		onShow(){
			this.init();
		},
		methods:{
			//获取地址
			init(){
				this.$http.get({
					url:'/customer/getAddressList'
				}).then(r=>{
					if(r.code==0){
						var list=r.data || [];
						if(list.length>0){
							for (var i = 0; i < list.length; i++) {
								list[i]['slideX']=0;
								if(list[i].is_default==1){
									this.checkedIndex=i;
								}
							}
						}
						this.addressList=list;
					}
				})
			},
			//左滑按钮点击
			remove(item){
				uni.showModal({
					title: '提示',
					content: '确认删除该地址？',
					success: res => {
						if(res.confirm){
							this.$http.get({
								url:'/customer/deleteAddress',
								data:{
									id:item.id
								}
							}).then(r=>{
								if(r.code==0){
									uni.showToast({
										title:'删除成功'
									})
									this.init();
								}
							})
						}
					},
					fail: () => {},
					complete: () => {}
				});
			},
			//地址选择
			choose(index){
				this.checkedIndex=index;
				var item=this.addressList[index];
				uni.setStorageSync('address',item);
				uni.navigateBack({
					delta:1
				})
			},
			//右滑开始
			swipeStart(e,index){
				//记录手指放上去的时间
				this.startTime = e.timeStamp;
				//记录滑块的初始位置
				this.startSlideX = this.addressList[index].slideX;
				//记录按钮宽度
				uni.createSelectorQuery().selectAll('.swiper-btns').boundingClientRect().exec(res=>{
					if(res[0]!=null){
						this.btnWidth = res[0][index].width * -1;
					}
				})
				// 记录上一次开始时手指所处位置
				this.startX = e.touches[0].pageX;
				// 记录上一次手指位置
				this.lastX = this.startX;
				//初始化非当前滑动消息列的位置
				this.addressList.forEach((item, eq) => {
					if (eq !== index) {
						item.slideX = 0;
					}
				});
			},
			//右滑移动中
			swipeMove(e,index){
				const endX = e.touches[0].pageX;
				const distance = endX - this.lastX;
				// 预测滑块所处位置
				const duang = this.addressList[index].slideX + distance;
				// 如果在可行区域内
				if (duang <= 0 && duang >= this.btnWidth) {
					this.addressList[index].slideX = duang;
				}
				// 此处手指所处位置将成为下次手指移动时的上一次位置
				this.lastX = endX;
			},
			//右滑结束
			swipeEnd(e,index){
				let distance = 10;
				const endTime = e.timeStamp;
				const xEndDistance = this.startX - this.lastX;
				if (Math.abs(endTime - this.startTime) > 200) {
					distance = this.btnWidth / -2;
				}
				// 判断手指最终位置与手指开始位置的位置差距
				if (xEndDistance > distance) {
					this.addressList[index].slideX = this.btnWidth;
				} else if (xEndDistance < distance * -1) {
					this.addressList[index].slideX = 0;
				} else {
					this.addressList[index].slideX = this.startSlideX;
				}
			},
			// 点击回复原状
			recover(index) {
				this.addressList[index].slideX = 0;
			},
		}
	}
</script>

<style lang="scss">
.addressPage{
	.cell{
		width: 100%;
		overflow: hidden;
	}
	.inner{
		min-width: 200%;
		transition: all 0.1s ease-out;
		display: flex;
	}
	.swiper-btns{
		float: left;
		display: flex;
		align-items: center;
		.btn{
			height: 100%;
			padding: 0upx 30upx;
			font-size: 28upx;
			color: #fff;
			display: flex;
			align-items: center;
		}
		.btn-delete{
			background-color: #f33;
		}
		.btn-edit{
			background-color: coral;
		}
	}
	.item{
		width: 750upx;
		background-color: #fff;
		padding: 20upx 30upx;
		border-bottom: 1upx solid #ddd;
		&.active{
			background-color: #f8f8f8;
		}
		.addressee{
			display: flex;
			align-items: center;
			margin-bottom: 10upx;
		}
		.address{
			display: flex;
		}
		.label{
			white-space: nowrap;
			font-size: 28upx;
			color: #333;
			line-height: 1.5;
		}
		.fullname{
			margin-right: 20upx;
			font-size: 28upx;
			color: #333;
			line-height: 1.5;
		}
		.phone{
			margin-right: 20upx;
			font-size: 28upx;
			color: #333;
			line-height: 1.5;
		}
		.mark{
			font-size: 24upx;
			color: #999;
			line-height: 1.5;
		}
		.val{
			font-size: 28upx;
			color: #333;
			line-height: 1.5;
			word-break: break-all
		}
	}
}
</style>
