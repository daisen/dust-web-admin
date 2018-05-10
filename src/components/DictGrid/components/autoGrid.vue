<template>
  <el-table border fit highlight-current-row style="width: 100%" :data='uiObj.rows' @current-change='handleCurrentChange' @cell-click='handleCellClick'>
    <el-table-column type="index" width="50">
    </el-table-column>
    <el-table-column :key='col.fieldName' v-for='col in uiObj.getColumns()' :label="col.dispName" >
      <template slot-scope="scope">
        {{scope.row.getColumnText(col.fieldName)}}
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
import UIObj from 'dict/UIObj'

export default {
  created() {
    this.initObj()
  },
  props: {
    objId: {
      type: String
    }
  },
  data() {
    return {
      uiObj: {}
    }
  },
  methods: {
    initObj() {
      this.uiObj = UIObj.getUIObj(this.objId)
    },
    handleCurrentChange(currentRow) {
      this.uiObj.setCurrentRow(currentRow)
    },
    handleCellClick(row, column) {

    }
  }
}
</script>

