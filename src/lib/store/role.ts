import { writable } from 'svelte/store'
import methods from '$lib/methods'
import store from '.'

const defaults = {
  list: {
    data: [],
    page: 0,
    total: 0,
  },

  detail: { id: 0, name: '', users: [] },
}

export class RoleListStore {
  store = writable(defaults.list)
  prefix = ''
  set = this.store.set
  update = this.store.update
  subscribe = this.store.subscribe

  constructor(prefix: string) {
    this.prefix = prefix
  }

  async fetch(page = 1, perpage = 10) {
    await store().auth.refresh()
    const response = await methods.get(`${this.prefix}/roles`, {
      page,
      perpage,
    })
    if (response.ok) {
      const data = await response.json()
      this.set(data)
      return { ...data, ok: true }
    }
    return response
  }

  async create(fields: any) {
    await store().auth.refresh()
    const response = await methods.post(`${this.prefix}/roles`, fields)
    if (response.ok) {
      const data = await response.json()
      return { ...data, ok: true }
    }
    return response
  }
}

export class RoleDetailStore {
  store = writable(defaults.detail)
  prefix = ''
  set = this.store.set
  update = this.store.update
  subscribe = this.store.subscribe

  constructor(prefix: string) {
    this.prefix = prefix
  }

  async fetch(id: number | string) {
    await store().auth.refresh()
    const response = await methods.get(`${this.prefix}/roles/${id}`)
    if (response.ok) {
      const data = await response.json()
      this.set(data)
      return { ...data, ok: true }
    }
    return response
  }

  async edit(id: number | string, fields: any) {
    await store().auth.refresh()
    const response = await methods.patch(`${this.prefix}/roles/${id}`, fields)
    if (response.ok) {
      const data = await response.json()
      this.set(data)
      return { ...data, ok: true }
    }
    return response
  }

  async destroy(id: number | string) {
    await store().auth.refresh()
    const response = await methods.delete(`${this.prefix}/roles/${id}`)
    if (response.ok) {
      const data = await response.json()
      this.set(data)
      return { ...data, ok: true }
    }
    return response
  }

  async assign(role_id: number | string, user_id: number | string) {
    await store().auth.refresh()
    const response = await methods.post(`${this.prefix}/roles/${role_id}/${user_id}`, {})
    if (response.ok) {
      const data = await response.json()
      return { ...data, ok: true }
    }
    return response
  }

  async deassign(role_id: number | string, user_id: number | string) {
    await store().auth.refresh()
    const response = await methods.delete(`${this.prefix}/roles/${role_id}/${user_id}`)
    if (response.ok) {
      const data = await response.json()
      return { ...data, ok: true }
    }
    return response
  }
}

export default function RoleStore(prefix: string) {
  return {
    list: new RoleListStore(prefix),
    detail: new RoleDetailStore(prefix),
  }
}
