import { writable } from 'svelte/store'

export default function (name, initial_value) {
  if (!process.browser) {
    return writable(initial_value)
  }

  const stored_value = localStorage.getItem(name)
  const store = writable(stored_value ? JSON.parse(stored_value) : initial_value)

  store.subscribe(value => {
    localStorage.setItem(name, JSON.stringify(value))
  })

  window.addEventListener('storage', e => {
    if (e.key === name && e.storageArea === localStorage) {
      store.set(JSON.parse(e.newValue))
    }
  })

  return store
}
