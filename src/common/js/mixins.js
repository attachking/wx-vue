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
