<template>
	<view>
		<view class="calendar-box">
			<view class="calendar-wrapper ">
				<view class="content">
					<view class="calendar-panel">
						<view class="date-befor" @tap="dataBefor('0', 'month')">
							<text class="uni-icon uni-icon-arrowleft"></text>
						</view>
						<view class="calendar-panel-box">
							<view>{{ canlender.year }}年</view>
							<view>{{ canlender.month }}月</view>
						</view>
						<view class="date-after" @tap="dataBefor('1', 'month')">
							<text class="uni-icon uni-icon-arrowright "></text>
						</view>
						<view class="backtoday" @tap="backtoday">回到今天</view>
					</view>
					<view v-if="lunar" class="day-detail">
						<view>
							{{
								canlender.year +
									'年' +
									canlender.month +
									'月' +
									canlender.date +
									'日 （' +
									canlender.lunar.astro +
									')'
							}}
						</view>
						<view>
							{{
								canlender.lunar.gzYear +
									'年' +
									canlender.lunar.gzMonth +
									'月' +
									canlender.lunar.gzDay +
									'日 (' +
									canlender.lunar.Animal +
									'年)'
							}}
							{{ canlender.lunar.IMonthCn + canlender.lunar.IDayCn }}
							{{ canlender.lunar.isTerm ? canlender.lunar.Term : '' }}
						</view>
					</view>
					<view class="calendar-header">
						<view class="week">日</view>
						<view class="week">一</view>
						<view class="week">二</view>
						<view class="week">三</view>
						<view class="week">四</view>
						<view class="week">五</view>
						<view class="week">六</view>
					</view>
					<cal-item
						v-if="slide === 'none'"
						:canlender="canlender"
						:lunar="lunar"
						@selectDays="selectDays"
					></cal-item>
					<swiper
						v-else
						class="calendar-body"
						:style="{ height: domHeihgt + 'px' }"
						:current="currentIndex"
						circular
						:vertical="slide === 'vertical' ? true : false"
						skip-hidden-item-layout
						:duration="duration"
						@animationfinish="animationfinish"
						@change="change"
					>
						<swiper-item v-for="(item, itemindx) in swiperData" :key="itemindx">
							<view :class="elClass">
								<cal-item
									:canlender="item"
									:lunar="lunar"
									@selectDays="selectDays"
								></cal-item>
							</view>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import CALENDAR from '../common/calendar.js';
