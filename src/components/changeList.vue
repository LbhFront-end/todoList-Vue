<template>
  <div class="main">
    <div class="changeList flex-col flex-x-center flex-y-center">
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
        <!-- 更新 -->
        <div class="right flex-row flex-x-center flex-y-center" @click="reFresh()">
          <p>更新</p>
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
      <!-- 底部功能键 -->
      <div class="bottomFunction flex-row flex-space-between flex-y-center">
        <div class="f1" @click="deleteList()">
          <img src="../../static/img/c-delete .png" alt="">
        </div>
        <div class="f2" @click="changeStatus()">
          <img src="../../static/img/finish.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
let self;
import { MessageBox } from "mint-ui";
import { Toast } from "mint-ui";
export default {
  name: "changeList",
  data() {
    return {
      oldList: "",
      title: "",
      textarea: "",
      totalTime: "",
      timeKeeper: false,
      date: "",
      realDate: "",
      count: 0,
      id: "",
      newId: "",
      oldId: ""
    };
  },
  created() {
    self = this;
    self.getData();
  },
  methods: {
    //生成随机id
    produceId() {
      self.newId = Math.random().toString(16);
    },
    //   js each模仿jq each
    each(object, callback) {
      var type = (function() {
        switch (object.constructor) {
          case Object:
            return "Object";
            break;
          case Array:
            return "Array";
            break;
          case NodeList:
            return "NodeList";
            break;
          default:
            return "null";
            break;
        }
      })();
      // 为数组或类数组时, 返回: index, value
      if (type === "Array" || type === "NodeList") {
        // 由于存在类数组NodeList, 所以不能直接调用every方法
        [].every.call(object, function(v, i) {
          return callback.call(v, i, v) === false ? false : true;
        });
      } else if (type === "Object") {
        // 为对象格式时,返回:key, value
        for (var i in object) {
          if (callback.call(object[i], i, object[i]) === false) {
            break;
          }
        }
      }
    },
    //获取数据
    getData() {
      var getList = localStorage.getItem("List");
      self.oldList = JSON.parse(getList);
      var a = [];
      self.oldId = self.$route.query.id;
      self.each(self.oldList, function(i, v) {
        if (v.id == self.oldId) {
          self.title = v.title;
          self.textarea = v.content;
          self.realDate = v.time;
        }
      });
      self.textareaCount();
    },
    //开始时间
    startDate() {
      var date = new Date();
      return date;
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
    // 打开时间插件
    openPicker() {
      self.$refs.picker.open();
    },
    // 确定时间
    handleConfirm() {
      var newDate = self.getTime(self.date);
      self.getTimeJudge(newDate);
    },
    //   监控字体的多少
    textareaCount() {
      var textLength = self.textarea.length;
      self.count = 140 - textLength;
    },
    // 判断时间是否过期
    getTimeJudge(time) {
      var today = self.getTime();
      var temp = self.realDate;
      var a = time.replace(/-/g, "/");
      var b = today.replace(/-/g, "/");
      var c = temp.replace(/-/g, "/");
      var judge1 = new Date(c).getTime() - new Date(a).getTime();
      var judge2 = new Date(b).getTime() - new Date(a).getTime();
      if (judge1 == 0) {
        Toast({
          message: "时间没有改变，请重新选择",
          position: "top",
          duration: 3000
        });
        self.timeKeeper = false;
      } else if (judge2 > 0) {
        Toast({
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
    // 更新
    reFresh() {
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
        self.changeOldStorage();
        self.$router.push("/");
      }
    },
    //更新localStorage
    changeOldStorage() {
      self.each(self.oldList, function(i, v) {
        if (v.id == self.oldId) {
          v.title = self.title;
          v.content = self.textarea;
          v.title = self.title;
          v.id = self.newId;
          v.time = self.realDate;
          v.status = 0;
        }
      });
      var a = JSON.stringify(self.oldList);
      localStorage.setItem("List", a);
    },
    //改变状态
    changeStatus() {
      self.each(self.oldList, function(i, v) {
        if (v.id == self.oldId) {
          v.status = 1;
          // console.log(v);
        }
      });
      Toast({
        message: "任务已完成",
        position: "top",
        duration: 3000
      });
      self.changeStorage(self.oldList);
      self.$router.push("/");
    },
    //更新localStorage
    changeStorage(list) {
      var a = JSON.stringify(list);
      localStorage.setItem("List", a);
    },
    //删除
    deleteList() {
      var getList = localStorage.getItem("List");
      var List = JSON.parse(getList);
      MessageBox.confirm("确定删除此条备忘消息？").then(action => {
        localStorage.removeItem("List");
        List = List.filter(item => item.id !== self.oldId);
        var a = JSON.stringify(List);
        localStorage.setItem("List", a);
        self.$router.push("/");
      });
    }
  }
};
</script>
