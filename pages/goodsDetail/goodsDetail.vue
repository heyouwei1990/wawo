<template>
	<view class="goodsDetail">
		<!-- <image class="banner" :src="info.thumbnail" mode="widthFix"></image> -->
		<swiper class="banner-swiper" indicator-active-color="rgba(72, 167, 249, 0.8)" :indicator-dots="banners.length>1" :duration="300" v-if="banners.length">
			<swiper-item v-for="(item,index) in banners" :key="index">
				<image class="banner" :src="item" mode="widthFix" @tap="preview(index)"></image>
			</swiper-item>
		</swiper>
		<view class="divide"></view>
		<view class="goods-info">
			<view class="line1">
				<view class="name">{{info.title}}</view>
				<!-- 价格显示 -->
				<view class="price-area">
					<view class="vip-price" v-if="info.price != info.vip_price">
						<view class="vip-mark"></view>
						<view class="price" v-if="info.vip_price>0"><text class="unit">¥</text>{{info.vip_price}}</view>
						<view class="price" v-else>免费</view>
					</view>
					<view class="price" v-if="info.is_free==1">免费</view>
					<view class="price" :class="{smaller:info.price != info.vip_price}" v-if="info.is_free==0"><text class="unit">¥</text>{{info.price}}</view>
				</view>
			</view>
			<!-- <view class="line2">赠送信誉值200</view> -->
		</view>
		<view class="divide"></view>
		<view class="spec" v-if="info.attribute_values && info.attribute_values.length>0 && info.attribute_values[0].attribute_values">
			<label class="label">规格：</label>
			<view class="list">
				<view class="item" v-if="item.attribute_values" :class="{active:item.id==specId}" v-for="(item,index) in info.attribute_values" :key="index" @tap="redirect(item.id)">{{item.attribute_values}}</view>
			</view>
		</view>
		<view class="count">
			<label class="label">数量：</label>
			<uni-number-box :value="count" :min="1" :max="info.stock" @change="countChange"></uni-number-box>
		</view>
		<view class="count">
			<label class="label">库存：</label>
			<view class="stock">{{info.stock}}件</view>
		</view>
		<view class="divide"></view>
		<view class="detail">
			<view class="title">产品详情</view>
			<!-- <wxParse :content="info.content" /> -->
			<!-- <rich-text :nodes="info.content"></rich-text> -->
			<div v-html="info.content"></div>
		</view>
		<view class="divide"></view>
		<view class="feedback">
			<view class="title">产品评价</view>
			<view class="feedback-list" v-if="info.comment_list && info.comment_list.length">
				<view class="cell" v-for="(item,index) in info.comment_list" :key="index">
					<image class="avatar" :src="item.avatar" mode="aspectFill"></image>
					<view class="dd">
						<view class="line1">
							<view class="nickname">{{item.customer_name}}</view>
							<view class="time">{{item.c_time}}</view>
						</view>
						<view class="star-list">
							<view class="iconfont icon-star" :class="{'icon-star-fill':starIndex<item.score}" v-for="(star, starIndex) in 5" :key="starIndex"></view>
						</view>
						<view class="desc">{{item.desc}}</view>
					</view>
				</view>
			</view>
			<view class="empty" v-else>暂无评价！</view>
		</view>
		<view class="fixed-bottom uni-flex">
			<!-- <button class="btn-default uni-flex-item">信用兑换</button> -->
			<button class="btn-primary uni-flex-item" :disabled="!info" @tap="buy">立即购买</button>
		</view>
	</view>
</template>

