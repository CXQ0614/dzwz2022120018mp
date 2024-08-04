<template>
  <!-- 心理咨询-->
  <view class="uni-content">
    <image
      :src="`${staticHost}/images/shared/banner.png`"
      class="banner"
    ></image>
    <view class="page-box" @click="closeSelect">
      <u-navbar
        title=" "
        :bgColor="color"
        :fixed="true"
        :safeAreaInsetTop="true"
        :placeholder="true"
      >
        <view class="u-nav-slot" slot="left"
          ><view class="banner-title">心理咨询</view></view
        >
      </u-navbar>
      <view class="banner-search-box">
        <view class="banner-search">
          <image
            :src="`${staticHost}/images/home/search.png`"
            class="search-icon"
          ></image>
          <u--input
            placeholder="输入内容关键词"
            placeholderClass="input-placeholder"
            :border="none"
            v-model="keyword"
            @confirm="search"
          ></u--input>
          <view class="search-button" @click="search">搜索</view>
        </view>
      </view>

      <view class="select-box">
        <!-- <view class="select-item" @click.stop="openSelect(0)" :class="{ active: showSelect == 0 }">
					<view class="item-top">
						<view class="item-text">城市</view>
						<image :src="`${staticHost}/images/consult/arrow.png`" class="arrow"></image>
					</view>
					<view class="item-mask" @click.stop="closeSelect(0)"></view>
					<view class="item-bottom city-box" @click.stop>
						<view class="city-top"><view class="city-btn" :class="{ active: city == '' }" @click="chooseCity('')">不限城市</view></view>
						<view class="city-bottom">
							<scroll-view scroll-y="true" class="scroll-left">
								<view class="city-left">
									<view class="provice-item" :class="{ active: cityCurrent == 0, current: cityParent == 0 }" @click="cityCurrent = 0">热门城市</view>
									<view
										class="provice-item"
										:class="{ active: cityCurrent == index + 1, current: cityParent == item.id }"
										v-for="(item, index) in cityList"
										:key="index"
										@click="cityCurrent = index + 1"
									>
										{{ item.name }}
									</view>
								</view>
							</scroll-view>
							<view class="city-right"> -->
        <!-- 热门城市 -->
        <!-- <scroll-view scroll-y="true" class="scroll-right" :class="{ show: cityCurrent == 0 }">
									<view class="city-right-item">
										<view class="city-item" :class="{ active: city == item.id }" v-for="(item, index) in popularList" :key="index" @click="chooseCity(item.id, 0)">
											{{ item.name }}
										</view>
									</view>
								</scroll-view> -->
        <!-- 其他城市 -->
        <!-- <scroll-view scroll-y="true" class="scroll-right" :class="{ show: cityCurrent == index + 1 }" v-for="(item, index) in cityList" :key="index">
									<view class="city-right-item">
										<view class="city-item" :class="{ active: city == items.id }" v-for="(items, indexs) in item.list" :key="indexs" @click="chooseCity(items.id, item.id)">
											{{ items.name }}
										</view>
									</view>
								</scroll-view>
							</view>
						</view>
					</view>
				</view> -->
        <view
          class="select-item"
          @click.stop="openSelect(1)"
          :class="{ active: showSelect == 1 }"
        >
          <view class="item-top">
            <view class="item-text">困扰</view>
            <image
              :src="`${staticHost}/images/consult/arrow.png`"
              class="arrow"
            ></image>
          </view>
          <view class="item-mask" @click.stop="closeSelect(1)"></view>
          <view class="item-bottom question-box" @click.stop>
            <view class="question-title">
              困扰问题
              <span class="tip">（可多选）</span>
            </view>
            <scroll-view scroll-y="true" class="question-bottom">
              <view
                class="question-item"
                v-for="(item, index) in questionList"
                :key="index"
              >
                <view class="item-title">{{ item.name }}</view>
                <view class="item-list">
                  <view
                    class="item-value"
                    :class="{ active: item.all }"
                    @click="chooseQuestion(item, 'all')"
                    >全部</view
                  >
                  <view
                    class="item-value"
                    v-for="(items, indexs) in item.list"
                    :key="indexs"
                    :class="{ active: tempClass.indexOf(items.id) != -1 }"
                    @click="chooseQuestion(item, items)"
                  >
                    {{ items.name }}
                  </view>
                </view>
              </view>
            </scroll-view>
            <view class="item-btns">
              <view class="btn" @click="resetQuestion">重置</view>
              <view class="btn confirm" @click="confirmQuestion">确定</view>
            </view>
          </view>
        </view>
        <view
          class="select-item"
          @click.stop="openSelect(2)"
          :class="{ active: showSelect == 2 }"
        >
          <view class="item-top">
            <view class="item-text">时间</view>
            <image
              :src="`${staticHost}/images/consult/arrow.png`"
              class="arrow"
            ></image>
          </view>
          <view class="item-mask" @click.stop="closeSelect(2)"></view>
          <view class="item-bottom time-box" @click.stop>
            <view class="padding">
              <view class="time-title">
                咨询时段
                <span class="tip">（可多选）</span>
              </view>
              <view class="blue-tip"
                >首次预约可选择未来7天内的时段，最早可约24小时后时段</view
              >
            </view>
            <view class="weekend-box">
              <view class="day">一</view>
              <view class="day">二</view>
              <view class="day">三</view>
              <view class="day">四</view>
              <view class="day">五</view>
              <view class="day">六</view>
              <view class="day">天</view>
            </view>
            <scroll-view scroll-y="true" class="time-bottom">
              <view class="date-choose">
                <view
                  class="time-item"
                  v-for="(item, index) in dateList"
                  :key="index"
                >
                  <view class="item-title">{{ item.date }}</view>
                  <view class="item-content">
                    <block v-if="index == 0">
                      <block v-for="(items, indexs) in item.List" :key="indexs">
                        <view
                          class="item-day disable"
                          v-if="item.loaction > indexs"
                          >{{ getDay(items) }}</view
                        >
                        <view
                          class="item-day today"
                          :class="{
                            active: getYearMonthDay(items) == chooseDate.date
                          }"
                          v-else-if="item.loaction == indexs"
                          @click="selectDate(items)"
                        >
                          今天
                        </view>
                        <view
                          class="item-day"
                          :class="{
                            active: getYearMonthDay(items) == chooseDate.date
                          }"
                          v-else
                          @click="selectDate(items)"
                          >{{ getDay(items) }}</view
                        >
                      </block>
                    </block>
                    <block v-if="item.List.length >= 2 && index == 1">
                      <view class="item-day" v-for="i in item.loaction"></view>
                      <view
                        class="item-day"
                        :class="{
                          active: getYearMonthDay(items) == chooseDate.date
                        }"
                        v-for="(items, indexs) in item.List"
                        :key="indexs"
                        @click="selectDate(items)"
                      >
                        {{ getDay(items) }}
                      </view>
                    </block>
                  </view>
                </view>
              </view>
              <view class="time-choose">
                <view class="item-title">可选时间</view>
                <view class="item-times">
                  <view
                    class="times"
                    :class="{
                      active:
                        chooseDate.startTime == '08:00:00' &&
                        chooseDate.endTime == '22:00:00'
                    }"
                    @click="selectTime('08:00:00', '22:00:00')"
                  >
                    全天
                  </view>
                  <view
                    class="times"
                    :class="{
                      active:
                        chooseDate.startTime == '08:00:00' &&
                        chooseDate.endTime == '12:00:00'
                    }"
                    @click="selectTime('08:00:00', '12:00:00')"
                  >
                    上午
                  </view>
                  <view
                    class="times"
                    :class="{
                      active:
                        chooseDate.startTime == '12:00:00' &&
                        chooseDate.endTime == '18:00:00'
                    }"
                    @click="selectTime('12:00:00', '18:00:00')"
                  >
                    下午
                  </view>
                  <view
                    class="times"
                    :class="{
                      active:
                        chooseDate.startTime == '18:00:00' &&
                        chooseDate.endTime == '22:00:00'
                    }"
                    @click="selectTime('18:00:00', '22:00:00')"
                  >
                    晚上
                  </view>
                </view>
              </view>
            </scroll-view>
            <view class="item-btns">
              <view class="btn" @click="resetDate">重置</view>
              <view class="btn confirm" @click="confirmDate">确定</view>
            </view>
          </view>
        </view>
        <view
          class="select-item"
          @click.stop="openSelect(3)"
          :class="{ active: showSelect == 3 }"
        >
          <view class="item-top">
            <view class="item-text">价格</view>
            <image
              :src="`${staticHost}/images/consult/arrow.png`"
              class="arrow"
            ></image>
          </view>
          <view class="item-mask" @click.stop="closeSelect(3)"></view>
          <view class="item-bottom choose-box" @click.stop>
            <scroll-view scroll-y="true" class="choose-bottom">
              <view
                class="item-value"
                v-for="(item, index) in priceList"
                :key="index"
                :class="{
                  active:
                    item.initial == tempInitialMoney && item.end == tempEndMoney
                }"
                @click="choosePrice(item, index)"
              >
                {{ item.label }}
              </view>
            </scroll-view>
            <view class="item-btns">
              <view class="btn" @click="resetPrice()">重置</view>
              <view class="btn confirm" @click="confirmPrice()">确定</view>
            </view>
          </view>
        </view>
        <view
          class="select-item"
          @click.stop="openSelect(4)"
          :class="{ active: showSelect == 4 }"
        >
          <view class="item-top">
            <view class="item-text">更多</view>
            <image
              :src="`${staticHost}/images/consult/arrow.png`"
              class="arrow"
            ></image>
          </view>
          <view class="item-mask" @click.stop="closeSelect(4)"></view>
          <view class="item-bottom question-box" @click.stop>
            <view class="question-title">
              更多筛选
              <span class="tip">（可多选）</span>
            </view>
            <scroll-view scroll-y="true" class="question-bottom">
              <view class="question-item">
                <view class="item-title">咨询师性别</view>
                <view class="item-list">
                  <view
                    class="item-value"
                    :class="{ active: tempSex == '' }"
                    @click="chooseSex('all')"
                    >不限</view
                  >
                  <view
                    class="item-value"
                    v-for="(item, index) in sexList"
                    :key="index"
                    :class="{ active: tempSex == item.value || tempSex == '' }"
                    @click="chooseSex(item)"
                    >{{ item.label }}</view
                  >
                </view>
              </view>
              <view class="question-item">
                <view class="item-title">
                  咨询师年龄
                  <span class="tip">（可多选）</span>
                </view>
                <view class="item-list">
                  <view
                    class="item-value"
                    :key="index"
                    :class="{ active: ageAll }"
                    @click="chooseAge('all')"
                    >不限</view
                  >
                  <view
                    class="item-value"
                    v-for="(item, index) in ageList"
                    :key="index"
                    :class="{ active: tempAge.indexOf(item.value) != -1 }"
                    @click="chooseAge(item)"
                  >
                    {{ item.label }}
                  </view>
                </view>
              </view>
              <view class="question-item">
                <view class="item-title">
                  针对群体
                  <span class="tip">（可多选）</span>
                </view>
                <view class="item-list">
                  <view
                    class="item-value"
                    :key="index"
                    :class="{ active: crowdAll }"
                    @click="chooseCrowd('all')"
                    >不限</view
                  >
                  <view
                    class="item-value"
                    v-for="(item, index) in typeList"
                    :key="index"
                    :class="{ active: tempCrowd.indexOf(item.id) != -1 }"
                    @click="chooseCrowd(item)"
                  >
                    {{ item.name }}
                  </view>
                </view>
              </view>
            </scroll-view>
            <view class="item-btns">
              <view class="btn" @click="resetMore">重置</view>
              <view class="btn confirm" @click="confirmMore">确定</view>
            </view>
          </view>
        </view>
        <view
          class="select-item"
          @click.stop="openSelect(5)"
          :class="{ active: showSelect == 5 }"
        >
          <view class="item-top"
            ><image
              :src="`${staticHost}/images/consult/more.png`"
              class="more"
            ></image
          ></view>
          <view class="item-mask" @click.stop="closeSelect(5)"></view>
          <view class="item-bottom choose-box" @click.stop>
            <scroll-view scroll-y="true" class="choose-bottom">
              <view
                class="item-value"
                v-for="(item, index) in sortList"
                :key="index"
                :class="{ active: item.type == tempSortOrder }"
                @click="chooseSort(item)"
              >
                {{ item.title }}
              </view>
            </scroll-view>
            <view class="item-btns">
              <view class="btn" @click="resetSort">重置</view>
              <view class="btn confirm" @click="confirmSort">确定</view>
            </view>
          </view>
        </view>
      </view>
      <scroll-view
        scroll-y="true"
        class="scroll-box"
        id="scroll-box"
        :style="'height:calc(100% - ' + top + 'px)'"
        @scrolltolower="scrollBottom"
      >
        <view class="list">
          <navigator
            hover-class="none"
            :url="'/pages/consult/detail?id=' + item.consultant_id"
            class="list-item"
            v-for="(item, index) in list"
            :key="index"
          >
            <image
              :src="`${host}` + item.img_url"
              class="list-items-img"
              mode="aspectFill"
            ></image>
            <view class="list-items-right">
              <view class="list-items-top">
                <view class="list-items-name">{{ item.main_title }}</view>
                <view class="list-items-intro"
                  >从业{{ item.working_year }}年</view
                >
              </view>
              <u-parse
                :content="item.subtitle"
                class="list-items-title"
              ></u-parse>
              <view class="list-items-text">
                <template v-for="(items, indexs) in item.classAll">
                  {{ items }}
                  <text v-if="indexs < item.classAll.length - 1" class="pd"
                    >|</text
                  >
                </template>
              </view>
              <view class="list-items-content">
                <view>
                  <view class="list-items-time" v-if="item.recentlyTomorrow > 0"
                    >可预约{{
                      item.recentlyDate + ' ' + item.recentlyTime
                    }}</view
                  >
                </view>
                <!-- <view class="list-items-price">
									<text>￥</text>
									{{ formatPrice(item.price) }}
								</view> -->
              </view>
            </view>
          </navigator>
        </view>
      </scroll-view>
    </view>
     <view @click="exchangeShow=true" class="customer-icon"><image :src="`${staticHost}/images/shared/customer-icon.png`" class="icon"></image></view>
    <!-- 底部tabbar栏 -->
    <public-tabbar ref="tabbar" :current="2"></public-tabbar>

    <!-- 客服 -->
    <exchange :show="exchangeShow" v-on:closeExchange="closeExchange"></exchange>
  </view>
