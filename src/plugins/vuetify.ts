import { library } from '@fortawesome/fontawesome-svg-core'
import { faKey, faMobileAlt, faTrash } from '@fortawesome/pro-duotone-svg-icons'
import { faCircle, faDotCircle, faSquare } from '@fortawesome/pro-regular-svg-icons'
import { faCaretDown, faCheck, faCheckSquare, faChevronLeft, faChevronRight, faQuestion } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Vue from 'vue'
import Vuetify from 'vuetify'
import colors from 'vuetify/lib/util/colors'

Vue.component('font-awesome-icon', FontAwesomeIcon)
library.add(faKey, faMobileAlt, faTrash, faCaretDown, faCheck, faQuestion, faChevronLeft, faChevronRight, faSquare, faCheckSquare, faCircle, faDotCircle)

Vue.use(Vuetify)

const icon = (...args: string[]) => ({
  component: FontAwesomeIcon,
  props: {
    icon: args
  }
})

export default new Vuetify({
  theme: {
    dark: false,
    themes: {
      light: {
        primary: colors.teal.accent4,
        secondary: colors.grey.darken1,
        accent: colors.amber.darken2,
        error: colors.red.accent3
      }
    }
  },
  icons: {
    iconfont: 'faSvg',
    values: {
      info: icon('fas', 'question'),
      phone: icon('fad', 'mobile-alt'),
      key: icon('fad', 'key'),
      check: icon('fas', 'check'),
      sort: icon('fas', 'caret-down'),
      trash: icon('fad', 'trash')
    }
  }
})