<script>
	import uniNumberBox from '../../components/uni-number-box.vue'
	import config from '../../common/config.js'
	// import marked from '../../components/marked'
	// import wxParse from '../../components/mpvue-wxparse/src/wxParse.vue'
	export default {
		components:{
			uniNumberBox,
			// wxParse
		},
		data() {
			return {
				goodsId:'',
				info:'',
				count:1,
				specId:'',
				banners:[],
			};
		},
		onLoad(option) {
			this.goodsId=option.id;
			this.init();
		},
		//分享
		onNavigationBarButtonTap(option) {
			if (option.index == 1) {
				uni.showToast({
					title: '举报成功',
					icon: 'none'
				})
				return
			}
			var title=this.info.title;
			var thumbnail=this.banners[0];
			var summary=this.info.summary;
			var href=config.shareHost+'/goods?id='+this.goodsId;
			uni.share({
				provider:'weixin',
				type:0,
				title:title,
				scene:'WXSceneSession',
				summary:summary,
				href:href,
				imageUrl:thumbnail,
				success(res){
					console.log(JSON.stringify(res));
				},
				fail(err) {
					console.log(JSON.stringify(err));
				}
			})
		},
		methods:{
			//
			init(){
				uni.showLoading({
					title:'正在加载…',
					mask:true
				})
				this.$http.get({
					url:'/content/commodityDetail',
					data:{
						id:this.goodsId
					}
				}).then(r=>{
					if(r.code==0){
						this.info=r.data;
						this.specId=this.info.id;
						this.banners=r.data.thumbnail.split(',');
						this.info.content=r.data.content.replace(/\<img/g,'<img style="max-width:100%;"');
					}
					this.$nextTick(function(){
						uni.hideLoading();
					})
				})
			},
			//变更规格
			redirect(pkid){
				uni.showLoading();
				this.$http.get({
					url:'/content/commodityById',
					data:{
						id:pkid
					}
				}).then(r=>{
					uni.hideLoading();
					if(r.code==0){
						this.specId=pkid;
						var data=r.data;
						for (let i in data) {
							this.info[i]=data[i];
						}
						this.banners=this.info.thumbnail.split(',');
					}
				})
			},
			//计数器变化
			countChange(val){
				this.count=val;
			},
			//立即购买
			buy(){
				uni.navigateTo({
					url:'../submitOrder/submitOrder?id='+ this.specId +'&count='+ this.count
				})
			},
			//图片预览
			preview(index){
				uni.previewImage({
					current: this.banners[index],
					urls: this.banners
				})
			},
		}
	}
</script>

<style lang="scss">
.goodsDetail{
	padding-bottom: 100upx;
	.banner-swiper{
		width: 100%;
		height: 750upx;
		.banner{
			display: block;
			width: 100%;
			height: 100%;
		}
	}
	.price-area{
		text-align: right;
	}
	.goods-info{
		background-color: #fff;
		padding: 20upx 30upx;
		.line1{
			display: flex;
			align-items: center;
		}
		.name{
			font-size: 28upx;
			color: #333;
			line-height: 1.5;
			flex: 1;
			margin-right: 20upx;
		}
		.line2{
			margin-top: 10upx;
			text-align: right;
			font-size: 24upx;
			color: #333;
			line-height: 1.5;
		}
	}
	.spec{
		display: flex;
		padding: 20upx 10upx 0 30upx;
		background-color: #fff;
		.label{
			font-size: 28upx;
			color: #333;
			line-height: 1.5;
			margin-right: 20upx;
		}
		.list{
			overflow: hidden;
			flex: 1;
		}
		.item{
			border:1upx solid #ddd;
			float: left;
			line-height: normal;
			font-size: 24upx;
			color: #999;
			padding: 4upx 10upx;
			border-radius: 8upx;
			margin-right: 20upx;
			margin-bottom: 20upx;
			&.active{
				color: #f33;
				border-color: #f33;
			}
		}
	}
	.count{
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20upx 30upx;
		background-color: #fff;
		.label{
			font-size: 28upx;
			color: #333;
			line-height: 1.5;
		}
		.stock{
			font-size: 24upx;
			color: #999;
			line-height: 1.5;
		}
	}
	.detail{
		background-color: #fff;
		width: 100%;
		padding: 20upx;
		.title{
			font-size:32upx;
			color: #333;
			line-height: 2;
			text-align: center;
			margin-bottom: 20upx;
			&:before,&:after{
				content: "";
				display: inline-block;
				width: 160upx;
				height: 1upx;
				background-color: #666;
				vertical-align: middle;
				margin-right: 40upx;
				margin-left: 40upx;
				transform: translateY(0.5);
			}
		}
		image{
			width: 100%;
		}
	}
	.feedback{
		background-color: #fff;
		.title{
			padding: 20upx 30upx;
			font-size: 32upx;
			color: #333;
			line-height: 1.5;
			border-bottom: 1upx solid #ddd;
		}
		.feedback-list{
			
		}
		.cell{
			padding: 20upx 30upx;
			display: flex;
			border-bottom: 1upx solid #ddd;
			&:last-child{
				border-bottom:0
			}
		}
		.avatar{
			width: 80upx;
			height: 80upx;
			border-radius: 50%;
			margin-right: 20upx;
		}
		.dd{
			flex: 1
		}
		.line1{
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 40upx;
		}
		.nickname{
			font-size: 24upx;
			color: #666;
			line-height: 1.5;
		}
		.time{
			font-size: 24upx;
			color: #999;
			line-height: 1.5;
		}
		.star-list{
			display: flex;
			align-items: center;
			height: 40upx;
		}
		.iconfont{
			font-size: 32upx;
			margin-right: 4upx;
		}
		.icon-star{
			color: #ccc;
		}
		.icon-star-fill{
			color: gold;
		}
		.desc{
			margin-top: 20upx;
			font-size: 28upx;
			color: #333;
			line-height: 1.4;
		}
	}
}
</style>
