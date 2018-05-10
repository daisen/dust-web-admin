export const ID_PROPERTY = '$id'
export const ROW_SELECT_COLNAME = '$is_sel'
export const hasValue = (o) => {
  if (o !== 0 && !o) {
    return false
  }
  return true
}

export const format = (msg, ...args) => {
  if (args.length === 1) {
    return msg
  } else if (args.length > 1) {
    return msg.replace(/\{(\d+)\}/g, function(m, i) {
      return args[parseInt(i) + 1]
    })
  }
}

export const toStrLines = arr => {
  const msgs = []
  for (let i = 0, len = arr.length; i < len; i++) {
    const elem = arr[i]
    if (msgs.indexOf(elem) === -1) {
      msgs.push(elem)
    }
  }
  return arr.join('<br>').replace(/\n/g, '<br>')
}

/**
 * 序列化对象
 * @param {UIObj} uiObj
 * @param {Boolean} onlyCur
 */
export const serialize = (uiObj, onlyCur) => {
  const data = {
    uiObjCode: uiObj.uiObjCode,
    uiObjName: uiObj.uiObjName,
    isMaster: uiObj.isMaster,
    fieldList: [],
    forPrint: []
  }

  for (let i = 0; i < uiObj.columns.length; i++) {
    const col = uiObj.columns[i]
    data.fieldList.push({
      fieldName: col.fieldName,
      fieldDes: col.dispName,
      dataType: col.dataType,
      dataWidth: col.dataWidth,
      dataDec: col.dataDec
    })
  }

  if (onlyCur) {
    if (uiObj.currentRow) {
      data.forPrint.push(uiObj.currentRow.getData())
    }
  } else {
    for (let k = 0; k < uiObj.rows.length; k++) {
      const row = uiObj.rows[k]
      data.forPrint.push(row.getData())
    }
  }

  return data
}

/**
   * 获取字符串字节长度
   * @param str
   * @returns {number}
   */
export const getLength = (str) => {
  if (str === null || str === undefined) return 0
  const [...arr] = str
  return arr.length
}

export const getScaleLength = (str) => {
  if (!str) {
    return 0
  }

  const dotIndex = str.indexOf('.')
  const len = str.length
  return dotIndex > 0 ? len - dotIndex - 1 : 0
}

export const getIntegerLength = (str) => {
  if (!str) {
    return 0
  }

  const dotIndex = str.indexOf('.')
  const len = str.length
  return dotIndex > 0 ? dotIndex : len
}

export const Convert = {
  toString: function(obj) {
    if (!obj && obj !== 0) {
      return ''
    }
    return obj.toString()
  },
  toDate: function(obj) {
    if (!obj && obj !== 0) {
      return null
    }

    var value = Date.parse(obj)
    return isNaN(value) ? null : new Date(value)
  },
  toInt: function(obj) {
    if (!obj && obj !== 0) {
      return 0
    }
    var value = parseInt(obj)
    return isNaN(value) ? 0 : value
  },
  toFloat: function(obj) {
    if (!obj && obj !== 0) {
      return 0.0
    }

    var value = parseFloat(obj)
    return isNaN(value) ? 0 : value
  },
  eventuality: function(self) {
    var registry = {}
    self.fire = function(event, args) {
      const type = typeof event === 'string' ? event : event.type

      if (registry.hasOwnProperty(type)) {
        const array = registry[type]
        for (const i = 0; i < array.length; i++) {
          const handler = array[i]
          let func = handler.method
          if (typeof func === 'string') {
            func = this[func]
          }

          func.apply(this, args ? [self, args] : [self, {}])
        }
      }

      return this
    }

    self.on = function(type, method) {
      const handler = {
        method: method
      }

      if (registry.hasOwnProperty(type)) {
        registry[type].push(handler)
      } else {
        registry[type] = [handler]
      }
      return this
    }

    self.un = function(type, method) {
      let array
      let index = -1
      if (registry.hasOwnProperty(type)) {
        array = registry[type]
        for (var i = 0; i < array.length; i++) {
          const handler = array[i]
          let func = handler.method
          if (typeof func === 'string') {
            func = this[func]
          }

          if (func === method) {
            index = i
            break
          }
        }

        if (index >= 0) {
          array.splice(index, 1)
        }
      }
    }

    self.dispose = function() {
      registry = null
      delete self.on
      delete self.un
      delete self.fire
    }

    return self
  }
}
