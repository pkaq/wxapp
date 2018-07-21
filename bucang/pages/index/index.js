//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    //持仓价格
    holdingPrice: '',
    //持仓数量
    holdingNumber: 100, 
    // 补仓价格
    coverPrice: '',
    // 补仓数量
    coverNumber: 100,
    // 最终成本
    finalCost: '',
    // 交易所
    exchange: 'SZ',
    // 交易所
    radio: [{
      value: '上证', name:'SH', checked: true
    },{
      value: '深证', name:'SZ'
    }],
    // 佣金
    selected: 1,
    show: false,   
    options: [{
      name: '万分之 2',
      value: 0.0002
    },{
      name: '万分之 2.5',
      value: 0.00025
    }, {
      name: '万分之 3',
      value: 0.0003
    }] 

  },
  //事件处理函数
  onLoad: function () {

  },
  //选择交易所
  handleRadioChange(e){
    this.setData({
      exchange: e.detail.detail.value
    })
  },
  //重置
  handleReset() {
    this.setData({
      holdingPrice: '',
      holdingNumber: 100,
      coverPrice: '',
      coverNumber: 100,
      finalCost: ''
    })
  },
  // 计算成本
  handleCalculate(e) {
    let formValue = e.detail.value;
    
    if (!!!formValue.holdingPrice || formValue.holdingPrice == 0) {
      wx.showToast({
        icon: "none",
        title: "请输入正确的持仓价格",
        mask: true
      })
      return false
    }
    if (!!!formValue.coverPrice || formValue.coverPrice == 0) {
     wx.showToast({
        icon: "none",
        title: "请输入正确的补仓价格",
        mask: true
      })
      return false
    }

    let data = this.data;

    //(第一次买入数量 * 买入价 + 第二次买入数量 * 买入价 + 交易费用[手续费+过户费]) / (第一次买入数量 + 第二次买入数量) 

    // 上证过户费
    let transfer = 0;
    if('SH' === data.exchange){
      transfer = (data.coverNumber * formValue.coverPrice) * 0.0002;
    }
    // 计算佣金
    let charge = (data.coverNumber * formValue.coverPrice) * data.options[data.selected].value;
        charge = charge < 5 ? 5 : charge;
    

    let finalCost = ((data.holdingNumber * formValue.holdingPrice) 
                   + (data.coverNumber * formValue.coverPrice) 
                   + (charge + transfer))
                   / (this.data.holdingNumber + this.data.coverNumber);
    finalCost = finalCost.toFixed(3);
    this.setData({
      finalCost: finalCost
    });
  },
  //持仓数量调整
  handleHoldNumberChange({
    detail: stepper
  }) {
    this.setData({
      'holdingNumber': stepper
    });
  },
  //补仓数量调整
  handleCoverNumberChange({
    detail: stepper
  }) {
    this.setData({
      'coverNumber': stepper
    });
  },
  // 选择佣金
  handleCommission(){
    this.setData({
      show : true
    })
  },
  // 取消关闭
  closeActionSheet(){
    this.setData({
      show: false
    })
  },
  handleActionClick({ detail }){
    this.setData({
      selected: detail.index,
      show: false
    })
  }
})
