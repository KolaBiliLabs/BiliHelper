import type { DialogApiInjection } from 'naive-ui/es/dialog/src/DialogProvider'
import type { MessageApiInjection } from 'naive-ui/es/message/src/MessageProvider'
import type { NotificationApiInjection } from 'naive-ui/es/notification/src/NotificationProvider'

declare global {
  interface Window {
    $message: MessageApiInjection
    $dialog: DialogApiInjection
    $notification: NotificationApiInjection
  }
}
