<template>
    <div class="flow-menu" ref="tool">
        <!-- <div v-for="menu  in  menuList" :key="menu.id">
            <span class="ef-node-pmenu" @click="menu.open = !menu.open"><i :class="{'el-icon-caret-bottom': menu.open,'el-icon-caret-right': !menu.open}"></i>&nbsp;{{menu.name}}</span>
            <ul v-show="menu.open" class="ef-node-menu-ul">
                <draggable @end="end" @start="move" v-model="menu.children" :options="draggableOptions">
                    <li v-for="subMenu in menu.children" class="ef-node-menu-li" :key="subMenu.id" :type="subMenu.type">
                        <i :class="subMenu.ico"></i> {{subMenu.name}}
                    </li>
                </draggable>
            </ul>
        </div> -->
        <ul class="ef-node-menu-ul" style="text-align: center;">
            <draggable @end="end" @start="move" v-model="menuList" :options="draggableOptions">
                <li style="display: inline-block;" v-for="subMenu in menuList" class="ef-node-menu-li" :key="subMenu.id" :type="subMenu.type">
                    <i :class="subMenu.ico"></i> {{subMenu.name}}
                </li>

            </draggable>
        </ul>
    </div>
</template>
<script>
    import draggable from 'vuedraggable'

    var mousePosition = {
        left: -1,
        top: -1
    }

    export default {
        data() {
            return {
                activeNames: '1',
                // draggable配置参数参考 https://www.cnblogs.com/weixin186/p/10108679.html
                draggableOptions: {
                    preventOnFilter: false,
                    sort: false,
                    disabled: false,
                    ghostClass: 'tt',
                    // 不使用H5原生的配置
                    forceFallback: true,
                    // 拖拽的时候样式
                    // fallbackClass: 'flow-node-draggable'
                },
                // 默认打开的左侧菜单的id
                menuList: [
                     {
                        id: 'event-operate-refresh',
                        type: 'event-operate-refresh',
                        name: '数据刷新',
                        ico: 'el-icon-video-play',
                        actionItem: {}
                    },{
                        id: 'event-operate-href',
                        type: 'event-operate-href',
                        name: '页面跳转',
                        ico: 'el-icon-video-play',
                        actionItem: {}
                    },{
                        id: 'event-operate-back',
                        type: 'event-operate-back',
                        name: '页面返回',
                        ico: 'el-icon-video-play',
                        actionItem: {}
                    },{
                        id: 'event-operate-close-page',
                        type: 'event-operate-close-page',
                        name: '关闭传值',
                        ico: 'el-icon-video-play',
                        actionItem: {}
                    }, {
                        id: 'event-operate-dialog-box',
                        type: 'event-operate-dialog-box',
                        name: '弹出层',
                        ico: 'el-icon-video-play',
                        actionItem: {}
                    }, {
                        id: 'event-operate-close-dialog',
                        type: 'event-operate-close-dialog',
                        name: '关闭弹窗',
                        ico: 'el-icon-video-play',
                        actionItem: {}
                    },{
                        id: 'event-operate-logic-judgment',
                        type: 'event-operate-logic-judgment',
                        name: '条件判定',
                        ico: 'el-icon-video-play',
                        actionItem: {} // 这里的对象不会实际引用
                    }, {
                        id: 'event-operate-interface',
                        type: 'event-operate-interface',
                        name: '接口调用',
                        ico: 'el-icon-video-play',
                        actionItem: {}
                    }, {
                        id: 'event-operate-display',
                        type: 'event-operate-display',
                        name: '隐藏/显示',
                        ico: 'el-icon-video-play',
                        actionItem: {}
                    },
                  // {
                  //       id: 'event-operate-form-submit',
                  //       type: 'event-operate-form-submit',
                  //       name: '表单提交',
                  //       ico: 'el-icon-video-play',
                  //       actionItem: {}
                  //   },
                  {
                        id: 'event-operate-set',
                        type: 'event-operate-set',
                        name: '组件设值',
                        ico: 'el-icon-video-play',
                        actionItem: {}
                    },
                     {
                        id: 'event-operate-dialog-box-msg',
                        type: 'event-operate-dialog-box-msg',
                        name: '提示框',
                        ico: 'el-icon-video-play',
                        actionItem: {}
                    }, {
                        id: 'event-operate-dialog-box-confirm',
                        type: 'event-operate-dialog-box-confirm',
                        name: '确认框',
                        ico: 'el-icon-video-play',
                        actionItem: {}
                    }, {
                        id: 'event-operate-form-validate',
                        type: 'event-operate-form-validate',
                        name: '表单校验',
                        ico: 'el-icon-video-play',
                        actionItem: {}
                    }, {
                        id: 'event-operate-make-phone-call',
                        type: 'event-operate-make-phone-call',
                        name: '拨打电话',
                        ico: 'el-icon-video-play',
                        actionItem: {}
                    }, {
                        id: 'event-operate-main-menu-href',
                        type: 'event-operate-main-menu-href',
                        name: '主页跳转',
                        ico: 'el-icon-video-play',
                        actionItem: {
                            paramUser:{},
                            paramToken:{},
                            paramAuth:{}
                        }
                    }
                ],
                // defaultOpeneds: ['1', '2'],
                // menuList: [
                //     {
                //         id: '1',
                //         type: 'group',
                //         name: '开始节点',
                //         ico: 'el-icon-video-play',
                //         open: true,
                //         children: [
                //             {
                //                 id: '11',
                //                 type: 'timer',
                //                 name: '数据接入',
                //                 ico: 'el-icon-time',
                //                 // 自定义覆盖样式
                //                 style: {}
                //             }, {
                //                 id: '12',
                //                 type: 'task',
                //                 name: '接口调用',
                //                 ico: 'el-icon-odometer',
                //                 // 自定义覆盖样式
                //                 style: {}
                //             }
                //         ]
                //     },
                //     {
                //         id: '2',
                //         type: 'group',
                //         name: '结束节点',
                //         ico: 'el-icon-video-pause',
                //         open: true,
                //         children: [
                //             {
                //                 id: '21',
                //                 type: 'end',
                //                 name: '流程结束',
                //                 ico: 'el-icon-caret-right',
                //                 // 自定义覆盖样式
                //                 style: {}
                //             }, {
                //                 id: '22',
                //                 type: 'over',
                //                 name: '数据清理',
                //                 ico: 'el-icon-shopping-cart-full',
                //                 // 自定义覆盖样式
                //                 style: {}
                //             }
                //         ]
                //     }
                // ],
                nodeMenu: {}
            }
        },
        components: {
            draggable
        },
        created() {
            /**
             * 以下是为了解决在火狐浏览器上推拽时弹出tab页到搜索问题
             * @param event
             */
            if (this.isFirefox()) {
                document.body.ondrop = function (event) {
                    // 解决火狐浏览器无法获取鼠标拖拽结束的坐标问题
                    mousePosition.left = event.layerX
                    mousePosition.top = event.clientY - 50
                    event.preventDefault();
                    event.stopPropagation();
                }
            }
        },
        methods: {
            // 根据类型获取左侧菜单对象
            getMenuByType(type) {
                // for (let i = 0; i < this.menuList.length; i++) {
                //     let children = this.menuList[i].children;
                //     for (let j = 0; j < children.length; j++) {
                //         if (children[j].type === type) {
                //             return children[j]
                //         }
                //     }
                // }
                for (let j = 0; j < this.menuList.length; j++) {
                    if (this.menuList[j].type === type) {
                        return this.menuList[j]
                    }
                }
            },
            // 拖拽开始时触发
            move(evt, a, b, c) {
                var type = evt.item.attributes.type.nodeValue
                this.nodeMenu = this.getMenuByType(type)
            },
            // 拖拽结束时触发
            end(evt, e) {
                this.$emit('addNode', evt, this.nodeMenu, mousePosition)
            },
            // 是否是火狐浏览器
            isFirefox() {
                var userAgent = navigator.userAgent
                if (userAgent.indexOf("Firefox") > -1) {
                    return true
                }
                return false
            }
        }
    }
</script>
<style scoped>
.lingxing {
    width: 90px;
    /* width: 40px;
    height: 40px;
    background-color: #ccc;
    -moz-transform:rotate(45deg);
    -webkit-transform:rotate(45deg);
    -o-transform:rotate(45deg);
    transform:rotate(45deg); */
}
.lingxing span {
    /* font-size: 12px;
    transform: rotate(-45deg);
    position: absolute;
    bottom: 10px;
    left: 7px; */
}
</style>
