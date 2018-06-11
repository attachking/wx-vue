export const listMixins = {
  onPullDownRefresh() {
    this.searchData.currentPage = 1
    this.getList()
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
  },
  onReachBottom() {
    if (this.pageBean.hasNextPage && !this.listLoading) {
      this.searchData.currentPage = this.pageBean.nextPage
      this.getList()
    }
  }
}

export const normalMixins = {
  showMap(obj) {
    getAuthen('scope.userLocation').then(() => {
      wx.openLocation(obj)
    })
  },
  tel(phoneNumber) {
    this.$action(['拨号']).then(res => {
      wx.makePhoneCall({phoneNumber})
    })
  }
}

export function getAuthen(scope) {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success(res) {
        if (!res.authSetting[scope]) {
          wx.authorize({
            scope: scope,
            success() {
              resolve()
            },
            fail(err) {
              reject(err)
            }
          })
        } else {
          resolve()
        }
      }
    })
  })
}
