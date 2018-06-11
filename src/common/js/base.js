import {BASE_URL, post} from './utils'
import store from '../../store'

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
      },
      bar() {
        wx.showNavigationBarLoading()
      },
      barHide() {
        wx.hideNavigationBarLoading()
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
      return post(url, Object.assign({}, {
        _token: store.state.openid || '',
        userId: store.state.userInfo.uid || '',
        ccmu17: store.state.userInfo.ccmu17 || ''
      }, data))
    }
    Vue.prototype.$upload = function({url, filePath, name, formData}) {
      formData = Object.assign({}, {
        _token: store.state.openid || '',
        userId: store.state.userInfo.uid || '',
        ccmu17: store.state.userInfo.ccmu17 || ''
      }, formData)
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
    Vue.prototype.$setTitle = function(title) {
      wx.setNavigationBarTitle({title})
    }
    Vue.prototype.$storage = {
      set(key, value) {
        try {
          wx.setStorageSync(key, value)
        } catch (e) {}
      },
      get(key) {
        let value
        try {
          value = wx.getStorageSync(key)
        } catch (e) {
          value = ''
        }
        return value
      },
      remove(key) {
        try {
          wx.removeStorageSync(key)
        } catch (e) {}
      },
      clear() {
        try {
          wx.clearStorageSync()
        } catch (e) {}
      }
    }
  }
}
