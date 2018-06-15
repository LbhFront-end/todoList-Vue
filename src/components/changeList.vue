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
                    <textarea v-model="textarea" maxlength="140" placeholder="请输入您的办事内容"  @input="textareaCount()"></textarea>
                    <p class="count">{{count}}/140</p>
                </div>                
            </div>
            <!-- 时间 -->
            <div class="textTime flex-col flex-left flex-y-center">
                <div class="smallHead flex-col flex-left flex-y-center">
                    <p>时间</p>
                </div>
                <div class="textTime-input flex-row flex-space-between flex-y-center">
                    <input type="date" v-model="date">
                    <input type="time" v-model="time">
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
      date: "",
      time: "",
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
          self.totalTime = v.time;
        }
      });
      self.getTime(self.totalTime);
      self.textareaCount();
    },
    //分配时间
    getTime(timetime) {
      var a = timetime.split(" ");
      self.date = a[0];
      self.time = a[1];
    },
    //   监控字体的多少
    textareaCount() {
      var textLength = self.textarea.length;
      self.count = 140 - textLength;
    },
    // 判断时间是否过期
    getTimeJudge() {
      var dates = self.date + " " + self.time;
      var setDate = new Date(dates);
      var today = new Date();
      var judge = today.getTime() - setDate.getTime();
      if (judge > 0) {
        return false;
      } else {
        return true;
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
      } else if (!self.getTimeJudge()) {
        Toast({
          message: "不可以选择过去的时间",
          position: "top",
          duration: 3000
        });
        return false;
      } else {
        self.changeOldStorage();
        // self.$router.push("/");
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
          v.time = self.date + " " + self.time;
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
          console.log(v);
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
