# todolist项目

> 试用期间考核的项目练习  
主要涉及的技术是Vue+localstorage,采用了饿了么的移动端框架。  
主要功能：  
`区分功能`：对未完成的事情进行简单的记录，超过时间未完成的会标为红色，已完成状态的为蓝色。  
`状态改变`：可以对所有事件通过设置新的时间进行状态更改。  
`筛选功能`：分为全部|已完成|未完成 等

## 遇到的问题

>问题1：  
IOS `getTime()` 出现 `NaN` 的问题，原因在于苹果的时间格式为 `yy/mm/dd hh:mm` 而一般出现的时间为 `yy-mm-dd hh:mm`,在 `new Date().getTime(a)` 前,先将 `a` 用正则表达式 `replace(/-/g,'/')`转换为苹果所用的时间格式后再进行取值就不会报错  
>
>问题2：  
`input` 可以用 `readonly` 取消弹出键盘，但是光标还是会出现，最好的方法是自己用 `div` 模拟


## Build Setup

``` bash
# 安装依赖
npm install

# 运行服务器，具体的要在config/index.js里面的host调为自己的ip或者是localhost
npm run dev

# 项目打包
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```
