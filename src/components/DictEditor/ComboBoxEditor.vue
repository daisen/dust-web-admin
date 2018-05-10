<template>
<div>    
  <el-select v-show="readOnly" :placeholder="bindColumn.hint"  v-model="text" @visible-change="handleVisibleChange" v-on="$listeners" v-bind="$attrs">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value">
    </el-option>
  </el-select>
  <span v-show="!readOnly" class="el-checkbox__label">{{text}}</span>
</div>
</template>
<script>
import UIObj from 'dict/UIObj'

export default {
  name: 'combo-box-editor',
  created() {
    const uiObj = UIObj.getUIObj(this.objId)
    this.bindColumn = uiObj.getColumn(this.column)
    this.bindRow = uiObj.getRows()[this.row]

    this.bindColumn.on('onPropertyChanged', (target, prop) => {
      this.readOnly = target.isReadOnly()
    })
    uiObj.on('onCurrentChanged', (target, args) => {
      this.bindRow = args.newRow
      this.options = this.bingColumn
    })
  },
  props: {
    objId: {
      type: String
    },
    column: {
      type: String
    },
    row: Number
  },
  data() {
    return {
      readOnly: true,
      editable: false,
      bindColumn: {},
      bindRow: {},
      options: []
    }
  },
  methods: {
    setReadOnly(readOnly) {
      this.readOnly = readOnly
    },
    handleVisibleChange(val) {
      if (val) {
        this.bindColumn.loadRefData(this.bindRow)
        this.options = this.bindColumn.getRefList()
      }
    }
  },
  computed: {
    text: {
      get: function() {
        return this.bindColumn.getText(this.bindRow)
      },
      set: function(newValue) {
        if (this.bindRow.validator) {
          this.bindRow.validator(this.bindColumn, newValue)
        }
      }
    }
  }
}
</script>

