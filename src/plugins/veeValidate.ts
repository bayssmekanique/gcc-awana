import { extend } from 'vee-validate'
import { email, oneOf, regex, required } from 'vee-validate/dist/rules'

extend('email', {
  ...email,
  message: 'Must be a valid email'
})

extend('regex', {
  ...regex,
  message: '{_field_} is not complete'
})

extend('oneOf', {
  ...oneOf,
  message: '{_field_} is not complete'
})

extend('required', {
  ...required,
  message: '{_field_} is required'
})
