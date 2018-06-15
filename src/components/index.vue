<template>
    <div class="main">
        <div class="index flex-col flex-x-center flex-y-center">
            <!-- 筛选 -->
            <div class="choice flex-x-center flex-y-center flex-row">
                <select v-model="value" id="all" @change="choiceList(value)">
                    <option value="0">全部</option>
                    <option value="1">已完成</option>
                    <option value="2">未完成</option>
                </select>
                <div class="icon-select">
                    <label for="all">
                        <img src="../../static/img/select.png">
                    </label>
                </div>
            </div>
            <!-- 标题 -->
            <div class="title flex-left flex-col flex-y-center">
                <p>待办事件</p>
            </div>
            <!-- 事件列表 -->
            <div class="lists flex-col flex-x-center flex-y-center" v-if="total">
                <!-- 单个列表 -->
                <!-- 列表Border -->
                <li class="list-border flex-col flex-x-center flex-y-center" v-for="item in newList||List  " :key="item.id" :class="getBorderClass(item.id,item.time,item.status)">
                    <router-link :to="'/changeList?id='+item.id">
                        <div class="list flex-col flex-x-center flex-y-center">
                            <!-- 主标题+时间 -->
                            <div class="titlesTime flex-row flex-space-between flex-y-center">
                                <div class="titles">
                                    <p>{{item.title}}</p>
                                </div>
                                <div class="time">
                                    <p>{{getTime(item.time)}}</p>                            
                                </div>
                            </div>
                            <!-- 主要内容 -->
                            <div class="content flex-row flex-space-between flex-y-center">
                                <div class="text">
                                    <p>{{getContent(item.content)}}</p>
                                </div>
                                <!-- <div class="delect" @click="deleteList(item.id)">
                                    <img src="../../static/img/c-delete .png">
                                </div> -->
                            </div>
                        </div>
                    </router-link>
                </li>
            </div>
            <div class="tip flex-col flex-x-center flex-y-center" v-else>
                <p>您暂时还没有备忘录哦,快点击右下角添加吧</p>
            </div>            
            <!-- 底部功能键 -->
            <div class="bottomFunction flex-row flex-space-between flex-y-center">
                <div class="f1" @click="clearStorage()">
                    <img src="../../static/img/classify.png" alt="">
                </div>
                <div class="note">
                    <p>总共 {{total}} 个备忘录</p>
                </div>
                <div class="f2">
                    <router-link :to="{path:'/addList'}">
                        <img src="../../static/img/add.png" alt="">
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
let self;
import { MessageBox } from "mint-ui";
export default {
  name: "index",
  data() {
    return {
      value: "0",
      total: 0,
      newList: "",
      List: []
    };
  },
  created() {
    self = this;
    self.getDate();
  },
  methods: {
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
    //   获取localStorage里面的数据
    getDate() {
      var getList = localStorage.getItem("List");
      self.List = JSON.parse(getList);
      if (self.List) {
        self.total =  self.List.length;
      }
    },
    //已完成|全部|未完成|改变超时的status
    getBorderClass(id, time, status) {
      var oldDate = new Date(time);
      var nowDate = new Date();
      var judge = nowDate.getTime() - oldDate.getTime();
      if (status == 0) {
        if (judge > 0) {
          var a = self.List;
          self.each(a, function(i, v) {
            if (v.id == id) {
              v.status = 2;
            }
          });
          return "overT";
        } else {
          return "";
        }
      } else if (status == 1) return "finishT";
      else {
        return "overT";
      }
    },
    // 多余的字变成..
    getContent(content) {
      var str = content;
      if (str.length > 18) {
        str = str.substr(0, 18) + "...";
        return str;
      } else {
        return str;
      }
    },
    //时间判断
    getTime(oldDate) {
      var oldDate = new Date(oldDate);
      var nowDate = new Date();
      var tomorrow = new Date(oldDate);
      var yesterday = new Date(oldDate);
      tomorrow.setTime(oldDate.getTime() - 24 * 60 * 60 * 1000);
      yesterday.setTime(oldDate.getTime() + 24 * 60 * 60 * 1000);

      var Year = oldDate.getFullYear(); //年
      var Month = oldDate.getMonth() + 1; //月
      var date = oldDate.getDate(); //日
      var hours = oldDate.getHours(); //小时
      var minutes = oldDate.getMinutes(); //分
      var seconds = oldDate.getSeconds(); //秒
      if (Month < 10) {
        Month = "0" + Month;
      }
      if (date < 10) {
        date = "0" + date;
      }
      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      //判断是否是今天|明天|昨天
      if (nowDate.toDateString() === new Date(oldDate).toDateString()) {
        if (hours < 12) {
          hours = "今天 早上 " + hours;
        } else if (hours > 12 && hours < 17) {
          hours = "今天 下午 " + (hours - 12);
        } else {
          hours = "今天 晚上 " + (hours - 12);
        }
        return [hours, minutes].join(":");
      } else if (
        new Date(tomorrow).toDateString() === new Date().toDateString()
      ) {
        if (hours < 12) {
          hours = "明天 早上 " + hours;
        } else if (hours > 12 && hours < 17) {
          hours = "明天 下午 " + (hours - 12);
        } else {
          hours = "明天 晚上 " + (hours - 12);
        }
        return [hours, minutes].join(":");
      } else if (
        new Date(yesterday).toDateString() === new Date().toDateString()
      ) {
        if (hours < 12) {
          hours = "昨天 早上 " + hours;
        } else if (hours > 12 && hours < 17) {
          hours = "昨天 下午 " + (hours - 12);
        } else {
          hours = "昨天 晚上 " + (hours - 12);
        }
        return [hours, minutes].join(":");
      }
      return [Year, Month, date].join("-") + " " + [hours, minutes].join(":");
    },
    //选择类型
    choiceList(value) {
      if (value == 0) {
        self.newList = self.List;
      } else {
        self.newList = self.List.filter(item => item.status == value);
        if (!self.newList) {
          return;
        }
      }
    },
    //删除
    deleteList(id) {
      MessageBox.confirm("确定删除此条备忘消息？").then(action => {
        self.List = self.List.filter(item => item.id !== id);
        var a = JSON.stringify(self.List);
        localStorage.setItem("List", a);
      });
    },
    //清除所有
    clearStorage() {
      MessageBox.confirm("确定删除所有消息？").then(action => {
        localStorage.removeItem("List");
        self.getDate();
      });
    }
  }
};
</script>
