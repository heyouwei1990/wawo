<template>
	<view class="previewImg">
		<swiper @change="swpierChange" :current="index" :style="{height:screenHeight + 'px'}">
			<swiper-item v-for="(value,index) in data" :key="index" @click="preImg(index)">
				<image :src="value" mode="widthFix"></image>
			</swiper-item>
		</swiper>
		<!-- #ifndef H5 -->
		<view class="download uni-icon uni-icon-download" @click="download"></view>
		<!-- #endif -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgShow: false,
				index: 0,
				showBtn: false,
				screenHeight: 0,
				imgLength: 0,
				providerList: [],
				data: [],
				detailDec:""
			}
		},
		onLoad(option) {
			this.screenHeight = uni.getSystemInfoSync().windowHeight;
			this.data=JSON.parse(decodeURIComponent(option.imgs));
			this.index=option.num;
			this.imgLength=this.data.length;
			uni.setNavigationBarTitle({
				title: parseInt(this.index)+1+"/" + this.imgLength
			});
		},
		methods: {
			download() {
				uni.showLoading({
					title:'正在保存…',
					mask:true
				})
				uni.downloadFile({
					url: this.data[this.index],
					success: (e) => {
						uni.saveImageToPhotosAlbum({
							filePath: e.tempFilePath,
							success: () => {
								uni.showToast({
									icon: "none",
									title: "已保存到手机相册"
								})
							},
							fail: () => {
								uni.showToast({
									icon: "none",
									title: "保存到手机相册失败"
								})
							},
							complete() {
								uni.hideLoading();
							}
						});
					},
					fail: (e) => {
						uni.hideLoading();
						uni.showModal({
							content: "下载失败，" + e.errMsg,
							showCancel: false
						})
					}
				})
			},
			swpierChange(e) {
				this.index = e.detail.current;
				uni.setNavigationBarTitle({
					title: (e.detail.current + 1) + "/" + this.imgLength
				})
			},
			preImg(index) {
				if (this.imgShow) { //防止点击过快导致重复调用 
					return;
				}
				this.imgShow = true;
				setTimeout(() => {
					this.imgShow = false;
				}, 1000)
				setTimeout(() => {
					uni.previewImage({
						current: this.data[index],
						urls: this.data
					})
				}, 150)
			},
		}
	}
</script>

<style lang="scss" scoped>
.previewImg{
	background-color: #000;
	swiper {
		flex: 1;
		width: 750upx;
		background-color: #000;
		display: flex;
		flex-direction: column;
	}
	
	swiper-item {
		display: flex;
		align-items: center;
		width: 100%;
		height: 100%;
	}
	
	image {
		width: 100%;
		height: 100%;
	}
	.download{
		position: fixed;
		right: 30upx;
		bottom: 200upx;
		z-index: 3;
		background-color: rgba(255,255,255,0.9);
		border-radius: 50%;
		padding: 20upx;
		font-size: 48upx;
		color: #48a7f9;
	}
}
</style>
