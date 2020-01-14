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
  ButtonGroup,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Message
} from 'element-ui'

Vue.use(Input)
Vue.use(Popover)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Button)
Vue.use(ButtonGroup)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Icon)
Vue.use(Dialog)
Vue.use(DatePicker)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)

Vue.prototype.$notify = Notification
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$message = Message