import calItem from './calendar-item.vue';
export default {
	props: {
		/**
		 * 当前日期
		 */
		date: {
			type: null,
			default: () => {
				return new Date();
			}
		},
		/**
		 * 打点日期
		 */
		selected: {
			type: Array,
			default: () => {
				return [];
			}
		},
		/**
		 * 是否开启阴历日期
		 */
		lunar: {
			type: Boolean,
			default: false
		},
		/**
		 * 是否禁用今天之前的日期
		 */
		disableBefore: {
			type: Boolean,
			default: false
		},
		/**
		 * 开始时间
		 */
		startDate: {
			type: String,
			default: ''
		},
		/**
		 * 结束时间
		 */
		endDate: {
			type: String,
			default: ''
		},
		/**
		 * 滑动方向，none 为禁止滑动 可选值 horizontal vertical
		 */
		slide: {
			type: String,
			default: 'horizontal'
		},
		fixedHeihgt: {
			type: Boolean,
			default: true
		}
	},
	data() {
		const elClass = `Uni_${Math.ceil(Math.random() * 10e5).toString(36)}`;
		return {
			dateShow: false, // 日期是否选择
			selectDay: '', // 当前选择日期
			canlender: {
				weeks: []
			},
			domHeihgt: 175,
			swiperData: [],
			currentIndex: 0,
			currentSelDate: '',
			duration: 200,
			hold: false,
			isSilde: false,
			isClick: false,
			elClass: elClass
		};
	},
	created() {
		// 可以执行函数，返回给用户值
		this.isSilde = true;
		if (this.slide === 'none') {
			this.getMonthAll(0, this.date, true);
		} else {
			this.getMonthAll(1, this.date, true);
			setTimeout(() => {
				this.getQueryDom(1);
			}, 300);
		}
	},
	computed: {},
	watch: {
		selected(newVal) {
			let canlender = this.canlender;
			// 打卡之后更新信息
			this.isSilde = true;
			this.getMonthAll(
				this.currentIndex,
				canlender.year + '-' + canlender.month + '-' + canlender.date
			);
		}
	},
	methods: {
		/**
		 * 滑动切换月份
		 */
		animationfinish(e) {
			let index = e.detail.current;
			let date =
				this.swiperData[index].year +
				'-' +
				this.swiperData[index].month +
				'-' +
				this.swiperData[index].date;
			this.currentIndex = index;
			this.getMonthAll(index, date);
			clearTimeout(this.timer);
			this.duration = 200;
		},
		change(e) {
			let index = e.detail.current;
			// 可以执行函数，返回给用户值
			this.$emit('swipe',this.swiperData[index]);
			this.isSilde = true;
			this.getQueryDom(index);
		},
		/**
		 * 获取全部月份
		 */
		getMonthAll(index, date, first) {
			let canlender = this.getWeek(date);
			this.currentSelDate = canlender.date;
			let tempyear = canlender.year + '-' + canlender.month + '-1';
			let tempbefore = this.getWeek(this.getDate(tempyear, -1, 'month'));
			let tempafter = this.getWeek(this.getDate(tempyear, +1, 'month'));
			let beforeyear =
				canlender.year +
				'-' +
				canlender.month +
				'-' +
				(canlender.date > tempbefore.lastDate ? tempbefore.lastDate : canlender.date);
			let afteryear =
				canlender.year +
				'-' +
				canlender.month +
				'-' +
				(canlender.date > tempafter.lastDate ? tempafter.lastDate : canlender.date);

			let before = this.getWeek(this.getDate(beforeyear, -1, 'month'));
			let after = this.getWeek(this.getDate(afteryear, +1, 'month'));
			this.selectDay = canlender.month + '月' + canlender.date + '日';
			this.canlender = canlender;
			if (this.isSilde) {
				let isClick = '';
				if (this.isClick) {
					isClick = 'to-click';
					this.isClick = false;
				} else {
					isClick = 'change';
				}
				this.$emit(isClick, {
					year: canlender.year,
					month: canlender.month,
					date: canlender.date,
					lunar: canlender.lunar,
					clockinfo: canlender.clockinfo || {},
					fulldate: canlender.year + '-' + canlender.month + '-' + canlender.date
				});
				this.isSilde = false;
			}

			if (this.slide === 'none') {
				// console.log(before);
				this.duration = 0;
				this.currentIndex = 0;
				if (first && index === 0) {
					// console.log('第一次进入');
					this.canlender = canlender;
				} else {
					if (index === 0) {
						this.canlender = canlender;
					}
					if (index === -1) {
						this.canlender = before;
					}
					if (index === 1) {
						this.canlender = after;
					}
				}
				this.selectDay = canlender.month + '月' + canlender.date + '日';
				this.hold = false;
				return;
			}
			this.currentIndex = index;

			if (first && index === 1) {
				this.swiperData.push(before);
				this.swiperData.push(canlender);
				this.swiperData.push(after);
				return;
			}
			if (index === 0) {
				this.swiperData[0] = canlender;
				this.swiperData[1] = after;
				this.swiperData[2] = before;
				return;
			}
			if (index === 1) {
				this.swiperData[0] = before;
				this.swiperData[1] = canlender;
				this.swiperData[2] = after;
				return;
			}
			if (index === 2) {
				this.swiperData[0] = after;
				this.swiperData[1] = before;
				this.swiperData[2] = canlender;
				return;
			}
		},
		/**
		 * 计算阴历日期显示
		 */
		getlunar(year, month, date) {
			return CALENDAR.solar2lunar(year, month, date).IDayCn;
		},

		/**
		 * 今天之前的日期是否可选
		 */
		isDisableBefore(year, month, date) {
			let time = year + '-' + month + '-' + date;
			let startDate = false;
			let endDate = false;
			if (this.startDate) {
				startDate = this.dateCompare(this.startDate, time);
			}
			if (this.endDate) {
				endDate = this.dateCompare(this.getDate(this.endDate, 1), time);
			}

			if (this.disableBefore) {
				if (!this.startDate) {
					if (!this.endDate) {
						return !this.dateCompare(this.getDate(this.date, 0), time);
					} else {
						return !this.dateCompare(this.getDate(this.date, 0), time) || endDate;
					}
				} else {
					return (
						!this.dateCompare(this.getDate(this.date, 0), time) || !startDate || endDate
					);
				}
			} else {
				if (!this.startDate) {
					if (!this.endDate) {
						return false;
					} else {
						return endDate;
					}
				} else {
					return !startDate || endDate;
				}

				// return false ;
			}
		},
		/**
		 * 返回今天
		 */
		backtoday() {
			if (this.hold) {
				return;
			}
			this.hold = true;
			this.duration = 0;
			clearTimeout(this.indexTimer);
			this.indexTimer = setTimeout(() => {
				// 可以执行函数，返回给用户值
				this.isSilde = true;
				if (this.slide === 'none') {
					this.getMonthAll(0, this.date);
				} else {
					this.getMonthAll(1, this.date);
				}
				this.hold = false;
			}, 200);
		},

		/**
		 * 前一月|| 后一月
		 */
		dataBefor(id, types) {
			// 避免重复输入
			if (this.hold) {
				return;
			}
			this.hold = true;
			// 可以执行函数，返回给用户值
			this.isSilde = true;
			if (this.slide === 'none') {
				let num = 0;
				if (id === '0') {
					num = -1;
				} else {
					num = 1;
				}
				console.log(num);
				let year =
					this.canlender.year + '-' + this.canlender.month + '-' + this.canlender.date;

				this.getMonthAll(num, year);
				return;
			}
			let index = this.currentIndex;
			this.duration = 0;
			if (id === '0') {
				index--;
				if (index < 0) index = 2;
			} else {
				index++;
				if (index > 2) index = 0;
			}
			clearTimeout(this.indexTimer);
			this.indexTimer = setTimeout(() => {
				this.currentIndex = index;
				this.hold = false;
			}, 200);
		},
		/**
		 * 选择当前的日期
		 * week 当前的周
		 * index 点击的下标索引
		 * ischeck 是否选中
		 */
		selectDays(params) {
			let { week, index, ischeck, isDay, lunar } = params;
			let canlender = null;
			if (this.slide === 'none') {
				canlender = this.canlender;
			} else {
				canlender = this.swiperData[this.currentIndex];
			}
			if (!ischeck) return false;
			if (isDay) return false;
			// console.log(isDay);
			let month =
				canlender.weeks[week][index].month < 10
					? '0' + canlender.weeks[week][index].month
					: canlender.weeks[week][index].month;
			let date =
				canlender.weeks[week][index].date < 10
					? '0' + canlender.weeks[week][index].date
					: canlender.weeks[week][index].date;
			// this.getWeek(canlender.year + '-' + month + '-' + date);
			let indexNum = 0;
			if (this.slide !== 'none') {
				indexNum = this.currentIndex;
			}
			// 可以执行函数，返回给用户值
			this.isSilde = true;
			this.isClick = true;
			this.getMonthAll(indexNum, canlender.year + '-' + month + '-' + date);
		},
		// 获取日历内容
		getWeek(dateData) {
			let selected = this.selected;
			let a = new Date();
			let nowDate = this.getDate(this.date);
			// 判断当前是 安卓还是ios ，传入不容的日期格式
			if (typeof dateData !== 'object') {
				dateData = dateData.replace(/-/g, '/');
			}
			let _date = new Date(dateData);
			let year = _date.getFullYear(); //年
			let month = _date.getMonth() + 1; //月
			let date = _date.getDate(); //日
			let day = _date.getDay(); // 天
			let canlender = [];
			// console.log(selected)
			let dates = {
				firstDay: new Date(year, month - 1, 1).getDay(),
				lastMonthDays: [], // 上个月末尾几天
				currentMonthDys: [], // 本月天数
				nextMonthDays: [], // 下个月开始几天
				endDay: new Date(year, month, 0).getDay(),
				weeks: []
			};
			// 循环上个月末尾几天添加到数组
			for (let i = dates.firstDay; i > 0; i--) {
				let beforeDate = new Date(year, month - 1, -i + 1).getDate() + '';
				dates.lastMonthDays.push({
					date: beforeDate,
					month: month - 1,
					disable: this.isDisableBefore(year, month - 1, beforeDate),
					lunar: this.getlunar(year, month - 1, beforeDate),
					isDay: false
				});
			}
			let clockinfo = {
				have: false
			};
			// 循环本月天数添加到数组
			for (let i = 1; i <= new Date(year, month, 0).getDate(); i++) {
				let have = false;
				let clockinfoTemp = {};
				// 处理打卡信息
				for (let j = 0; j < selected.length; j++) {
					let selDate = selected[j].date.split('-');
					if (
						Number(year) === Number(selDate[0]) &&
						Number(month) === Number(selDate[1]) &&
						Number(i) === Number(selDate[2])
					) {
						have = true;
						clockinfoTemp.have = true;
						clockinfoTemp.date = selected[j].date;
						if (selected[j].info) {
							clockinfoTemp.info = selected[j].info;
						}
						if (
							JSON.stringify(selected[j].data) == '{}' ||
							selected[j].data != undefined
						) {
							clockinfoTemp.data = selected[j].data;
						}

						if (
							Number(year) === Number(selDate[0]) &&
							Number(month) === Number(selDate[1]) &&
							Number(date) === Number(selDate[2])
						) {
							clockinfo = clockinfoTemp;
						}
					}
				}
				dates.currentMonthDys.push({
					date: i + '',
					month: month,
					have,
					clockinfo: clockinfoTemp,
					disable: this.isDisableBefore(year, month, i + ''),
					lunar: this.getlunar(year, month, i + ''),
					isDay:
						nowDate ===
						year +
							'-' +
							(month < 10 ? '0' + month : month) +
							'-' +
							(i < 10 ? '0' + i : i)
				});
			}
			let surplus = 42 - (dates.lastMonthDays.length + dates.currentMonthDys.length) ;
			
			if(!this.fixedHeihgt){
				surplus = 6 - dates.endDay
			}
			// 循环下个月开始几天 添加到数组
			for (let i = 1; i < surplus + 1; i++) {
				dates.nextMonthDays.push({
					date: i + '',
					month: month + 1,
					disable: this.isDisableBefore(year, month + 1, i + ''),
					lunar: this.getlunar(year, month + 1, i + ''),
					isDay: false
				});
			}

			canlender = canlender.concat(
				dates.lastMonthDays,
				dates.currentMonthDys,
				dates.nextMonthDays
			);
			// 拼接数组  上个月开始几天 + 本月天数+ 下个月开始几天
			for (let i = 0; i < canlender.length; i++) {
				if (i % 7 == 0) {
					dates.weeks[parseInt(i / 7)] = new Array(7);
				}
				dates.weeks[parseInt(i / 7)][i % 7] = canlender[i];
			}

			return {
				weeks: dates.weeks,
				month: month,
				date: date,
				day: day,
				year: year,
				clockinfo,
				lunar: CALENDAR.solar2lunar(year, month, date),
				lastDate: dates.currentMonthDys[dates.currentMonthDys.length - 1].date
			};
		},
		/**
		 * 时间计算
		 */
		getDate(date, AddDayCount = 0, str = 'day') {
			if (typeof date !== 'object') {
				date = date.replace(/-/g, '/');
			}
			let dd = new Date(date);
			switch (str) {
				case 'day':
					dd.setDate(dd.getDate() + AddDayCount); // 获取AddDayCount天后的日期
					break;
				case 'month':
					dd.setMonth(dd.getMonth() + AddDayCount); // 获取AddDayCount天后的日期
					break;
				case 'year':
					dd.setFullYear(dd.getFullYear() + AddDayCount); // 获取AddDayCount天后的日期
					break;
			}
			let y = dd.getFullYear();
			let m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1; // 获取当前月份的日期，不足10补0
			let d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate(); // 获取当前几号，不足10补0
			return y + '-' + m + '-' + d;
		},
		/**
		 * 计算时间大小
		 */
		dateCompare(startDate, endDate) {
			//计划截止时间
			var startDate = new Date(startDate.replace('-', '/').replace('-', '/'));
			//计划详细项的截止时间
			var endDate = new Date(endDate.replace('-', '/').replace('-', '/'));
			if (startDate <= endDate) {
				return true;
			} else {
				return false;
			}
		},
		getQueryDom(index) {
			let dom = uni.createSelectorQuery().selectAll(`.${this.elClass}`);

			dom.boundingClientRect(rect => {}).exec(e => {
				this.domHeihgt = e[0][index].height;
			});
		}
	},
	components: {
		calItem
	}
};
</script>

