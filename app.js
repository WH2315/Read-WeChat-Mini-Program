App({
  onLaunch(){
    // 若使用云函数，将此处的 env 替换为你的云环境 ID
    if (wx.cloud) {
      wx.cloud.init({ env: '', traceUser: false });
    }
  },
  globalData: {}
})
