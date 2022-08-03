const app = getApp();
//引入插件：微信同声传译
const plugin = requirePlugin('WechatSI');
//获取全局唯一的语音识别管理器recordRecoManager
const manager = plugin.getRecordRecognitionManager();
var call = require("./request.js")

Page({
    /**
     * 页面的初始数据
     */
    data: {
        navState: 0,
        //语音
        recordState: false, //录音状态
        content: '',//内容
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //识别语音
        this.initRecord();
    },
    // 手动输入内容
    conInput: function (e) {
        this.setData({
            content: e.detail.value,
        })
    },
    //识别语音 -- 初始化
    initRecord: function () {
        const that = this;
        // 有新的识别内容返回，则会调用此事件
        manager.onRecognize = function (res) {
            console.log(res)
        }
        // 正常开始录音识别时会调用此事件
        manager.onStart = function (res) {
            console.log("成功开始录音识别", res)
        }
        // 识别错误事件
        manager.onError = function (res) {
            console.error("error msg", res)
        }
        //识别结束事件
        manager.onStop = function (res) {
            console.log('..............结束录音')
            console.log('录音临时文件地址 -->' + res.tempFilePath);
            console.log('录音总时长 -->' + res.duration + 'ms');
            console.log('文件大小 --> ' + res.fileSize + 'B');
            console.log('语音内容 --> ' + res.result);
            //   if (res.result == '') {
            //     wx.showModal({
            //       title: '提示',
            //       content: '听不清楚，请重新说一遍！',
            //       showCancel: false,
            //       success: function (res) {}
            //     })
            //     return;
            //   }
            that.checkWord("123")
        }
    },
    //语音  --按住说话
    touchStart: function (e) {
        this.setData({
            recordState: true  //录音状态
        })
        // 语音开始识别
        manager.start({
            lang: 'zh_CN',// 识别的语言，目前支持zh_CN en_US zh_HK sichuanhua
        })
    },
    //语音  --松开结束
    touchEnd: function (e) {
        this.setData({
            recordState: false
        })
        // 语音结束识别
        manager.stop();
    },

    checkWord: function (e) {
        call.getData("/hello", this.dosuccess, this.dofail);
    },

    dosuccess: function (e) {
        console.log(e)
        this.setData({
            word: {"people":e.test,"point":"1"}
        })
    },

    dofail: function (e) {
        console.log('request fail --> ' + e);
    },
    confirm: function (e) {
        var text = this.data.content + this.data.word.people + ": " + this.data.word.point  + "\n";
        this.setData({
            content: text,
            word: ""
        })
    },
    //监听滑块
    bindchange(e) {
        // console.log(e.detail.current)
        let index = e.detail.current;
        this.setData({
            navState: index
        })
    },
    //点击导航
    navSwitch: function (e) {
        // console.log(e.currentTarget.dataset.index)
        let index = e.currentTarget.dataset.index;
        this.setData({
            navState: index
        })
    },
})