<style lang="scss" scoped>
.header {
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	height: 100upx;
	background: #fff;
	z-index: 10000;
	// background: $uni-bg-color-grey;
	font-size: $uni-font-size-lg;
}

.calendar-box {
	width: 100%;
	box-sizing: border-box;
	transition: all 0.3s;
}

.calendar-wrapper {
	width: 100%;
	box-sizing: border-box;
	font-size: 26upx;
	background: #fff;
	transition: all 0.3s;
	.content {
		.calendar-panel {
			position: relative;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 28upx;
			height: 80upx;

			.date-befor,
			.date-after {
				display: flex;
				justify-content: center;
				align-items: center;
				height: 80upx;
				width: 80upx;
				text-align: center;
				line-height: 80upx;
			}
			.calendar-panel-box {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 200upx;
			}

			.backtoday {
				position: absolute;
				right: 0;
				top: 15upx;
				padding: 0 10upx;
				padding-left: 20upx;
				height: 50upx;
				line-height: 50upx;
				border: 1px rgba($color: #fd2e32, $alpha: 0.5) solid;
				border-right: none;
				font-size: 24upx;
				border-top-left-radius: 50upx;
				border-bottom-left-radius: 50upx;
				color: rgba($color: #fd2e32, $alpha: 0.7);
				background: rgba(241, 233, 233, 0.4);
			}
		}
		.day-detail {
			padding: 20upx;
			padding-left: 30upx;
			border-top: 1px #f5f5f5 solid;
		}
		.calendar-header {
			display: flex;
			font-size: $uni-font-size-base;
			border-top: 1px #f5f5f5 solid;
			.week {
				width: 100%;
				text-align: center;
				line-height: 60upx;
				color: #333;
				font-weight: bold;
			}
		}

		.calendar-body {
			display: flex;
			flex-wrap: wrap;
			font-size: $uni-font-size-base;
		}
	}
}
</style>
