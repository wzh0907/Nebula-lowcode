<template>
    <div style="display: inline-block;">
        <a-popover placement="right" width="300" transfer>
            <!-- <a-button size="small" style="font-size: 12px;">显示设置</a-button> -->
            <a-button icon="setting" size="small" title="显示设置" />
            <div class="content" slot="content" v-if="isReload">
                <div class="title">
                    <span>显示设置（拖动排序）</span>
                    <a @click="onReset" style="user-select: none; margin-left: 20px;">重置</a>
                </div>

                <draggable tag="ul" class="content-list" v-model="columnList" :options="draggableOptions" @start="onDragMoveStart" @end="onDragMoveEnd">
                    <li class="content-list-item" v-for="(item, key) in columnList" :key="key" v-show="item.title && item.slot !== 'action'">
                        <a-checkbox v-model="item._isChecked" :label="item.title" @change="onClickBox($event, item, key)" :disabled="item._noCancel">
                            {{ item.title }}
                        </a-checkbox>
                    </li>
                </draggable>
            </div>
        </a-popover>
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import { deepClone } from './deep-clone.js'
import { completeColumnsRender } from './main.js'

const _localVersion = '_v1.0.0_'
export default {
    name: 'CustomColumns',
    components: {
        draggable
    },
    props: {
        type: {
            type: String,
            default: ''
        },
        columnsReference: {
            type: Array,
            default: () => []
        },
        columnByKeyMap: {
            type: Object,
            default: () => {
                return {}
            }
        }
    },
    data () {
        return {
            isReload: true,
            columnList: [],
            columnListBackups: [],
            // draggable配置参数参考 https://www.cnblogs.com/weixin186/p/10108679.html
            draggableOptions: {
                ghostClass: 'ghost'
                // 不使用H5原生的配置
                // forceFallback: true
            }
        }
    },
    watch: {
        columnsReference: {
            immediate: true,
            deep: true,
            handler(val) {
                this.columnList = deepClone({ obj: this.columnsReference }).obj
                this.columnList.forEach(item => {
                    item._isChecked === undefined && this.$set(item, '_isChecked', true)
                })
                this.columnListBackups = deepClone({ obj: this.columnList }).obj
            }
        }
    },
    created () {
        // this.columnList = deepClone({ obj: this.columnsReference }).obj
        // this.columnList.forEach(item => {
        //     this.$set(item, '_isChecked', true)
        // })
        // this.columnListBackups = deepClone({ obj: this.columnList }).obj

        // this._getLocal()
    },
    methods: {
        onDragMoveStart (e) { },
        onDragMoveEnd (e) {
            this._reloadColumns()
        },
        onClickBox (isChecked, columnItem, columnIndex) {
            if (columnItem._noCancel) return false;
            this._reloadColumns()
        },
        onReset () {
            this.columnList = deepClone({ obj: this.columnListBackups }).obj
            this.isReload = false
            this.$nextTick(() => {
                this.isReload = true
            })
            // console.log('----------------->', this.columnList, JSON.stringify(this.columnList))
            this.$emit('onResetColumns')
            this._saveLocal()
        },
        _reloadColumns () {
            // 重新渲染Columns（why：不重新渲染页面会报错）
            setTimeout(() => {
                this._saveLocal()
                this.$emit('onReloadColumns', JSON.stringify(this.columnList))
            })
        },
        _saveLocal () {
            localStorage.setItem(`${_localVersion}${this.type}_columnsList`, JSON.stringify(this.columnList))
        },
        // _getLocal () {
        //     const columnListStr = localStorage.getItem(`${_localVersion}${this.type}_columnsList`)
        //     if (columnListStr) {
        //         const _dataList = JSON.parse(columnListStr)
        //         let fullColumns = completeColumnsRender(_dataList, this.columnByKeyMap)
        //         this.columnList = JSON.parse(JSON.stringify(fullColumns))
        //         this.$emit('onLoadLocalColumns', fullColumns)
        //     }
        // }
    }
}
</script>

<style lang="less" scoped>
.ghost {
    visibility: hidden;
}
.content {
    user-select: none;
    &-list {
        padding-top: 20px;
        &-item {
            margin-bottom: 10px;
            padding-left: 5px;
            cursor: pointer;
            &:hover {
                background-color: #ebf7ff;
            }
        }
    }
}
</style>
