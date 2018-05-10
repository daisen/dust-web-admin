import { hasValue, ID_PROPERTY, eventuality } from './util'
import { default as Enums } from './enums'
import Dict from './index'

/**
 * 界面对象列
 */
class UIColumn {
  constructor(objId) {
    this.objId = objId
    this.isDataColumn = true
    this.isInit = false
    eventuality(this)
  }

  getUIObj() {
    return Dict.getUIObj(this.objId)
  }
  init(dictCol) {
    if (this.isInit) {
      return
    }

    const col = this
    // 数据相关
    col.fieldName = dictCol.fieldName
    col.dataRightCode = dictCol.dataRightCode
    col.dataRightType = dictCol.dataRightType
    col.defaultValue = dictCol.defaultValue
    col.paraValue = dictCol.defaultValue
    col.isEmptyField = dictCol.isEmptyField
    col.isQrySele = dictCol.isQrySele
    col.isStrictRef = dictCol.isStrictRef
    col.isCalc = dictCol.isCalc
    col.isRequired = dictCol.isRequired
    col.isEditLimit = dictCol.isEditLimit
    col.isEditable = dictCol.isEditable
    col.match = dictCol.match
    col.refObj = dictCol.refObj
    col.refField = dictCol.refField
    col.refFieldName = dictCol.refFieldName
    col.refSeparator = dictCol.refSeparator
    col.refType = dictCol.refType
    col.refEditWhere = dictCol.refEditWhere
    col.setRule = dictCol.setRule
    col.statType = dictCol.statType
    col.extParams = dictCol.extParams
    col.dataType = col.isCalc ? '1' : dictCol.dataType
    col.dataWidth = dictCol.dataWidth || 0
    col.dataDec = dictCol.dataDec || 0
    col.procParaType = dictCol.procParaType
    col.isPrimaryKey = dictCol.isPrimaryKey

    // 界面相关
    col.dispScale = dictCol.dispScale
    col.dispFormat = dictCol.dispFormat
    col.dispName = dictCol.dispName
    col.dispIndex = dictCol.dispIndex
    col.dispPosition = dictCol.dispPosition
    col.dispWidth = dictCol.dispWidth
    col.headerWidth = dictCol.headerWidth
    col.labelWidth = dictCol.labelWidth
    col.hint = dictCol.hint
    col.editStyle = dictCol.editStyle
    col.isZeroSpace = dictCol.isZeroSpace
    col.pageId = dictCol.pageId
    col.refCols = dictCol.refCols
    col.isReadonly = false // 是否只读列
    col.header = dictCol.header
  }
  onPropertyChanged(property) {
    this.fire('onPropertyChanged', property)
  }
  isReadonly() {
    return !this.isEditable || this.isReadonly
  }
  getText(row) {
    if (!row) return null

    const name = this.fieldName
    const value = row[name]
    const refValue = row[name + '$']

    if (hasValue(refValue)) {
      const sep = this.refSeparator || ''
      return value + sep + refValue
    } else {
      return hasValue(value) ? value.toString() : ''
    }
  }
  getValue(value) {
    // null或者undefined，则直接返回null
    if (value !== '' && !hasValue(value)) {
      return null
    }

    // 处理为字符串
    if (typeof value !== 'string') {
      value = value.toString()
    }

    value = value.trim()

    // 零空
    if (!this.isCalc && this.isZeroSpace && this.dataType === Enums.DataType.NUMBER) {
      return value || 0
    }

    // 处理分隔符
    if (this.refSeparator &&
      this.dataType !== Enums.DataType.NUMBER &&
      this.dataType !== Enums.DataType.DATETIME &&
      this.editStyle !== Enums.EditStyle.DATE) {
      const index = value.indexOf(this.refSeparator)
      if (index > -1) {
        value = value.slice(0, index)
      }
    }

    if (this.dataType === Enums.DataType.DATETIME && value && value.length <= 10) {
      value = value + ' 00:00:00'
    }

    return value
  }
  isTableRef() {
    return this.refType === Enums.RefType.TABLE || this.refType === Enums.RefType.PROP
  }
  isEnumRef() {
    return this.refType === Enums.RefType.ENUM
  }
  isNoneRef() {
    return this.refType === Enums.RefType.NONE
  }

