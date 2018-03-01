const app = getApp();
const add = 0;
const sub = 1;
const multi = 2;
const div = 3;
const timeoutSecond = 10;
var that;
var manualSubmited = false;// 是否进行了手动交卷

function randomFrom(lowerValue, upperValue) {
    return Math.floor(Math.random() * (upperValue - lowerValue + 1) + lowerValue);
}

function judge() {
    if (that.ans === that.userAns) {
        console.log('ans right' + Date.now());
        wx.showToast({
            title: '正确',
            icon: 'success',/*default*/
            duration: 1000,
            success: () => {
                app.globalData.questionIndex++;
                setTimeout(function () {
                    wx.redirectTo({
                        url: '/pages/game/game',
                    })
                }, 1000);
            }
        })
    } else {
        app.globalData.gameover = true;
        console.log('ans error');
        wx.showModal({
            title: '回答错误',
            content: '正确答案：' + that.ans + '， 您答对' + (app.globalData.questionIndex - 1) + '道题',
            showCancel: false,
            success: function (res) {
                wx.reLaunch({
                    url: '/pages/index/index',
                })
            }
        })
    }
}

function setViewAndJudge() {
    that.setData({
        inputDisable: true,
        inputFocus: false,
    });
    console.log(that.ans + ', ' + that.userAns);
    setTimeout(judge, 100);// 为了让键盘有时间收起来
}

/**
 * 倒计时
*/
function countDown() {
    if (manualSubmited || app.globalData.gameover) {
        return;
    }
    let newLeftTime = that.data.leftTime - 1;
    that.setData({ leftTime: newLeftTime })
    if (newLeftTime <= 0) {
        console.log('timeout');
        setViewAndJudge();
    } else {
        setTimeout(countDown, 1000);
    }
}

Page({
    timeout: timeoutSecond * 1000,
    ans: 0,
    userAns: 0,
    data: {    
        inputDisable: false,
        inputFocus: true,
        leftTime: timeoutSecond,
    },
    onLoad: function (option) {
        this.setData({ questionIndex: app.globalData.questionIndex })
        let a, b;
        let op = randomFrom(0, 200) % 4;
        let q, ans, operator;
        switch (op) {
            case add:
                a = randomFrom(0, 200);
                b = randomFrom(0, 200);
                operator = '+';
                this.ans = a + b;
                break;
            case sub:
                a = randomFrom(0, 200);
                b = randomFrom(0, 200);
                if (a < b) {
                    let c = a;
                    a = b;
                    b = c;
                }
                operator = '-';
                this.ans = a - b;
                break;
            case multi:
                a = randomFrom(2, 20);
                b = randomFrom(2, 20);
                operator = '×';
                this.ans = a * b;
                break;
            case div:
                a = randomFrom(2, 20);
                b = randomFrom(2, 20);
                this.ans = a;
                a = a * b;
                operator = '÷';
                break;
        }
        this.setData({
            operator: operator,
            n1: a,
            n2: b,
        });

        that = this;
        manualSubmited = false;
        setTimeout(countDown, 1000);

    },
    onAnsInput: function (e) {
        console.log(e);
        this.userAns = parseInt(e.detail.value);
    },
    exit: function () {
        wx.showModal({
            title: '提示',
            content: '确定退出？',
            success: function (res) {
                if (res.confirm) {
                    app.globalData.gameover = true;
                    wx.reLaunch({
                        url: '/pages/index/index',
                    })
                }
            }
        })
    },
    manualSubmit: function() {
        manualSubmited = true;
        setViewAndJudge();
    },
    onShareAppMessage: function (res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: '来口算',
            path: '/page/index/index',
            desc: '一起来口算吧',
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        }
    },
})