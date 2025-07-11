import { ref, onMounted, onUnmounted } from 'vue'

const mobileBreakpoint = 768
const tinyBreakpoint = 400

export function useScreenSize() {
  const isMobile = ref(window.innerWidth <= mobileBreakpoint)
  const isTinyScreen = ref(window.innerWidth < tinyBreakpoint)

  const updateSize = () => {
    isMobile.value = window.innerWidth <= mobileBreakpoint
    isTinyScreen.value = window.innerWidth < tinyBreakpoint
  }

  onMounted(() => {
    updateSize()
    window.addEventListener('resize', updateSize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateSize)
  })

  return {
    isMobile,
    isTinyScreen,
  }
}
