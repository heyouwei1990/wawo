<template>
	<view class="writeMoments" @touchstart="touchStart" @touchend="touchEnd">
		<form>
			<view class="uni-textarea">
				<textarea placeholder="这一刻的想法..." v-model="input_content" maxlength="200"/>
			</view>
			<view class="uni-list list-pd">
				<view class="uni-list-cell cell-pd">
					<view class="uni-uploader">
						<view class="uni-uploader-head">
							<view class="uni-uploader-title"></view>
							<view class="uni-uploader-info">{{imageList.length}}/9</view>
						</view>
						<view class="uni-uploader-body">
							<view class="uni-uploader__files">
								<block v-for="(image,index) in imageList" :key="index">
									<view class="uni-uploader__file" style="position: relative;">
										<image class="uni-uploader__img" mode="aspectFill" :src="image" :data-src="image" @tap="previewImage"></image>
										<view class="close-view uni-icon uni-icon-closeempty" @click="close(index)"></view>
									</view>
								</block>
								<view class="uni-uploader__input-box" v-show="imageList.length < 9">
									<view class="uni-uploader__input" @tap="chooseImage"></view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			
			<view class="btn-group">
				<button class="btn-primary" @tap="submit">提交</button>
			</view>
		</form>
	</view>
</template>

<script>
	var sourceType = [
		['camera'],
		['album'],
		['camera', 'album']
	]
	var sizeType = [
		['compressed'],
		['original'],
		['compressed', 'original']
	]
	import Uploader from '../../common/uploader.js'
	import config from '../../common/config.js'
	export default {
		data() {
			return {
				// title: 'choose/previewImage',
				fileName:'momentsPhotos',
				input_content:'',
				imageList: [],
				uploadList:[],
				sourceTypeIndex: 2,
				sourceType: ['拍照', '相册', '拍照或相册'],
				sizeTypeIndex: 0,
				sizeType: ['压缩', '原图', '压缩或原图'],
				countIndex: 8,
				count: [1, 2, 3, 4, 5, 6, 7, 8, 9],
				//侧滑返回start
				startX: 0, //点击屏幕起始位置
				movedX: 0, //横向移动的距离
				endX: 0, //接触屏幕后移开时的位置
				//end
			}
		},
		onUnload() {
			this.imageList = [],
				this.sourceTypeIndex = 2,
				this.sourceType = ['拍照', '相册', '拍照或相册'],
				this.sizeTypeIndex = 0,
				this.sizeType = ['压缩', '原图', '压缩或原图'],
				this.countIndex = 8;
		},
		onNavigationBarButtonTap(e) {//监听右上自定义按钮点击事件
			 if(e.index == 0) {
				uni.switchTab({
					url: '../find'
				});
			 }
		},
		methods: {
			close(e){
			    this.imageList.splice(e,1);
			},
			chooseImage: async function() {
				
				if (this.imageList.length === 9) {
					let isContinue = await this.isFullImg();
					console.log("是否继续?", isContinue);
					if (!isContinue) {
						return;
					}
				}
				uni.chooseImage({
					sourceType: sourceType[this.sourceTypeIndex],
					sizeType: sizeType[this.sizeTypeIndex],
					count: this.imageList.length + this.count[this.countIndex] > 9 ? 9 - this.imageList.length : this.count[this.countIndex],
					success: (res) => {
						this.imageList=res.tempFilePaths;
					}
				})
			},
			isFullImg: function() {
				return new Promise((res) => {
					uni.showModal({
						content: "已经有9张图片了,是否清空现有图片？",
						success: (e) => {
							if (e.confirm) {
								this.imageList = [];
								res(true);
							} else {
								res(false)
							}
						},
						fail: () => {
							res(false)
						}
					})
				})
			},
			previewImage: function(e) {
				var current = e.target.dataset.src
				uni.previewImage({
					current: current,
					urls: this.imageList
				})
			},
			touchStart: function(e) {
				this.startX = e.mp.changedTouches[0].pageX;
			},
			
			touchEnd: function(e) {
				this.endX = e.mp.changedTouches[0].pageX;
				if (this.endX - this.startX > 200) {
					uni.navigateBack();
				}
			},
			//提交
			async submit(){
				if(this.input_content=='' && this.imageList.length==0){
					return;
				}
				var upload =new Uploader().upload(this.imageList,config.host+'/img/insertImage?folder='+this.fileName);
				var photos=[];
				await upload.then(r=>{
					photos=r;
				})
				var imgArr=[];
				for (let i=0;i<photos.length;i++) {
					imgArr.push(config.imgBaseUrl+photos[i])
				}
				photos=imgArr.join(',');
				this.$http.post({
					url:'/moments/addMoments',
					data:{
						content:this.input_content,
						photos:photos
					}
				}).then(r=>{
					if(r.code==0){
						uni.switchTab({
							url:'../newsIndex/newsIndex'
						})
						uni.setStorageSync('publish',1);
					}
				})
			}
		}
	}
</script>

<style lang="scss">
.writeMoments{
	width: 750upx;
	height: 100%;
	
	.cell-pd {
		padding: 20upx 30upx;
	}
	
	.uni-textarea {
		width: auto;
		padding: 20upx 25upx;
		line-height: 1.6;
		height: 150upx;
	}
	.uni-list::before {
		height: 0;
	}
	.uni-list:after {
		height: 0;
	}
	.list-pd {
		margin-top: 0;
	}
	.close-view{
		text-align: center;
		line-height:32upx;
		height: 32upx;
		width: 32upx;
		border-radius: 50%;
		background: #ef5350;
		color: #FFFFFF;
		position: absolute;
		top: 6upx;
		right: 8upx;
		font-size: 32upx;
	}
	.btn-group {
		margin-top: 80upx;
		padding: 20upx 30upx;
	}
}
</style>
