import Vue from 'vue'

import {
  Input,
  Form,
  FormItem,
  Icon,
  Dialog,
  Popover,
  Collapse,
  CollapseItem,
  MessageBox,
  Notification,
  DatePicker,
  Button,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Drawer
} from 'element-ui'

Vue.use(Input)
Vue.use(Popover)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Button)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Icon)
Vue.use(Dialog)
Vue.use(DatePicker)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Drawer)

Vue.prototype.$notify = Notification
Vue.prototype.$prompt = MessageBox.prompt
