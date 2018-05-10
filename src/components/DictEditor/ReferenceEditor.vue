<template>
<div> 
  <el-input v-show="readOnly"  :placeholder="bindColumn.hint" v-model="text" suffix-icon="el-icon-search" v-on="$listeners" v-bind="$attrs"/>  
  <span v-show="!readOnly" class="el-checkbox__label">{{text}}</span>
</div>
</template>
<script>
import UIObj from 'dict/UIObj'

export default {
  name: 'reference-editor',
  created() {
    const uiObj = UIObj.getUIObj(this.objId)
    this.bindColumn = uiObj.getColumn(this.column)
    this.bindColumn.on('onPropertyChanged', (target, prop) => {
      this.readOnly = target.isReadOnly()
    })
    uiObj.on('onCurrentChanged', (target, args) => {
      this.bindRow = args.newRow
    })
    this.bindRow = uiObj.getRows()[this.row]
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
      bindRow: {}
    }
  },
  methods: {
    setReadOnly(readOnly) {
      this.readOnly = readOnly
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

