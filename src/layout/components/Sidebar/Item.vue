<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title } = context.props
    const vnodes = []

    if (icon) {
      const iconStr = `menu-icon iconfont ${icon}`
      // vnodes.push(<svg-icon icon-class={icon}/>) // svg图标
      vnodes.push(<i class={iconStr} />) // 字体图标
      //   const pngStr = `../../../../assets/images/role.png`
      //  vnodes.push(<img src={pngStr} width="10px" />) // 字体图标
          

    }

    if (title) {
      vnodes.push(<span class="left_side_title" slot='title'>{(title)}</span>)
    }
    return vnodes
  }
}
</script>
