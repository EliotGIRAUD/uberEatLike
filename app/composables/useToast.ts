import { ref } from 'vue'

export interface Toast {
  id: number
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message: string
  timeout?: number
}

const toasts = ref<Toast[]>([])
let nextId = 1

export const useToast = () => {
  const show = (toast: Omit<Toast, 'id'>) => {
    const id = nextId++
    const newToast: Toast = { ...toast, id }
    toasts.value.push(newToast)

    if (toast.timeout !== 0) {
      setTimeout(() => {
        remove(id)
      }, toast.timeout || 3000)
    }
  }

  const remove = (id: number) => {
    const index = toasts.value.findIndex((t) => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  const success = (options: { title: string; message: string; timeout?: number }) => {
    show({ type: 'success', ...options })
  }

  const error = (options: { title: string; message: string; timeout?: number }) => {
    show({ type: 'error', ...options })
  }

  const info = (options: { title: string; message: string; timeout?: number }) => {
    show({ type: 'info', ...options })
  }

  const warning = (options: { title: string; message: string; timeout?: number }) => {
    show({ type: 'warning', ...options })
  }

  return {
    toasts,
    success,
    error,
    info,
    warning,
    remove,
  }
}