</template>

<script>
import { publicMixin } from '../../mixin/public.js'
export default {
  mixins: [publicMixin],
  data() {
    return {
      top: 0,
      color: 'transparent', // 导航栏的背景颜色
      showSelect: -1,
      keyword: '', // 搜索内容
      popularList: [], //热门城市地址列表
      cityList: [], //城市地址列表
      dateList: [],
      chooseDate: {
        date: '',
        startTime: '',
        endTime: ''
      },
      sortList: [
        { title: '综合排序', type: '', checked: false },
        { title: '价格从低到高', type: 'asc', checked: false },
        { title: '价格从高到低', type: 'desc', checked: false }
      ],
      priceList: [], //价格筛选
      questionList: [], //困扰筛选
      sexList: [], //性别筛选
      ageList: [], //年龄筛选
      typeList: [], //针对群体筛选
      list: [], //列表

      flag: true, // 是否加载
      page: 1,
      city: '', //城市id
      cityParent: '',
      cityCurrent: 0, // 默认选中一级分类

      class: [], //困扰问题 "12,13,14"
      tempClass: [], //临时困扰问题 "12,13,14"

      crowd: [], //受众群体 "12,13,14"
      tempCrowd: [], //临时受众群体 "12,13,14"
      crowdAll: false, //受众群体全选

      startDate: '', // 开始日期
      tempStartDate: '', // 临时开始日期

      endDate: '', //结束日期
      tempEndDate: '', //临时结束日期

      initialMoney: '', //开始金额
      tempInitialMoney: '', //临时开始金额

      endMoney: '', //结束金额
      tempEndMoney: '', //临时结束金额

      sex: -1, //性别
      tempSex: -1, //临时性别

      age: [], //年龄
      tempAge: [], //临时年龄
      ageAll: false, //年龄全选

      sortKey: '', //排序 price

      sortOrder: '', // 低到高 asc 高到低 desc  综合 ''
      tempSortOrder: '', // 临时低到高 asc 高到低 desc  综合 ''

      exchangeShow:false, // 客服

    }
  },
  onReady() {
    this.getTop()
  },
  onLoad() {
    var MonthList = this.getMonthTime(new Date())
    var startMonth = this.getYearMonth(MonthList[0])
    var endMonth = this.getYearMonth(MonthList[27])
    var obj1 = {},
      obj2 = {}
    obj1.date = startMonth // 开始月份
    obj1.loaction = new Date().getDay() == 0 ? 6 : new Date().getDay() - 1 // 今天在周几的位置
    obj1.List = []
    obj2.List = []
    MonthList.forEach((item, index) => {
      if (this.getYearMonth(item) != startMonth) {
        obj2.List.push(item)
      } else {
        obj1.List.push(item)
      }
    })
    //28天时间跨月时
    if (startMonth != endMonth) {
      obj2.date = endMonth
      this.dateList.push(obj1)
      obj2.loaction = obj2.List[0].getDay() == 0 ? 6 : obj2.List[0].getDay() - 1 //第二个月出现的位置
      this.dateList.push(obj2)
    } else {
      this.dateList.push(obj1)
    }
    //咨询师列表
    this.getList()
    //获取地址列表
    this.getAddress()
    //获取热门地址列表
    this.getPopularList()
    //困扰
    this.getConsultanTypeList()
    //更多条件
    this.getConsultanMoreConditions()
  },
  methods: {
    openExchange(){
    	this.exchangeShow = true;
    },
    closeExchange(e){
    	this.exchangeShow = e;
    },
    //列表
    getList() {
      if (!this.flag) {
        return false
      }
      var self = this
      let params = {
        page: this.page,
        pageSize: 10,
        keywords: this.keyword,
        city: this.city, //城市id
        class: this.class, //困扰问题 数组
        crowd: this.crowd, //受众群体 数组
        startDate: this.startDate, // 开始日期
        endDate: this.endDate, //结束日期
        initialMoney: this.initialMoney, //开始金额
        endMoney: this.endMoney, //结束金额
        sex: this.sex == -1 ? '' : this.sex, //性别
        age: this.age, //年龄 数组
        sortKey: this.sortKey, //排序 price
        sortOrder: this.sortOrder // 低到高 asc 高到低 desc  综合 ''
      }
      this.$api.consultant.postConsultanList(params).then((res) => {
        if (res.errcode == 0) {
          self.list = self.list.concat(res.list)
          if (res.total == self.list.length) {
            self.flag = false
          }
        }
      })
    },
    //获取地址列表
    getAddress() {
      var self = this
      let params = {}
      this.$api.address.getAddressList(params).then((res) => {
        if (res.errcode == 0) {
          self.cityList = res.list
        }
      })
    },
    //获取热门地址列表
    getPopularList() {
      var self = this
      let params = {}
      this.$api.address.getPopularList(params).then((res) => {
        if (res.errcode == 0) {
          self.popularList = res.list
        }
      })
    },
    // 困扰
    getConsultanTypeList() {
      var self = this
      let params = {}
      this.$api.consultant.getConsultanTypeList(params).then((res) => {
        if (res.errcode == 0) {
          self.questionList = res.list
          console.log('self.questionList',self.questionList);
          self.questionList.forEach((item, index) => {
            item.all = false
          })
        }
      })
    },
    // 更多条件
    getConsultanMoreConditions() {
      var self = this
      let params = {}
      this.$api.consultant.getConsultanMoreConditions(params).then((res) => {
        if (res.errcode == 0) {
          self.priceList = res.priceAll
          self.sexList = res.sexList
          self.ageList = res.ageAll
          self.typeList = res.typeList
        }
      })
    },

    //选择城市
    chooseCity(Id, parentId) {
      this.city = Id
      this.cityParent = parentId //父级id
      this.closeSelect()
      this.resetData()
      this.getList()
    },

    //选择价格
    choosePrice(item, index) {
      this.tempInitialMoney = item.initial
      this.tempEndMoney = item.end
    },
    //确定价格
    confirmPrice() {
      this.initialMoney = this.tempInitialMoney //开始金额
      this.endMoney = this.tempEndMoney //结束金额
      this.closeSelect()
      this.resetData()
      this.getList()
    },
    //重置价格
    resetPrice() {
      this.initialMoney = ''
      this.tempInitialMoney = ''
      this.endMoney = ''
      this.tempEndMoney = ''
      this.resetData()
      this.getList()
    },

    //选择排序
    chooseSort(item) {
      this.tempSortOrder = item.type
    },
    //确定排序
    confirmSort() {
      this.sortOrder = this.tempSortOrder
      this.sortKey = 'price'
      this.closeSelect()
      this.resetData()
      this.getList()
    },
    //重置排序
    resetSort() {
      this.tempSortOrder = ''
      this.sortOrder = ''
      this.sortKey = ''
      this.resetData()
      this.getList()
    },

    //选择年龄
    chooseAge(item) {
      var total = this.ageList.length
      var length = this.tempAge.length
      if (item == 'all') {
        this.tempAge = []
        if (length < total) {
          this.ageList.forEach((ageItem, ageIndex) => {
            this.tempAge.push(ageItem.value)
          })
        }
      } else {
        var indexOf = this.tempAge.indexOf(item.value)
        if (indexOf != -1) {
          this.tempAge.splice(indexOf, 1)
        } else {
          this.tempAge.push(item.value)
        }
      }
      this.ageAll = this.tempAge.length >= this.ageList.length
    },
    //选择针对群体
    chooseCrowd(item) {
      var total = this.typeList.length
      var length = this.tempCrowd.length
      if (item == 'all') {
        this.tempCrowd = []
        if (length < total) {
          this.typeList.forEach((ageItem, ageIndex) => {
            this.tempCrowd.push(ageItem.id)
          })
        }
      } else {
        var indexOf = this.tempCrowd.indexOf(item.id)
        if (indexOf != -1) {
          this.tempCrowd.splice(indexOf, 1)
        } else {
          this.tempCrowd.push(item.id)
        }
      }
      this.crowdAll = this.tempCrowd.length >= this.typeList.length
    },
    //选择性别
    chooseSex(item) {
      if (item == 'all') {
        this.tempSex = ''
      } else {
        this.tempSex = item.value
      }
    },
    //重置更多
    resetMore() {
      this.tempSex = -1
      this.tempAge = []
      this.tempCrowd = []
      this.sex = -1
      this.age = []
      this.crowd = []
      this.resetData()
      this.getList()
    },
    //确认更多
    confirmMore() {
      this.sex = this.tempSex
      this.age = []
      this.age = this.age.concat(this.tempAge)
      this.crowd = []
      this.crowd = this.crowd.concat(this.tempCrowd)
      this.closeSelect()
      this.resetData()
      this.getList()
    },
    //选择困扰
    chooseQuestion(item, items) {
      //点击全选
      if (items == 'all') {
        //取消全选
        if (item.all) {
          for (let i in item.list) {
            var indexOf = this.tempClass.indexOf(item.list[i].id)
            if (indexOf != -1) {
              this.tempClass.splice(indexOf, 1)
            }
          }
          item.all = false
        }
        //全选
        else {
          for (let i in item.list) {
            var indexOf = this.tempClass.indexOf(item.list[i].id)
            if (indexOf == -1) {
              this.tempClass.push(item.list[i].id)
            }
          }
          item.all = true
        }
      } else {
        var flag = -1
        this.tempClass.forEach((tempItem, tempIndex) => {
          if (tempItem == items.id) {
            flag = tempIndex
          }
        })
        if (flag != '-1') {
          this.tempClass.splice(flag, 1)
        } else {
          this.tempClass.push(items.id)
        }

        this.questionList.forEach((questionItem, questionIndex) => {
          var length = 0
          var num = 0
          for (let i in questionItem.list) {
            length++
            if (this.tempClass.indexOf(questionItem.list[i].id) != -1) {
              num++
            }
          }
          if (num >= length) {
            questionItem.all = true //全选
          } else {
            questionItem.all = false //非全选
          }
        })
      }
    },
    //重置困扰
    resetQuestion() {
      this.class = []
      this.tempClass = []
      this.questionList.forEach((item, index) => {
        item.all = false
      })
      this.resetData()
      this.getList()
    },
    //确认困扰
    confirmQuestion() {
      this.class = []
      this.class = this.class.concat(this.tempClass)
      this.closeSelect()
      this.resetData()
      this.getList()
    },
    resetData() {
      this.page = 1
      this.flag = true
      this.list = []
    },
    openSelect(index) {
      this.showSelect == index
        ? (this.showSelect = -1)
        : (this.showSelect = index)
    },
    //关闭蒙层
    closeSelect(index) {
      this.showSelect = -1
      if (index == 1) {
        this.tempClass = []
        this.tempClass = this.tempClass.concat(this.class) //临时困扰等于正式困扰
        this.questionList.forEach((questionItem, questionIndex) => {
          var length = 0
          var num = 0
          for (let i in questionItem.list) {
            length++
            if (this.tempClass.indexOf(questionItem.list[i].id) != -1) {
              num++
            }
          }
          if (num >= length) {
            questionItem.all = true //全选
          } else {
            questionItem.all = false //非全选
          }
        })
      }
      if (index == 2) {
        this.chooseDate.date = this.getYMD(this.startDate)
        this.chooseDate.startTime = this.getHMS(this.startDate)
        this.chooseDate.endTime = this.getHMS(this.endDate)
      }
      if (index == 3) {
        this.tempInitialMoney = this.initialMoney // 临时开始金额
        this.tempEndMoney = this.endMoney // 临时结束金额
      }
      if (index == 4) {
        this.tempSex = this.sex
        this.tempAge = []
        this.tempAge = this.tempAge.concat(this.age)
        this.tempCrowd = []
        this.tempCrowd = this.tempCrowd.concat(this.crowd)
        this.ageAll = this.tempAge.length >= this.ageList.length
        this.crowdAll = this.tempCrowd.length >= this.typeList.length
      }
      if (index == 5) {
        this.tempSortOrder = this.sortOrder //临时排序
      }
    },

    //选择日期
    selectDate(item) {
      this.chooseDate.date = this.getYearMonthDay(item)
    },
    //选择时间
    selectTime(startTime, endTime) {
      this.chooseDate.startTime = startTime
      this.chooseDate.endTime = endTime
    },
    //确认时间
    confirmDate() {
      if (this.chooseDate.date == '') {
        uni.showToast({
          icon: 'none',
          title: '请选择日期',
          duration: 2000
        })
        return false
      }
      if (this.chooseDate.startTime == '' || this.chooseDate.endTime == '') {
        uni.showToast({
          icon: 'none',
          title: '请选择时间',
          duration: 2000
        })
        return false
      }
      this.startDate = this.chooseDate.date + ' ' + this.chooseDate.startTime
      this.endDate = this.chooseDate.date + ' ' + this.chooseDate.endTime
      this.closeSelect()
      this.resetData()
      this.getList()
    },
    //重置时间
    resetDate() {
      this.chooseDate.date = ''
      this.chooseDate.startTime = ''
      this.chooseDate.endTime = ''
      this.startDate = ''
      this.endDate = ''
      this.resetData()
      this.getList()
    },
    search() {
      this.closeSelect()
      this.resetData()
      this.getList()
    },
    getTop() {
      let _this = this
      const query = uni.createSelectorQuery()
      query.select('#scroll-box').boundingClientRect()
      query.selectViewport().scrollOffset()
      query.exec(function (res) {
        _this.top = res[0].top + res[1].scrollTop
      })
    },
    scrollBottom() {
      if (this.flag) {
        this.page++
        this.getList()
      }
    }
  },
  computed: {},
  //控制导航栏背景颜色
  onPageScroll: function (e) {
    if (e.scrollTop > 50) {
      this.color = '#ffffff'
    } else {
      this.color = 'transparent'
    }
  },
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内分享按钮
      console.log(res.target)
    }
    return {
      title: '蓝鸟心理',
      path: '/pages/consult/index'
    }
  }
}
</script>

<style lang="less">
@import './index.less';
</style>
