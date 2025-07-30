import form from 'element-plus/es/components/form/index.mjs'

export function useFormatter() {
  function cleanSpaces(value: string): string {
    return value.replace(/\s+/g, ' ').trim()
  }

  function removeAllSpaces(value: string): string {
    return value.replace(/\s+/g, '')
  }

  function formatPhone(value: string): string {
    return value.replace(/[^\d]/g, '')
  }

  function formatEmail(value: string): string {
    return value.trim().toLowerCase()
  }

  function formatForm<T extends Record<string, any>>(form: T): T {
    const result: any = { ...form }

    for (const key in result) {
      if (typeof result[key] === 'string') {
        result[key] = cleanSpaces(result[key])
      } else if (typeof result[key] === 'object' && result[key] !== null) {
        result[key] = formatForm(result[key])
      }
    }

    if (result.email) result.email = formatEmail(result.email)
    if (result.phone) result.phone = formatPhone(result.phone)

    return result
  }

  function blurFormatField(fieldKey: string) {
    return () => {
      const segments = fieldKey.split('.')
      let current: any = form.value
      for (let i = 0; i < segments.length - 1; i++) {
        if (current[segments[i]]) {
          current = current[segments[i]]
        }
      }
      const finalKey = segments[segments.length - 1]
      const val = current[finalKey]
      if (typeof val === 'string') {
        if (fieldKey === 'email') current[finalKey] = formatEmail(val)
        else if (fieldKey === 'phone') current[finalKey] = formatPhone(val)
        else if (fieldKey === 'address.postalCode')
          current[finalKey] = removeAllSpaces(val)
        else current[finalKey] = cleanSpaces(val)
      }
    }
  }

  return {
    cleanSpaces,
    removeAllSpaces,
    formatPhone,
    formatEmail,
    formatForm,
    blurFormatField,
  }
}
