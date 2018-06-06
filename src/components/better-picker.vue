<template>
  <div class="better-picker">
    <div @click="toggleShow" class="show-name">{{showName}}</div>
    <div class="mask-con" v-if="show" @click="toggleShow">
      <div class="mask" @click.stop>
        <picker-view :value="values" @change="handleChange" class="picker">
          <picker-view-column v-for="(val, key) in columns" :key="key">
            <div class="better-text" v-for="(item, i) in val" :key="item.id">{{item.name}}</div>
          </picker-view-column>
        </picker-view>
        <div class="btn">
          <div class="cancel between" @click="toggleShow">取消</div>
          <div class="reset between" @click="reset">重置</div>
          <div class="confirm between" @click="confirm">确定</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'better-picker',
    props: {
      list: {
        type: Array,
        default() {
          return []
        }
      },
      value: {
        type: null,
        default() {
          return ''
        }
      },
      multi: {
        type: Number,
        default: 1
      },
      placeholder: {
        type: String,
        default: '请选择'
      },
      last: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        columns: [],
        values: [],
        showName: '',
        valuesId: [],
        show: false
      }
    },
    methods: {
      confirm() { // 确定按钮
        let name = []
        this.valuesId = []
        this.columns.forEach((item, key) => {
          name.push(item[this.values[key]].name)
          this.valuesId.push(item[this.values[key]].id)
        })
        if (this.valuesId.length) {
          this.$emit('input', this.valuesId[this.valuesId.length - 1])
        }
        if (this.last) {
          this.showName = name[name.length - 1]
        } else {
          this.showName = name.join(' ')
        }
        this.toggleShow()
      },
      reset() { // 重置按钮
        this.showName = this.placeholder
        this.$emit('input', '')
        this.toggleShow()
      },
      toggleShow() {
        this.show = !this.show
      },
      renderValuesId(value) { // 根据传来的值补全valuesId数组
        if (!this.list.length) return
        let _this = this
        value = value + ''
        this.valuesId = []
        function search(id) {
          _this.valuesId.unshift(id)
          let i = _this.list.findIndex(item => item.id === id)
          if (i === -1) return
          let item = _this.list[i]
          if (item.pid === '0') return
          search(item.pid)
        }
        if (value) {
          search(value)
        } else {
          this.showName = this.placeholder
        }
        this.renderColumns()
      },
      handleChange(e) { // 捕获滚动选择change事件
        let value = e.mp.detail.value
        for (let i = 0; i < value.length; i++) {
          if (value[i] !== this.values[i]) {
            this.value = this.columns[i][value[i]].id
            break
          }
        }
        this.renderValuesId(this.value)
      },
      renderColumns() { // 渲染每一列数据，补全values
        let columns = []
        this.values = []
        let firstColumn = [...this.list.filter(item => item.pid === '0')]
        columns.push(firstColumn)
        let firstIndex = firstColumn.findIndex(item => item.id === this.valuesId[0])
        if (firstIndex === -1) firstIndex = 0
        this.values.push(firstIndex)
        for (let i = 1; i < this.multi; i++) {
          let valueId = this.valuesId[i - 1]
          if (!valueId) valueId = columns[i - 1][0].id
          let column = [...this.list.filter(item => item.pid === valueId)]
          if (column.length) {
            columns.push(column)
          } else {
            break
          }
          let value = column.findIndex(item => item.id === this.valuesId[i])
          if (value !== -1) {
            this.values.push(value)
          } else {
            this.values.push(0)
          }
        }
        this.columns = columns
      }
    },
    created() {
      this.showName = this.placeholder
      this.renderValuesId(this.value)
      this.$watch('value', (newVal) => {
        this.renderValuesId(newVal)
      })
      this.$watch('list', () => {
        setTimeout(() => {
          this.renderValuesId(this.value)
        }, 20)
      })
    }
  }
</script>
<style lang="scss">
  @import "../common/style/variables";

  @keyframes slideBottom {
    0%{
      transform: translate(0, 100%);
    }
    100%{
      transform: translate(0, 0);
    }
  }
  .better-picker{
    .show-name{
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .mask-con{
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,.2);
    }
    .mask{
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 40%;
      background: #fff;
      padding: 0 80rpx;
      box-sizing: border-box;
      animation: slideBottom .5s;
      .btn{
        background: #fff;
        position: absolute;
        width: 100%;
        left: 0;
        top: -50rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .between{
          font-size: 28rpx;
          padding: 10rpx 20rpx;
        }
        .cancel{
          color: #666;
        }
        .confirm{
          color: $theme;
        }
        .reset{
          color: #1AAD16;
        }
      }
      .picker{
        width: 100%;
        height: 100%;
      }
      .better-text{
        text-align: center;
        font-size: 28rpx;
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
</style>
