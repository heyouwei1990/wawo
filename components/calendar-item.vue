<template>
	<view>
		<block v-for="(weeks, week) in canlender.weeks" :key="week">
			<view class="calender-body-date-week">
				<block v-for="(day, index) in weeks" :key="index">
					<view class="date" :class="{disable: canlender.month !== day.month || day.disable,
							'date-current':(day.date == canlender.date || day.checked) && canlender.month == day.month && !day.disable,
							lunar: lunar,
							active: day.isDay,
							'is-day': day.isDay
						}"
					 @tap="
							selectDays(
								week,
								index,
								canlender.month === day.month,
								day.disable,
								canlender.lunar,
								day.clockinfo
							)
						">
						<view class="circle-box">
							<text class="date-text">{{ day.date }}</text>
							<view v-if="lunar" class="lunar-text">{{ day.lunar }}</view>
							<view v-if="day.have" class="data-circle">{{day.clockinfo.info}}</view>
						</view>
					</view>
				</block>
			</view>
		</block>
	</view>
</template>

<script>
	export default {
		props: {
			/**
			 * 当前日期
			 */
			canlender: {
				type: null,
				default: () => {
					return {};
				}
			},
			lunar: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {};
		},
		mounted() {
			
		},
		methods: {
			selectDays(week, index, ischeck, isDay, lunar,clockinfo) {
				this.$emit('selectDays', {
					week,
					index,
					ischeck,
					isDay,
					lunar,
					clockinfo
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.calender-body-date-week {
		display: flex;
		width: 100%;
		border-bottom: 1px #f5f5f5 solid;
		&:last-child {
			border: none;
		}
		// 日期的样式
		.date {
			position: relative;
			width: 100%;
			text-align: center;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #000;
			background: #fff;
			// line-height: 100upx;
			box-sizing: border-box;
			padding: 4upx 0;
			line-height: 1.5;
			.circle-box {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				width: 48upx;
				height: 48upx;
				flex-shrink: 0;
				border-radius: 50%;
				transition: all .2s;

			}

			&.lunar {
				color: #000;
				.date-text {
					line-height: 1.2;
				}
				.lunar-text {
					font-size: 20upx;
					line-height: 1.2;
				}
			}

			// 本月禁止的样式
			&.disable {
				color: #d4d4d4;
				.lunar {
					color: #d4d4d4;
				}
			}

			&.is-day {
				color: #fd2e32;
			}

			&.is-day .lunar {
				color: #fd2e32;
			}

			// 当前选中
			&.date-current {
				// background: #000; 
				color: #fff;
				box-sizing: border-box;

				.circle-box {
					background: #fd2e32;
				}

				&.active {}

				.lunar {
					color: #fff;
				}
			}

			.data-circle {
				position: absolute;
				top: 0upx;
				right: 14upx;
				width: 24upx;
				height: 24upx;
				text-align: center;
				font-size: 18upx;
				line-height: 24upx;
				color: #fff;
				border-radius: 50%;
				background-color: #ff5a5f;
				z-index: 2;
			}
		}
	}
</style>