  /**
     * 获取参照内容。枚举值获取的是数据，表参照获取的是行集合
     * @param {UIRow} row 数据行
     * @param {Boolean} ignoreValue 忽略当前value的约束
     * @return {*}     [description]
     *
     */
  loadRefData(row, value, ignoreValue, isEdit) {
    // 如果当前参照内容未发生改变，则不再重复获取数据
    // 只有在值处理时，才会需要跳过
    if (!ignoreValue && this.refField &&
      this.refItem &&
      this.refItem.$owner === row[ID_PROPERTY] &&
      this.getRefValue() === value) {
      return
    }
    this.getUIObj().loadDefaultRefData(row, this, value, ignoreValue, isEdit)
  }

  /**
     * 获取参照数据
     * @returns {*|Array}
     */
  getRefData() {
    return this.refData
  }

  /**
     * 设置参照数据
     * @param {null|Array} data
     */
  setRefData(data) {
    if (data) {
      this.refData = data
    } else {
      this.refData = []
    }
  }

  /**
     * 获取参照列表
     * @param {UIColumn} col
     * @return {[Array]}
     */
  getRefTableList() {
    const self = this
    const result = []

    if (self.refData && self.refField) {
      for (let i = 0; i < self.refData.length; i++) {
        const row = self.refData[i]
        let text = row[self.refField.toLowerCase()]
        const item = {
          key: text
        }
        if (self.refFieldName) {
          const sep = self.refSeparator || ''
          text = text + sep + row[self.refFieldName.toLowerCase()]
        }
        item.value = text
        result.push(item)
      }
    }
    return result
  }

  /**
     * 获取参照显示列表
     * @return Array [description]
     */
  getRefList() {
    const self = this

    // 枚举
    if (self.isEnumRef()) {
      return this.serialEnumValues(self.refData, self.refSeparator)
    }

    // 表参照
    if (self.isTableRef()) {
      return this.getRefTableList()
    }
    return []
  }

  serialEnumValues(data, refSeparator) {
    return data
  }

  /**
     * 获取当前参照信息
     * @returns {null|*}
     */
  getRefItem() {
    return this.refItem
  }

  /**
     * 设置参照信息
     * @param {null|*} item
     * @param {UIRow} [dr]
     */
  setRefItem(item, dr) {
    if (item) {
      this.refItem = item
      if (dr) {
        this.refItem.$owner = dr[ID_PROPERTY]
      }
    } else {
      this.refItem = null
    }
  }

  /**
     * 获取参照表的字典编码
     * @returns {String}
     */
  getRefObjCode() {
    if (this.refType === Enums.RefType.TABLE) {
      return this.refObj
    }

    if (this.refType === Enums.RefType.PROP) {
      const refObjCol = this.getUIObj().getColumn(this.refObj)
      if (refObjCol) {
        return refObjCol.getRefObjCode()
      }
    }
    return ''
  }

  /**
     * 展示弹出窗体
     * @param  {UIRow}   row
     * @param  {String}   text
     * @param  {Boolean}  isEdit
     * @param  {Function} callback
     * @return {*}
     */
  showDlg(dr, text, isEdit, callback) {
    const args = {
      dataSrc: this.getUIObj(),
      row: dr,
      col: this,
      text: text,
      refParam: this.getRefParam(dr, text, isEdit, true),
      isEdit: isEdit,
      callback: callback
    }

    return this.getUIObj().onUserRefDlg(args)
  }

  /**
     * 获取参照查询参数
     * @param  {UIRow} dr    [description]
     * @param  {Object} value [description]
     * @param {Boolean} isEdit
     * @param {Boolean} ignoreValue
     * @return {{fieldName: *, uiObjCode: *, refField: *, refFieldName: *, refType: *, refObj: *, userRefWhere, value: Object, D: *, ignoreValue: boolean}}       [description]
     */
  getRefParam(dr, value, isEdit, ignoreValue) {
    const self = this
    const refParam = {
      fieldName: self.fieldName,
      uiObjCode: self.getUIObj().uiObjCode,
      userRefWhere: self.getUIObj().onGetUserRefColumnWhere(dr, self, isEdit),
      value: value,
      D: isEdit ? dr.getData() : {},
      ignoreValue: !!ignoreValue
    }

    if (self.getUIObj()._parentRelation) {
      const masterRow = self.getUIObj()._parentRelation.master.currentRow
      refParam.M = masterRow ? masterRow.getData() : {}
    }

    return refParam
  }
}

export default UIColumn
