<template>
  <div class="main">
    <div class="addList flex-col flex-x-center flex-y-center">
      <!-- 头部 -->
      <div class="headPosition flex-row flex-space-between flex-y-center">
        <!-- 左边icon与字 -->
        <div class="left flex-row flex-x-center flex-y-center">
          <div class="leftBack-icon flex-row flex-x-center flex-y-center">
            <router-link :to="{path:'/'}" class="flex-row flex-x-center flex-y-center">
              <img src="../../static/img/back.png" alt="">
            </router-link>
          </div>
          <div class="leftBack-text flex-row flex-x-center flex-y-center">
            <p>待办事件</p>
          </div>
        </div>
        <!-- add添加 -->
        <div class="right flex-row flex-x-center flex-y-center" @click="addList()">
          <p>添加</p>
        </div>
      </div>
      <!-- 标题 -->
      <div class="textTitle flex-col flex-left flex-y-center">
        <div class="smallHead flex-col flex-left flex-y-center">
          <p>标题</p>
        </div>
        <div class="textTitle-input">
          <input type="text" v-model="title" placeholder="请输入您的所办事情的标题">
        </div>
      </div>
      <!-- 内容 -->
      <div class="textContent flex-col flex-left flex-y-center">
        <div class="smallHead flex-col flex-left flex-y-center">
          <p>内容</p>
        </div>
        <div class="textContent-input">
          <textarea v-model="textarea" maxlength="140" placeholder="请输入您的办事内容" @input="textareaCount()"></textarea>
          <p class="count">{{count}}/140</p>
        </div>
      </div>
      <!-- 时间 -->
      <div class="textTime flex-col flex-left flex-y-center">
        <div class="smallHead flex-col flex-left flex-y-center">
          <p>时间</p>
        </div>
        <div class="textTime-input flex-row flex-space-between flex-y-center">
          <div class="modal-input" @click="openPicker()">
            <p>{{ realDate || '请选择您的时间' }}</p>
          </div>          
          <mt-datetime-picker 
            ref="picker" 
            type="datetime" 
            v-model="date" 
            :startDate ="startDate()"
            @confirm="handleConfirm()"
            year-format="{value} 年"
            month-format="{value} 月"
            date-format="{value} 日"
            hourFormat="{value} 时"
            minuteFormat="{value} 分">
          </mt-datetime-picker>    
        </div>  
      </div>
    </div>
  </div>
</template>
<script>
let self;
import { Toast } from "mint-ui";
export default {
  name: "addList",
  data() {
    return {
      title: "",
      textarea: "",
      date: "",
      count: 0,
      id: "",
      timeKeeper: false,
      realDate: ""
    };
  },
  created() {
    self = this;
    self.realDate = self.getTime();
    self.produceId();
  },
  methods: {
    //生成随机id
    produceId() {
      self.id = Math.random().toString(16);
    },
    //   监控字体的多少
    textareaCount() {
      var textLength = self.textarea.length;
      self.count = 140 - textLength;
    },
    // 打开时间插件
    openPicker() {
      self.$refs.picker.open();
    },
    //开始时间
    startDate() {
      var date = new Date();
      return date;
    },
    // 确定时间
    handleConfirm() {
      var newDate = self.getTime(self.date);
      self.getTimeJudge(newDate);
    },
    //获取时间有参或者无参
    getTime(time) {
      if (time) {
        var now = new Date(time);
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var date = now.getDate();
        var hour = now.getHours();
        var minute = now.getMinutes();
      } else {
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var date = now.getDate();
        var hour = now.getHours();
        var minute = now.getMinutes();
      }
      if (month < 10) {
        month = "0" + month;
      }
      if (date < 10) {
        date = "0" + date;
      }
      if (hour < 10) {
        hour = "0" + hour;
      }
      if (minute < 10) {
        minute = "0" + minute;
      }
      var finalDate =
        [year, month, date].join("-") + " " + [hour, minute].join(":");
      return finalDate;
    },
    // 判断时间是否过期
    getTimeJudge(time) {
      var today = self.getTime();
      var a = time.replace(/-/g,'/');
      var b = today.replace(/-/g,'/');
      var judge = new Date(b).getTime() - new Date(a).getTime();
      console.log(judge);
      if (judge == 0) {
        Toast({
          className:"tip",
          message: "不可以选择过去的时间",
          position: "top",
          duration: 3000
        });
        self.timeKeeper = false;
      } else {
        self.realDate = time;
        self.timeKeeper = true;
      }
    },
    //获取之前的localStorage 并且添加数据
    getOldStorage() {
      var oldList = localStorage.getItem("List");
      var oldStorage = JSON.parse(oldList);

      var newDate = {
        id: self.id,
        title: self.title,
        content: self.textarea,
        time: self.realDate,
        status: 0
      };
      if (oldStorage) {
        oldStorage.push(newDate);
        var a = JSON.stringify(oldStorage);
        localStorage.setItem("List", a);
      } else {
        var stroage = [];
        stroage.push(newDate);
        var a = JSON.stringify(stroage);
        localStorage.setItem("List", a);
      }
    },
    // 添加备忘录
    addList() {
      if (!self.title) {
        Toast({
          message: "标题不可以为空",
          position: "top",
          duration: 3000
        });
        return false;
      } else if (!self.textarea) {
        Toast({
          message: "内容不可以为空",
          position: "top",
          duration: 3000
        });
        return false;
      } else if (!self.timeKeeper) {
        self.getTimeJudge(self.realDate);
      } else {
        self.getOldStorage();
        self.$router.push("/");
      }
    }
  }
};
</script>
