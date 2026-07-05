import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const STORAGE_KEY = 'ojen-auth-demo-v1'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(localStorage.getItem(STORAGE_KEY) === '1')

  watch(isLoggedIn, (value) => {
    localStorage.setItem(STORAGE_KEY, value ? '1' : '0')
  })

  function login() {
    isLoggedIn.value = true
  }

  function logout() {
    isLoggedIn.value = false
  }

  return { isLoggedIn, login, logout }
})
