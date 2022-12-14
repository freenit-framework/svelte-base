import { get, writable } from 'svelte/store'
import methods from '$lib/methods'
import store from '.'

const defaults = {
  access: new Date(),
  refresh: new Date(),
}

export default class AuthStore {
  store = writable(defaults)
  prefix = ''
  set = this.store.set
  update = this.store.update
  subscribe = this.store.subscribe

  constructor(prefix: string) {
    this.prefix = prefix
  }

  async login(email: string, password: string) {
    const response = await methods.post(`${this.prefix}/auth/login`, {
      email,
      password,
    })
    if (response.ok) {
      const data = await response.json()
      const access = new Date()
      access.setSeconds(access.getSeconds() + data.expire.access)
      const refresh = new Date()
      refresh.setSeconds(refresh.getSeconds() + data.expire.refresh)
      this.set({ access, refresh })
      store().user.profile.set(data.user)
      return { ...data, ok: true }
    }
    return response
  }

  async register(email: string, password: string) {
    const response = await methods.post(`${this.prefix}/auth/register`, {
      email,
      password,
    })
    if (response.ok) {
      const data = await response.json()
      return { ...data, ok: true }
    }
    return response
  }

  async verify(verification: string) {
    const response = await methods.post(`${this.prefix}/auth/verify`, {
      verification,
    })
    if (response.ok) {
      const data = await response.json()
      return { ...data, ok: true }
    }
    return response
  }

  async refresh() {
    const now = new Date()
    const mystore = get(this.store)
    if (now > mystore.access) {
      const response = await methods.post(`${this.prefix}/auth/refresh`, {})
      if (response.ok) {
        const data = await response.json()
        const access = new Date()
        access.setSeconds(access.getSeconds() + data.expire.access)
        const refresh = new Date()
        refresh.setSeconds(refresh.getSeconds() + data.expire.refresh)
        this.set({ access, refresh })
        store().user.profile.set(data.user)
        return { ...data, ok: true }
      }
    }
  }
}
