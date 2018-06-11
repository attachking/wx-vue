<template>
  <wxParse :content="rich" @preview="preview" @navigate="navigate" noData="--"></wxParse>
</template>
<script>
  import wxParse from 'mpvue-wxparse'

  export default {
    components: {
      wxParse
    },
    props: {
      nodes: {
        type: String,
        default: ''
      }
    },
    name: 'rich-txt',
    data() {
      return {
        rich: ''
      }
    },
    methods: {
      handleRich(rich) {
        if (typeof rich === 'string') {
          // 去注释去html属性
          this.rich = rich.replace(/<([a-zA-Z1-6]+)\s*[^><]*>/g, '<$1>').replace(/<!--[\s\S]*?-->/g, '')
        } else {
          this.rich = '--'
        }
      },
      preview() {},
      navigate() {}
    },
    created() {
      this.handleRich(this.nodes)
      this.$watch('nodes', this.handleRich)
    }
  }
</script>
<style lang="scss">
  @import url("~mpvue-wxparse/src/wxParse.css");
</style>
