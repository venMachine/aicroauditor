import { defineStore } from 'pinia'
import axios from 'axios'

export const useStore = defineStore('main', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: null,
    audits: []
  }),

  actions: {
    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    },

    clearToken() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    },

    async fetchProfile() {
      if (!this.token) return
      try {
        const res = await axios.get('/api/auth/profile')
        this.user = res.data
        return res.data
      } catch (error) {
        console.error('fetchProfile error:', error)
        this.clearToken()
        throw error
      }
    },

    async fetchAudits() {
      if (!this.token) return
      try {
        const res = await axios.get('/api/audit')
        this.audits = res.data
        return res.data
      } catch (error) {
        console.error('fetchAudits error:', error)
        throw error
      }
    }
  }
})