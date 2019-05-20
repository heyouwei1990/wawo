<template>
	<view class="newsIndex" @tap="docTap">
		<view class="tab-hd">
			<view class="tab-btn" :class="{on:btnIndex==index}" v-for="(item, index) in tabBtns" :key="index" @tap="tabSwitch(index)">{{item}}</view>
		</view>
		<swiper class="swiper-wrap" :duration="200" :current="btnIndex" @change="swipe" >
			<swiper-item >
				<scroll-view scroll-y class="scroller" @scroll="newScroll"  @scrolltolower="loadNews">
					<view class="top-line">
						<!-- <view class="sec-hd">
							<view class="title">哇喔头条</view>
						</view> -->
						<view class="news-item">
							<navigator class="article-dl" v-if="headNews" :url="'../articleDetail/articleDetail?id='+headNews.id">
								<view class="article-dt">
									<view class="mark">头条</view>
									<image class="cover" :src="headNews.thumbnail" mode="aspectFill"></image>
								</view>
								<view class="article-dd">
									<view class="row-top">
										<view class="title">{{headNews.title}}</view>
									</view>
									<view class="desc">{{headNews.summary}}</view>
									<view class="row-bottom">
										<!-- 价格显示 -->
										<view class="price-area">
											<view class="vip-price" v-if="headNews.price != headNews.vip_price">
												<view class="vip-mark"></view>
												<view class="price" v-if="headNews.vip_price>0"><text class="unit">¥</text>{{headNews.vip_price}}</view>
												<view class="price" v-else>免费</view>
											</view>
											<view class="price" v-if="headNews.is_free==1">免费</view>
											<view class="price" :class="{smaller:headNews.price != headNews.vip_price}" v-if="headNews.is_free==0"><text class="unit">¥</text>{{headNews.price}}</view>
										</view>
										<view class="pageview">{{headNews.views}}</view>
									</view>
								</view>
							</navigator>
						</view>
					</view>
					<view class="divide"></view>
					<scroll-view scroll-x class="tab-scroller" v-if="scrollHead">
						<view class="scroll-tab">
							<view class="item" :class="{on:scrollTabIndex==index}" v-for="(item,index) in scrollHead" :key="index" @tap="scrollTab(index)">{{item.name}}</view>
						</view>
					</scroll-view>
					<view class="news-content" v-if="newsList.length">
						<navigator class="article-dl" v-for="(item,index) in newsList" :key="index" :url="'../articleDetail/articleDetail?id='+item.id">
							<view class="article-dt">
								<image class="cover" lazy-load :src="item.thumbnail" mode="aspectFill"></image>
							</view>
							<view class="article-dd">
								<view class="row-top">
									<view class="title">{{item.title}}</view>
								</view>
								<view class="desc">{{item.summary}}</view>
								<view class="row-bottom">
									<!-- 价格显示 -->
									<view class="price-area">
										<view class="vip-price" v-if="item.price != item.vip_price">
											<view class="vip-mark"></view>
											<view class="price" v-if="item.vip_price>0"><text class="unit">¥</text>{{item.vip_price}}</view>
											<view class="price" v-else>免费</view>
										</view>
										<view class="price" v-if="item.is_free==1">免费</view>
										<view class="price" :class="{smaller:item.price != item.vip_price}" v-if="item.is_free==0"><text class="unit">¥</text>{{item.price}}</view>
									</view>
									<view class="pageview">{{item.views}}</view>
								</view>
							</view>
						</navigator>
					</view>
					<view class="uni-loadmore" v-if="showLoadMore">{{loadMoreText}}</view>
				</scroll-view>
			</swiper-item>
			<swiper-item >
				<scroll-view scroll-y class="scroller" @scrolltolower="loadMoments" :scroll-top="scrollTop"  scroll-with-animation @scroll="scroll">
					<swiper class="banner-swipe" v-if="bannerList.length" indicator-color="rgba(255,255,255,0.5)" indicator-active-color="rgba(72,167,249,0.8)" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="500">
						<swiper-item v-for="(item,index) in bannerList" :key="index" >
							<view class="swiper-item" @tap="bannerTap(item)">
								<image class="banner" :src="item.bannerurl" ></image>
							</view>
						</swiper-item>
					</swiper>
					<navigator class="btn-publish" url="../writeMoments/writeMoments" v-if="userInfo.merchant">发送推广</navigator>
					<view class="moments-post" v-if="moments.length" v-for="(item,index) in moments" :key="index" :id="'post-'+index">
						<view class="post-left">
							<image class="avatar" :src="item.avatar" lazy-load></image>
						</view>
						<view class="post-right">
							<view class="uni-flex line1">
								<text class="post-username uni-flex-item">{{item.customer_name}}</text>
								<view class="uni-icon uni-icon-more-filled" @tap="showMenu(item)"></view>
							</view>
							<view id="paragraph" class="paragraph">{{item.detail}}</view>
							<!-- 相册 -->
							<view class="thumbnails">
								<!-- <view :class="item.photos.length === 1?'my-gallery':'thumbnail'" v-for="(image, indexImages) in item.photos" :key="indexImages">
									<image class="gallery-img" v-if="indexImages<2" lazy-load mode="aspectFill" :src="image" :data-src="image" @tap="previewImage(item.photos,indexImages)"></image>
								</view> -->
								<view class="thumbnail" v-for="(image, indexImages) in item.photos" :key="indexImages">
									<image class="gallery-img" v-if="indexImages<9" lazy-load mode="aspectFill" :src="image" :data-src="image" @tap="previewImage(item.photos,indexImages)"></image>
								</view>
							</view>
							<!-- 资料条 -->
							<view class="toolbar">
								<view class="timestamp">{{item.timestamp}}</view>
								<view class="btns">
									<view class="icon-like iconfont" :class="{'icon-praised':item.like_status===1,'icon-praise':item.like_status!==1}" @tap="like(index)"></view>
									<view class="icon-comment iconfont" @tap="comment(index)">
								</view>
								</view>
							</view>
							<!-- 赞／评论区 -->
							<view class="liked-content" v-if="item.like_list.length">
								<view class="iconfont icon-praised"></view>
								<block v-for="(user,indexLike) in item.like_list" :key="indexLike">
									<image class="liked-avatar" lazy-load :src="user.avatar" v-if="indexLike<5" mode="aspectFill"></image>
								</block>
							</view>
							<view class="comment-list" v-if="item.comment_list.length">
								<view class="comment-cell" v-for="(comment,commentIndex) in item.comment_list" :key="commentIndex" @tap.stop="showCommentBtns(index,commentIndex)">
									<text class="comment-nickname">{{comment.customer_name}}</text>
									<text class="comment-reply" v-if="comment.reply_customer_name">回复</text>
									<text class="comment-nickname" v-if="comment.reply_customer_name">{{comment.reply_customer_name}}</text>
									<text class="comment-nickname">: </text>
									<text class="comment-content">{{comment.content}}</text>
									<view class="comment-btns" v-if="showItemBtns==index+'/'+commentIndex" :style="{left:btnsLeft}">
										<view class="iconfont icon-delete" v-if="showDeleteBtn" @tap="removeComment(index,commentIndex)"></view>
										<view class="iconfont icon-comment" @tap="reply(index,commentIndex)"></view>
									</view>
								</view>
							</view>
						</view>
						<!-- 结束 post -->
					</view>
					<view class="fixed-input" v-show="showInput">
						<input class="input-text" type="text" @confirm="sendComment" v-model="inputValue" :focus="focus" @blur="blur" :placeholder="placeholder"></input>
						<view id='msg-type' class="btn-send" @tap="sendComment">发送</view>
					</view>
					<view class="uni-loadmore">{{momentLoadText}}</view>
				</scroll-view>
			</swiper-item>
		</swiper>
		<view class="back-top" @tap="backTop" ref="backTop" v-if="showBackTop">
			<view class="iconfont icon-arrow-up"></view>
			TOP
		</view>
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				headNews:'',//头条
				tabBtns:['资讯','发现'],
				btnIndex:0,
				scrollHead:[{name:'全部',id:''}],
				scrollTabIndex:0,
				newsList:[],
				userId: 4,
				username: '',
				index: '',
				commentIndex: '',
				placeholder: '评论', //占位内容
				focus: false, //是否自动聚焦输入框
				isReply: false, //回复还是评论
				showInput: false, //评论输入框
				screenHeight: '', //屏幕高度(系统)
				platform: '',
				windowHeight: '', //可用窗口高度(不计入软键盘)
				inputValue:'',
				bannerList:[],//轮播图,
				momentLoadText: "上拉加载更多",
				momentPage:1,//评论页码
				momentSize:10,//评论
				momentTotal:0,
				moments:[],//朋友圈,
				userInfo:'',
				scrollTop:0,//返回顶部,
				old:{
					scrollTop:0
				},
				showDistance:100,//滚动多远显示回到顶部
				showBackTop:false,
				isSupport:true,//是否支持下拉刷新——没滚动到顶部为false
				showItemBtns:'',//显示评论的回复删除按钮
				showDeleteBtn:false,//是否有删除评论的权限
				isPreview:false,
				loadMoreText: "上拉加载更多",
				showLoadMore: false,
				pageIndex:1,//评论页码
				pageSize:10,//评论
				totalPage:0,
			};
		},
		onNavigationBarSearchInputClicked() {
			uni.navigateTo({
				url:'../seach/seach?type=3'
			})
		},
		onLoad() {
			this.userInfo=uni.getStorageSync('userInfo');
			uni.getSystemInfo({ //获取设备信息
				success: (res) => {
					this.screenHeight = res.screenHeight;
					this.platform = res.platform;
				}
			});
			this.moments=uni.getStorageSync('moments');
			this.init();
		},
		onShow() {
			uni.onWindowResize((res) => { //监听窗口尺寸变化,窗口尺寸不包括底部导航栏
				if (this.platform === 'ios') {
					this.windowHeight = res.size.windowHeight;
					this.adjust();
				} else {
					if (this.screenHeight - res.size.windowHeight > 60 && this.windowHeight <= res.size.windowHeight) {
						this.windowHeight = res.size.windowHeight;
						this.adjust();
					}
				}
			});
			if(this.isPreview){
				//关闭预览图片触发
				this.isPreview=false;
				this.scrollTop=this.old.scrollTop;
			}
			//发布成功返回调用刷新
			var publish=uni.getStorageSync('publish');
			if(publish==1){
				this.pageIndex=1;
				this.totalPage=-1;
				uni.startPullDownRefresh();
				this.getMoments();
				uni.removeStorageSync('publish');
			}
		},
		onHide() {
			uni.offWindowResize(); //取消监听窗口尺寸变化
		},
		onReady() {
			this.getBanners();
		},
		onPullDownRefresh() {
			if(this.btnIndex==1){
				this.pageIndex=1;
				this.totalPage=-1;
				this.getMoments();
			}else{
				this.pageIndex=1;
				this.totalPage=0;
				this.init();
			}
		},
		watch:{
			btnIndex(newVal){
				if(newVal==1){
					//每次打开页面都是重新加载动态
					this.pageIndex=1;
					this.totalPage=-1;
					this.getMoments();
					if(this.old.scrollTop>this.showDistance){
						this.showBackTop=true;
					}
				}else{
					this.showBackTop=false;
				}
			},
			isSupport(newVal){
				// #ifdef APP-PLUS
				const pages = getCurrentPages();
				const page = pages[pages.length - 1];
				const currentWebview = page.$getAppWebview();
				currentWebview.setStyle({
					pullToRefresh:{
						support: newVal,
						color:'#48a7f9',
						offset:'45px',
						style: plus.os.name === 'Android' ? 'circle' : 'default'
					}
				})
				// #endif
			},
		},
		methods:{
			//初始化加载页面
			async init(){
				this.getPageList();
				//获取分类信息
				this.$http.get({
					url:'/content/category',
					data:{
						type:3
					}
				}).then(r=>{
					if(r.code==0){
						this.scrollHead=r.data;
						this.scrollHead.unshift({name:'全部',id:''});
						// this.getList(this.scrollHead[this.scrollTabIndex].id)
					}
				})
				//获取头条
				await this.$http.get({
					url:'/content/get',
					data:{
						type:3,
						popular:2
					}
				}).then(r=>{
					if(r.code==0){
						this.headNews=r.data.list[0];
					}
				})
				uni.stopPullDownRefresh();
			},
			//获取子分类列表
			getPageList(){
				this.showLoadMore=true;
				this.loadMoreText='加载中……';
				var sub=this.scrollHead[this.scrollTabIndex].id;
				this.getList(3,0,'',sub).then(r=>{
					if(r.code==0){
						if(this.pageIndex>1){
							this.newsList=this.newsList.concat(r.data.list);
						}else{
							this.newsList=r.data.list;
						}
						this.totalPage=r.data.totalPage;
						this.pageIndex++;
						this.loadMoreText='上拉加载更多';
						if(r.data.list.length<this.pageSize){
							this.loadMoreText='没有更多数据了';
						}
						if(this.newsList.length==0){
							this.loadMoreText='没有数据';
						}
					}
					uni.stopPullDownRefresh();
				})
			},
			//获取列表
			getList(type=1,popular,keyword='',sub){
				return new Promise((res,rej)=>{
					this.$http.get({
						url:'/content/get',
						data:{
							type:type,
							keyword:keyword,
							popular:popular,
							sub:sub,
							page:this.pageIndex,
							size:this.pageSize
						}
					}).then(r=>{
						res(r);
					})
				})
			},
			getBanners(){
				//banner
				this.$http.get({
					url:'/content/banner',
					data:{
						position:2,//2表示发现轮播
					}
				}).then(r=>{
					if(r.code==0){
						this.bannerList=r.data;
					}
				})
			},
			//banner点击跳转
			bannerTap(item){
				if(item.type==1){
					uni.navigateTo({
						url:'../webview/webview?url='+item.target
					})
				}else{
					if(item.module==1){
						uni.navigateTo({
							url:'../goodsDetail/goodsDetail?id='+item.target
						})
					}
					if(item.module==2){
						uni.navigateTo({
							url:'../lessonDetail/lessonDetail?id='+item.target
						})
					}
					if(item.module==3){
						uni.navigateTo({
							url:'../articleDetail/articleDetail?id='+item.target
						})
					}
					if(item.module==5){
						uni.navigateTo({
							url:'../videoDetail/videoDetail?id='+item.target
						})
					}
				}
			},
			//返回顶部
			backTop(){
				this.scrollTop=this.old.scrollTop;
				this.$nextTick(function(){
					this.scrollTop=0;
				})
			},
			//动态滚动显示TOP按钮
			scroll(e){
				this.old.scrollTop=e.detail.scrollTop;
				if(e.detail.scrollTop>this.showDistance && this.btnIndex==1){
					this.showBackTop=true;
				}else{
					this.showBackTop=false;
				}
				if(e.detail.scrollTop<5){
					this.isSupport=true;
				}else{
					this.isSupport=false;
				}
			},
			//资讯滚动
			newScroll(e){
				if(e.detail.scrollTop<5){
					this.isSupport=true;
				}else{
					this.isSupport=false;
				}
			},
			//获取评论列表
			getMoments(){
				this.momentLoadText='加载中……';
				this.$http.get({
					url:'/moments/get',
					data:{
						page:this.momentPage,
						size:this.momentSize,
					}
				}).then(r=>{
					if(r.code==0){
						if(this.momentPage>1){
							this.moments=this.moments.concat(r.data.list);
						}else{
							this.moments=r.data.list;
						}
						this.momentTotal=r.data.totalPage;
						this.momentPage++;
						this.momentLoadText='上拉加载更多';
						if(r.data.list.length<this.momentSize){
							this.momentLoadText='没有更多动态了';
						}
						if(this.moments.length==0){
							this.momentLoadText='没有动态';
						}
						uni.stopPullDownRefresh();
						uni.setStorageSync('moments',this.moments);
					}
				})
			},
			//资讯子分类切换
			scrollTab(index){
				this.pageIndex=1;
				this.totalPage=0;
				this.newsList=[];
				this.scrollTabIndex=index;
				this.getPageList();
			},
			//资讯，发现点击切换
			tabSwitch(index){
				this.btnIndex=index;
			},
			//资讯，发现滑动切换
			swipe(e){
				this.btnIndex=e.detail.current;
			},
			//全局点击事件 —— 关闭评论操作按钮
			docTap(){
				this.showItemBtns='';
			},
			//显示评论操作按钮
			showCommentBtns(index,cIndex){
				// console.log(this.moments[index].comment_list[cIndex].customer_id);
				if(this.moments[index].comment_list[cIndex].customer_id==this.userInfo.id){
					this.showDeleteBtn=true;
				}else{
					this.showDeleteBtn=false;
				}
				this.showItemBtns=index+'/'+cIndex;
			},
			//动态操作弹框
			showMenu(item){
				var that=this;
				var itemList=[];
				console.log(item.customer_id,this.userInfo.id)
				if(item.customer_id==this.userInfo.id){
					itemList=['举报','删除']
				}else{
					itemList=['举报']
				}
				uni.showActionSheet({
					itemList:itemList,
					success(res) {
						if(res.tapIndex==0){
							uni.showToast({
								title:"举报成功！",
								icon:'none'
							})
						}
						if(res.tapIndex==1){
							that.removeMoment(item);
						}
					}
				})
			},
			//删除动态
			removeMoment(item){
				this.$http.get({
					url:'/moments/deleteMoment',
					data:{
						id:item.id
					}
				}).then(r=>{
					if(r.code==0){
						for (var i = 0; i < this.moments.length; i++) {
							if(this.moments[i].id==item.id){
								this.moments.splice(i,1);
								break;
							}
						}
						uni.showToast({
							title:'删除成功'
						})
					}
				})
			},
			//删除评论
			removeComment(index,cIndex){
				this.$http.get({
					url:'/moments/deleteComment',
					data:{
						id:this.moments[index].comment_list[cIndex].id
					}
				}).then(r=>{
					if(r.code==0){
						this.moments[index].comment_list.splice(cIndex,1);
						uni.showToast({
							title:'删除成功'
						})
					}
				})
			},
			//语音
			startRecognize () {
				var options = {};
				var that = this;
				options.engine = 'iFly';
				that.inputValue = "";
				plus.speech.startRecognize(options, function (s) {
					console.log(s);
					that.inputValue += s;
				}, function (e) {
					console.log("语音识别失败：" + e.message);
				});
			},
			//点赞
			like(index) {
				this.$http.post({
					url:'/moments/addLike',
					data:{
						moments_id:this.moments[index].id
					}
				}).then(r=>{
					if(r.code==0){
						if (this.moments[index].like_status == 1) {
							this.moments[index].like_status =2;
						} else {
							this.moments[index].like_status =1;
						}
						this.moments[index].like_list=r.data;
					}
				})
			},
			//调起input框
			comment(index) {
				this.showInput = true; //调起input框
				this.focus = true;
				this.index = index;
			},
			//当弹出软键盘发生评论动作时,调整页面位置pageScrollTo
			adjust() {
				return;
				uni.createSelectorQuery().selectViewport().scrollOffset(res => {
					var scrollTop = res.scrollTop;
					let view = uni.createSelectorQuery().select("#post-" + this.index);
					view.boundingClientRect(data => {
						console.log("data:" + JSON.stringify(data));
						console.log("手机屏幕高度:" + this.screenHeight);
						console.log("竖直滚动位置" + scrollTop);
						console.log("节点离页面顶部的距离为" + data.top);
						console.log("节点高度为" + data.height);
						console.log("窗口高度为" + this.windowHeight);
			
						uni.pageScrollTo({
							scrollTop: scrollTop - (this.windowHeight - (data.height + data.top + 45)), //一顿乱算
							// scrollTop: 50, 
							duration: 300
						});
					}).exec();
				}).exec();
			},
			reply(index, comment_index) {
				
				this.showInput = true; //调起input框
				let replyTo = this.moments[index].comment_list[comment_index].customer_name;
				//回复自己不算
				if(this.userInfo.customer_name!=replyTo){
					this.is_reply = true; //回复中
					this.placeholder = '回复' + replyTo;
					this.comment_index = comment_index; //评论索引
				}
				this.index = index; //post索引
				this.focus = true;
			},
			//提交评论
			sendComment: function() {
				var message=this.inputValue;
				//请求参数
				var params={
					moments_id:this.moments[this.index].id,
					content:message,
				}
				//创建评论信息push到
				var obj={
					"customer_name": this.userInfo.customer_name,
					"moments_id":this.moments[this.index].id,
					"content": message //直接获取input中的值
				}
				if(this.is_reply){
					params['comment_id']=this.moments[this.index].comment_list[this.comment_index].id;
					//
					var reply_username = this.moments[this.index].comment_list[this.comment_index].customer_name;
					obj['reply_customer_name']=reply_username;
				}else{
					delete params.comment_id;
					delete obj.reply_customer_name;
				}
				this.$http.post({
					url:'/moments/addComment',
					data:params
				}).then(r=>{
					if(r.code==0){
						this.moments[this.index].comment_count += 1;
						this.moments[this.index].comment_list.push(obj);
					}
				})
				this.init_input();
				this.is_reply = false;
				this.inputValue = '';//清空上次输入的内容
			},
			blur: function() {
				this.init_input();
			},
			//初始化评论框
			init_input() {
				this.showInput = false;
				this.focus = false;
				this.placeholder = '评论';
			},
			//查看照片
			previewImage(imageList, image_index) {
				var list=encodeURIComponent(JSON.stringify(imageList));
				uni.navigateTo({
					url:'../previewImg/previewImg?imgs='+list+'&num='+image_index,
				})
			},
			//加载更多动态
			async loadMoments(){
				if(this.momentPage<=this.momentTotal){
					this.getMoments();
				}else{
					this.momentLoadText='没有更多动态了';
					return;
				}
			},
			//加载更多新闻
			loadNews(){
				this.showLoadMore=true;
				if(this.pageIndex<=this.totalPage){
					this.getPageList();
				}else{
					this.loadMoreText='没有更多数据了';
					return;
				}
			}
		}
	}
