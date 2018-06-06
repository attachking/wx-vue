import {BASE_URL} from './utils'

export default {
  install(Vue) {
    Vue.prototype.$loading = {
      show() {
        wx.showLoading({
          title: 'loading...',
          mask: true
        })
      },
      hide() {
        wx.hideLoading()
      }
    }
    Vue.prototype.$toast = function(str, icon) {
      wx.showToast({
        title: str,
        icon: 'none' || icon
      })
    }
    Vue.prototype.$confirm = function(str) {
      return new Promise((resolve, reject) => {
        wx.showModal({
          title: '提示',
          content: str,
          showCancel: true,
          success(o) {
            if (o.confirm) {
              resolve()
            } else if (o.cancel) {
              reject(new Error('cancel'))
            } else {
              reject(new Error('mask'))
            }
          }
        })
      })
    }
    Vue.prototype.$alert = function(str) {
      return new Promise((resolve, reject) => {
        wx.showModal({
          title: '提示',
          content: str,
          showCancel: false,
          complete() {
            resolve()
          },
          fail(err) {
            reject(err)
          }
        })
      })
    }
    Vue.prototype.$action = function(arr) {
      return new Promise((resolve, reject) => {
        wx.showActionSheet({
          itemList: arr,
          success(tapIndex) {
            resolve(tapIndex)
          },
          fail(err) {
            reject(err)
          }
        })
      })
    }
    Vue.prototype.$post = function(url, data) {
      return new Promise((resolve, reject) => {
        wx.request({
          url: BASE_URL + url,
          dataType: 'json',
          data: data,
          method: 'POST',
          header: {
            'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          success(res) {
            resolve(res)
          },
          fail(err) {
            reject(err)
          }
        })
      })
    }
    Vue.prototype.$upload = function({url, filePath, name, formData}) {
      return new Promise((resolve, reject) => {
        wx.uploadFile({
          url: BASE_URL + url,
          filePath,
          name,
          formData,
          header: {
            'content-type': 'multipart/form-data'
          },
          success(res) {
            try {
              res.data = JSON.parse(res.data)
            } catch (err) {}
            resolve(res)
          },
          fail(err) {
            reject(err)
          }
        })
      })
    }
    /*
    {
      name: [{required: true, msg: '请输入姓名'}, function(value) {
        if (/^[a-z]{1,12}$/i.test(value)) {
          return true
        } else {
          return new Error('只能输入字母，1-12位')
        }
      }]
    }
    */
    Vue.prototype.$form = {
      validate(rules, values) {
        return new Promise((resolve, reject) => {
          try {
            for (let i in rules) {
              if (rules.hasOwnProperty(i)) {
                let rule = rules[i]
                rule.forEach(item => {
                  if (item.required && !values[i] && values[i] !== 0) {
                    resolve({status: 0, msg: item.msg})
                  } else if (typeof item === 'function') {
                    let result = item(values[i])
                    result instanceof Error && resolve({status: 0, msg: result.message})
                  }
                })
              }
            }
            resolve({status: 1})
          } catch (err) {
            reject(err)
          }
        })
      },
      reset(obj) { // 表单重置
        for (let i in obj) {
          if (obj.hasOwnProperty(i) && i !== 'rowsNum' && i !== 'currentPage') {
            obj[i] = ''
          }
        }
      },
      echo(target, resource) { // 表单回显
        for (let i in target) {
          if (target.hasOwnProperty(i)) {
            target[i] = resource[i] || ''
          }
        }
      }
    }
    Vue.prototype.$router = {
      push(url) {
        wx.navigateTo({url})
      },
      replace(url) {
        wx.redirectTo({url})
      },
      back(delta = 1) {
        wx.navigateBack({delta})
      },
      switchTab(url) {
        wx.switchTab({url})
      }
    }
  }
}
