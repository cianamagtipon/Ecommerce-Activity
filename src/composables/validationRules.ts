import { luzonLocations } from '@/assets/data/luzonLocations'
import type { LuzonLocations } from '@/assets/data/luzonLocations'
import type { FormRules, FormItemRule } from 'element-plus'

const typedLocations: LuzonLocations = luzonLocations

export function useValidationRules() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const postalCodeRegex = /^\d{4}$/
  const nameRegex = /^[A-Za-z\s]{2,}$/
  const phoneRegex = /^09\d{9}$/
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/

  const required: FormItemRule = {
    required: true,
    message: 'This field is required',
    trigger: 'blur',
  }

  const requiredSelect: FormItemRule = {
    required: true,
    message: 'This field is required',
    trigger: 'change',
  }

  const nameRule: FormItemRule[] = [
    { ...required },
    {
      pattern: nameRegex,
      message: 'Must be at least 2 characters with only letters and spaces',
      trigger: 'blur',
    },
  ]

  const emailRule: FormItemRule[] = [
    { ...required },
    {
      pattern: emailRegex,
      message: 'Email must be valid (e.g., user@example.com)',
      trigger: 'blur',
    },
  ]

  const passwordRule: FormItemRule[] = [
    { ...required },
    {
      pattern: passwordRegex,
      message: 'Password must be at least 8 characters and include a number',
      trigger: 'blur',
    },
  ]

  const passwordMatch = (getPassword: () => string): FormItemRule => ({
    validator: (_rule, value, callback) => {
      if (!value) {
        callback(new Error('Please confirm your password'))
      } else if (value !== getPassword()) {
        callback(new Error("Passwords don't match"))
      } else {
        callback()
      }
    },
    trigger: 'blur',
  })

  const optionalPattern = (pattern: RegExp, message: string): FormItemRule => ({
    validator: (_rule, value, callback) => {
      if (!value || value === '') {
        callback()
      } else if (!pattern.test(value)) {
        callback(new Error(message))
      } else {
        callback()
      }
    },
    trigger: 'blur',
  })

  const phoneRule: FormItemRule[] = [
    optionalPattern(phoneRegex, 'Phone must start with 09 and be 11 digits'),
  ]

  const provinceRule: FormItemRule[] = []
  const cityRule: FormItemRule[] = []
  const homeRule: FormItemRule[] = []

  const postalCodeRule = (
    getProvince: () => string,
    getCity: () => string,
  ): FormItemRule[] => [
    {
      validator: (_rule, value, callback) => {
        const province = getProvince()
        const city = getCity()

        if (!value || value === '') {
          return callback()
        }

        if (!postalCodeRegex.test(value)) {
          return callback(new Error('Postal code must be 4 digits'))
        }

        const cityList = typedLocations[province]
        const cityEntry = cityList?.find((entry) => entry.city === city)

        if (!cityEntry) {
          return callback(new Error('Invalid province or city selected'))
        }

        const validZips = cityEntry.zipPrefixes
        if (!validZips.includes(value)) {
          return callback(
            new Error(`ZIP code does not match ${city}, ${province}`),
          )
        }

        callback()
      },
      trigger: ['change', 'blur'],
    },
  ]

  const rules: FormRules = {
    name: nameRule,
    email: emailRule,
    password: passwordRule,
    phone: phoneRule,
    'address.province': provinceRule,
    'address.city': cityRule,
    'address.home': homeRule,
  }

  return {
    rules,
    required,
    requiredSelect,
    nameRule,
    emailRule,
    passwordRule,
    passwordMatch,
    phoneRule,
    provinceRule,
    cityRule,
    homeRule,
    postalCodeRule,
  }
}