</script>

<style lang="scss">
.newsIndex{
	.tab-hd{
		position: fixed;
		left: 0;
		top: var(--window-top);
		z-index: 2;
		width: 100%;
		height: 90upx;
		display: flex;
		align-items: center;
		justify-content: space-around;
		background-color: #0193fe;
		.tab-btn{
			color: #ddd;
			font-size: 32upx;
			line-height: 90upx;
			&.on{
				color: #fff;
			}
		}
	}
	.back-top{
		position: fixed;
		right: 10upx;
		bottom: 100upx;
		z-index: 9;
		text-align: center;
		width: 80upx;
		height: 80upx;
		border-radius: 50%;
		background-color: rgba(0,0,0,0.5);
		color: #fff;
		font-size: 28upx;
		line-height: 1.2;
		padding-top: 8upx;
		.iconfont{
			display: block;
			font-size: 28upx;
		}
	}
	.swiper-wrap{
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		padding-top: 90upx;
		padding-bottom: var(--window-bottom);
	}
	.top-line{
		.news-item{
			width: 100%;
			height: 240upx;
		}
	}
	.article-dt{
		position: relative;
		overflow: hidden;
		border-radius: 4px;
		.mark{
			position: absolute;
			left:-40upx;
			top:8upx;
			z-index: 2;
			font-size: 22upx;
			line-height: normal;
			color: #fff;
			background-color: #f33;
			width: 120upx;
			padding: 4upx 0upx;
			text-align: center;
			transform: rotate(-45deg);
		}
	}
	.tab-scroller{
		background-color: #fff;
		// border-bottom: 1upx solid #ddd;
		.scroll-tab{
			position: relative;
			height: 88upx;
			white-space: nowrap;
			&:after{
				content: "";
				position: absolute;
				left: 0;
				bottom: 0;
				width: 100%;
				height: 1upx;
				transform:scaleY(0.5);
				background-color: #ddd;
			}
			.item{
				display: inline-block;
				// min-width: 120upx;
				padding: 0 30upx;
				height: 88upx;
				line-height: 88upx;
				font-size: 28upx;
				color: #333;
				text-align: center;
				&.on{
					color: #48A7F9;
					position: relative;
					&:after{
						content: "";
						padding: 0 30upx;
						box-sizing: border-box;
						position: absolute;
						left: 0;
						bottom: 0;
						z-index: 2;
						width: 100%;
						height: 6upx;
						background-color: #48A7F9;
						background-clip: content-box;
					}
				}
			}
		}
	}
	.scroller{
		height: 100%;
		.btn-publish{
			width: 160upx;
			height: 48upx;
			line-height: 48upx;
			background-color: #48A7F9;
			color: #fff;
			border-radius: 4px;
			text-align: center;
			font-size: 28upx;
			position: absolute;
			right: 30upx;
			top: 240upx;
			z-index: 9;
		}
	}
	.banner-swipe{
		.banner{
			width: 100%;
			height: 300upx;
		}
	}
	.moments-post{
		background-color: #fff;
		border-bottom: 1upx solid #ddd;
		padding: 20upx 30upx;
		display: flex;
		.post-left{
			width: 100upx;
			height: 100upx;
			margin-right: 20upx;
		}
		.post-username{
			font-size: 28upx;
			color: #0193fe;
			line-height: 1.5;
		}
		.avatar{
			display: block;
			width: 100%;
			height: 100%;
			border-radius: 50%;
			background-color: #f8f8f8;
		}
		.post-right{
			flex: 1;
		}
		.line1{
			align-items: center;
		}
		.uni-icon-more-filled{
			font-size: 36upx;
			color: #999;
		}
		.toolbar{
			display: flex;
			align-items: center;
			justify-content: space-between;
			.timestamp{
				font-size: 24upx;
				color: #999;
				line-height: 1.5;
			}
			.icon-like,.icon-comment{
				display: inline-block;
				margin-left: 20upx;
				font-size: 36upx;
				color: #999;
				width: 44upx;
				text-align: center;
				align-items: flex-end;
			}
			.icon-praised{
				color: #48A7F9;
			}
		}
		.paragraph{
			font-size: 30upx;
			color: #333;
			line-height: 1.2;
			margin-bottom: 20upx;
			margin-top: 20upx;
		}
		.thumbnails{
			overflow: hidden;
		}
		.my-gallery{
			display: inline-block;
			max-width: 100%;
			max-height: 400upx;
			margin-bottom: 8upx;
			overflow: hidden;
		}
		.thumbnail{
			float: left;
			width: 160upx;
			height: 160upx;
			margin-right: 8upx;
			margin-bottom: 8upx;
			overflow: hidden;
		}
		.gallery-img{
			width: 100%;
			height: 100%;
		}
		.liked-content{
			display: flex;
			flex-wrap: wrap;
			align-items: center;
			margin-top: 10upx;
			.icon-praised{
				font-size: 32upx;
				color: #48A7F9;
			}
		}
		.liked-avatar{
			width: 48upx;
			height: 48upx;
			border-radius: 50%;
			margin-left: 6upx;
			background-color: #f8f8f8;
		}
		.comment-btns{
			white-space: nowrap;
			padding: 8upx 16upx;
			border-radius: 4px;
			background-color: rgba(0,0,0,0.8);
			position: absolute;
			left: 0;
			top: -64upx;
			z-index: 9;
			&:after{
				content: '';
				width: 0;
				height: 0;
				border: 12upx solid transparent;
				border-top: 12upx solid rgba(0,0,0,0.8);
				position: absolute;
				left: 50%;
				top: 100%;
				margin-left: -12upx;
			}
			.iconfont{
				display: inline-block;
				vertical-align: middle;
				color: #fff;
				font-size: 40upx;
			}
			.icon-delete{
				margin-right: 20upx;
				font-size: 36upx;
			}
		}
		.comment-list{
			background-color: #f5f5f5;
			margin-top: 10upx;
			padding: 10upx;
		}
		.comment-cell{
			padding: 6upx 0;
			line-height: 1.2;
			font-size: 28upx;
			position: relative;
		}
		.comment-nickname{
			color: #36648b;
		}
		.comment-reply{
			color: #333;
			padding: 0 4upx;
		}
		.comment-content{
			color: #333;
		}
	}
	.fixed-input{
		position: fixed;
		left: 0;
		bottom: var(--window-bottom);
		z-index: 99;
		width: 100%;
		padding: 10upx 150upx 10upx 20upx;
		background-color: #f5f5f5;
		border-top: 1upx solid #ddd;
		.input-text{
			width: 100%;
			height: 80upx;
			background-color: #fff;
			border-radius: 4px;
			padding: 0 20upx;
			font-size: 28upx;
			color: #333;
		}
		.btn-send{
			width: 120upx;
			color: #fff;
			background-color: #48A7F9;
			height: 80upx;
			line-height: 80upx;
			font-size: 28upx;
			border-radius: 4px;
			text-align: center;
			position: absolute;
			right: 20upx;
			top: 10upx;
		}
	}
}

</style>
