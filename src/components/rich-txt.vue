<template>
  <div>
    <rich-text :nodes="contents" class="wxParse"></rich-text>
    <rich-text :nodes="contents2" class="wxParse"></rich-text>
    <rich-text :nodes="contents3" class="wxParse"></rich-text>
    <rich-text :nodes="contents4" class="wxParse"></rich-text>
    <rich-text :nodes="contents5" class="wxParse"></rich-text>
    <rich-text :nodes="contents6" class="wxParse"></rich-text>
    <rich-text :nodes="contents7" class="wxParse"></rich-text>
    <rich-text :nodes="contents8" class="wxParse"></rich-text>
    <rich-text :nodes="contents9" class="wxParse"></rich-text>
    <rich-text :nodes="contents10" class="wxParse"></rich-text>
  </div>
</template>
<script>
  import wxParse from '../common/js/html2json'

  export default {
    props: {
      nodes: {
        type: String,
        default: ''
      },
      noData: {
        type: String,
        default: ''
      },
      startHandler: {
        type: Function,
        default() {
          return (node) => {
            node.attr.class = null
            node.attr.style = null
          }
        }
      },
      endHandler: {
        type: Function,
        default: null
      },
      charsHandler: {
        type: Function,
        default: null
      },
      imageProp: {
        type: Object,
        default() {
          return {
            mode: 'aspectFit',
            padding: 0,
            lazyLoad: false,
            domain: ''
          }
        }
      }
    },
    name: 'rich-txt',
    data() {
      return {
        content: '',
        contents: [],
        contents2: [],
        contents3: [],
        contents4: [],
        contents5: [],
        contents6: [],
        contents7: [],
        contents8: [],
        contents9: [],
        contents10: []
      }
    },
    methods: {
      htmlParse() {
        const {
          content,
          noData,
          imageProp,
          startHandler,
          endHandler,
          charsHandler
        } = this
        const parseData = content || noData
        const customHandler = {
          start: startHandler,
          end: endHandler,
          chars: charsHandler
        }
        const results = wxParse(parseData, customHandler, imageProp, this)
        this.nodesParse(results.nodes)
        return results.nodes
      },
      nodesParse(nodes) {
        nodes.forEach(item => {
          if (item.node === 'text') {
            item.type = 'text'
          } else {
            item.type = 'node'
            item.name = item.tag
          }
          delete item.node
          delete item.tag
          item.attrs = {}
          item.classStr && (item.attrs.class = item.classStr)
          item.attr && item.attr.src && (item.attrs.src = item.attr.src)
          delete item.attr
          delete item.classStr
          if (item.nodes && item.nodes.length) {
            item.children = item.nodes
            this.nodesParse(item.children)
          }
          delete item.nodes
        })
      },
      handleRich(rich) {
        this.contents = []
        this.contents2 = []
        this.contents3 = []
        this.contents4 = []
        this.contents5 = []
        this.contents6 = []
        this.contents7 = []
        this.contents8 = []
        this.contents9 = []
        this.contents10 = []
        setTimeout(() => {
          if (typeof rich === 'string') {
            // 去注释去html属性
            this.content = rich.replace(/<([a-zA-Z1-6]+)\s*[^><]*>/g, '<$1>').replace(/<!--[\s\S]*?-->/g, '')
          } else {
            this.content = '--'
          }
          this.lazyRender(this.htmlParse())
        }, 20)
      },
      lazyRender(arr) {
        // 富文本可能过长导致在setData时因数据量过多而报错，因此将解析过的html数据等分10份进行渲染（仍不能排除报错可能）
        const part = Math.floor(arr.length / 10)
        Array.prototype.push.apply(this.contents, arr.splice(0, part))
        Array.prototype.push.apply(this.contents2, arr.splice(0, part))
        Array.prototype.push.apply(this.contents3, arr.splice(0, part))
        Array.prototype.push.apply(this.contents4, arr.splice(0, part))
        Array.prototype.push.apply(this.contents5, arr.splice(0, part))
        Array.prototype.push.apply(this.contents6, arr.splice(0, part))
        Array.prototype.push.apply(this.contents7, arr.splice(0, part))
        Array.prototype.push.apply(this.contents8, arr.splice(0, part))
        Array.prototype.push.apply(this.contents9, arr.splice(0, part))
        Array.prototype.push.apply(this.contents10, arr.splice(part))
      }
    },
    created() {
      this.handleRich(this.nodes)
      this.$watch('nodes', this.handleRich)
    }
  }
</script>
<style lang="scss">
  @import "../common/style/wxParse";
</style>
