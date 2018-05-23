<template>
  <picker :range="range" :value="selected" mode="multiSelector" range-key="name" @columnchange="handleColumnChange" @change="handlePicker">
    <span>{{cityName}}</span>
  </picker>
</template>
<script>
  // 两列选择器
  export default {
    name: 'multi-picker',
    props: {
      list: {
        type: Array,
        default: []
      },
      value: {
        type: null,
        default: ''
      },
      multi: { // 表示n级选择器
        type: Number,
        default: 1
      },
      placeholder: {
        type: String,
        default: '请选择'
      }
    },
    data() {
      return {
        cities: [],
        range: [],
        selected: [],
        selectedId: [],
        cityName: '',
        cityCode: ''
      }
    },
    methods: {
      handleColumnChange(e) {
        const detail = e.mp.detail
        this.selectedId[detail.column] = this.range[detail.column][detail.value].id + ''
        this.selectedId.splice(detail.column + 1)
        this.handleRange()
      },
      handlePicker(e) {
        this.$emit('input', this.selectedId[this.selectedId.length - 1])
        this.setCityName()
      },
      handleInit(id) { // 捕获value值变化（根据已选择value值生成 selectedId）
        let _this = this
        let cities = this.cities
        let selectedId = []
        function init(id) {
          let index = cities.findIndex(item => item.id === id + '')
          if (index !== -1) {
            selectedId.unshift(cities[index].id)
            init(cities[index].pid)
          } else {
            _this.selectedId = selectedId
          }
        }
        init(id)
        if (!id) _this.selectedId = []
        this.handleRange()
        this.setCityName()
      },
      handleRange() { // 根据selectedId变化重新渲染列表，补全selectedId
        let _this = this
        let range = []
        let selectedId = this.selectedId
        function init() {
          if (!selectedId.length) {
            let first = _this.cities.filter(item => item.pid === '0')
            if (first.length) {
              range.push(first)
              selectedId[0] = range[0][0] && range[0][0].id
              init()
            }
          } else {
            if (!range.length) range.push(_this.cities.filter(item => item.pid === '0'))
            let i = range.length - 1
            let next = _this.cities.filter(item => item.pid === selectedId[i])
            if (next.length) {
              if (!selectedId[i + 1]) {
                selectedId[i + 1] = next[0].id
              }
              range.push(next)
              init()
            }
          }
        }
        init()
        // 这里处理后的selectedId和range长度是相同的
        this.handleMulti(range)
        this.range = range
        this.viewBack()
      },
      handleMulti(range) { // 根据multi显示n级选择器
        if (!range.length) return
        let selectedId = this.selectedId
        if (range.length > this.multi) { // 若列数超出则进行截断
          range.splice(this.multi)
          selectedId.splice(this.multi)
        }
        for (let i = range.length; i < this.multi; i++) { // 若列数不够则进行补全
          range.push(range[i - 1].filter(item => item.id === selectedId[i - 1]))
          selectedId.push(selectedId[i - 1])
        }
      },
      viewBack() { // 已选值回显
        this.selected = this.selectedId.map((item, i) => this.range[i].findIndex(val => val.id === item))
      },
      setDictionary() { // 设置字典表（初始化）
        this.cities = this.list
        this.handleInit(this.value + '')
      },
      setCityName() { // 设置页面显示值
        let selectedId = this.selectedId
        if (!selectedId.length) {
          this.cityName = this.placeholder
          return
        }
        let name = []
        for (let i = 0; i < selectedId.length; i++) {
          name.push(this.cities[this.cities.findIndex(item => item.id === this.selectedId[i])].name)
        }
        this.cityName = name.join(' ')
      }
    },
    created() {
      this.setDictionary()
    },
    watch: {
      value() {
        setTimeout(() => {
          this.setDictionary()
        }, 20)
      },
      list() {
        setTimeout(() => {
          this.setDictionary()
        }, 20)
      }
    }
  }
</script>
