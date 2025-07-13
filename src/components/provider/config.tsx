import type { GlobalThemeOverrides } from 'naive-ui'
import { useDialog, useMessage, useNotification } from 'naive-ui'
import { defineComponent } from 'vue'

export const NaiveContentProvider = defineComponent({
  setup() {
    window.$message = useMessage()
    window.$dialog = useDialog()
    window.$notification = useNotification()

    return () => <div class="main-tools"></div>
  },
})

// 全局主题配置
export const themeOverrides: GlobalThemeOverrides = {
  common: {},
  Button: {
    textColor: '#F86',
  },
  Dropdown: {
    borderRadius: '10px',
  },
  Modal: {
    borderRadius: '10px',
  },
}
