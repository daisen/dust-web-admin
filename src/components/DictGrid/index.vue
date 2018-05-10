<template>
  
</template>
<script>

const actions = {
  currentChanged: 'currentChanged',
  rowsChanged: 'rowsChanged',
  pageChanged: 'pageChanged',
  cellChanged: 'cellChanged',
  cellClick: 'cellClick',
  cellDbClick: 'cellDbClick',
  cellRightClick: 'cellRightClick',
  beforeCellEdit: 'beforeCellEdit',
  beforeNewRow: 'beforeNewRow',
  keyDown: 'keyDown',
  focused: 'focused'
}

export default {
  name: 'DictGrid',
  components: {},
  data() {
    return {
    }
  },
  props: {
    objId: {
      type: String
    },
    autoEdit: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: true
    },
    pageSize: {
      type: Number,
      default: -1
    },
    enableAddRow: {
      type: Boolean,
      default: true
    }
  }

}
</script>

