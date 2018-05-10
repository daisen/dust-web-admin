<template>
<div> 
  <a :href="text"></a>
   <router-link :to="path || '#'">{{text}}</router-link>
</div>
</template>
<script>
import UIObj from 'dict/UIObj'

export default {
  name: 'link-editor',
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
      bindRow: {},
      path: '#'
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
    },
    path: function() {
      this.bindColumn.fire('onGetLink', {
        col: this.bindColumn,
        row: this.bindRow
      })

      return this.bindColumn.getLinkPath()
    }
  }
}
</script>

