"use client"

import type React from "react"

import { useState } from "react"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 1000000

type ToastActionElement = React.ReactElement<any, string | React.JSXElementConstructor<any>>

export type Toast = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  open: boolean
  duration?: number
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function generateId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: Omit<Toast, "id" | "open">
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<Omit<Toast, "id">> & { id: string }
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId: string
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId: string
    }

interface State {
  toasts: Toast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [...state.toasts, { id: generateId(), open: true, ...action.toast }].slice(-TOAST_LIMIT),
      }

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      }

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action

      // Cancel any existing timeout
      if (toastTimeouts.has(toastId)) {
        clearTimeout(toastTimeouts.get(toastId))
        toastTimeouts.delete(toastId)
      }

      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === toastId ? { ...t, open: false } : t)),
      }
    }

    case actionTypes.REMOVE_TOAST:
      if (toastTimeouts.has(action.toastId)) {
        clearTimeout(toastTimeouts.get(action.toastId))
        toastTimeouts.delete(action.toastId)
      }

      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }

    default:
      return state
  }
}

export function useToast() {
  const [state, setState] = useState<State>({ toasts: [] })

  const dispatch = (action: Action) => {
    setState((prevState) => reducer(prevState, action))
  }

  const toast = (props: Omit<Toast, "id" | "open">) => {
    const id = generateId()
    const newToast = { id, open: true, ...props }

    dispatch({ type: actionTypes.ADD_TOAST, toast: props })

    // Set timeout to dismiss toast
    if (newToast.duration !== Number.POSITIVE_INFINITY) {
      const timeout = setTimeout(() => {
        dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id })

        setTimeout(() => {
          dispatch({ type: actionTypes.REMOVE_TOAST, toastId: id })
        }, TOAST_REMOVE_DELAY)
      }, newToast.duration || 5000)

      toastTimeouts.set(id, timeout)
    }

    return id
  }

  const update = (id: string, props: Partial<Omit<Toast, "id">>) => {
    dispatch({ type: actionTypes.UPDATE_TOAST, toast: { ...props, id } })
  }

  const dismiss = (id: string) => {
    dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id })
  }

  return {
    toast,
    update,
    dismiss,
    toasts: state.toasts,
  }
}
