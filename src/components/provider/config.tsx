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
  common: {
    borderRadius: '10px',
  },
  Button: {
    textColor: '#F86',
  },
  Modal: {
    borderRadius: '10px',
  },
  Card: {
    borderRadius: '10px',
  },
}
