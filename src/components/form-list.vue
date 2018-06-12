<template>
  <div class="form-list" v-if="!href">
    <div class="form-list-label">
      <slot name="left"></slot>
    </div>
    <div class="form-list-right">
      <slot name="right"></slot>
    </div>
    <div class="form-list-icon">
      <span class="iconfont icon-arrow-right-copy-copy-copy"></span>
    </div>
  </div>
  <a class="form-list" :href="href" v-else>
    <div class="form-list-label">
      <slot name="left"></slot>
    </div>
    <div class="form-list-right">
      <slot name="right"></slot>
    </div>
    <div class="form-list-icon">
      <span class="iconfont icon-arrow-right-copy-copy-copy"></span>
    </div>
  </a>
</template>
<script>
  export default {
    name: 'form-list',
    props: {
      arrow: {
        type: Boolean,
        default: false
      },
      href: {
        type: String,
        default: ''
      }
    }
  }
</script>
