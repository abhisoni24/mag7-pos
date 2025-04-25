import * as React from "react";
import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

/**
 * @constant TOAST_LIMIT
 * @description Maximum number of toasts that can be displayed simultaneously
 */
const TOAST_LIMIT = 1;

/**
 * @constant TOAST_REMOVE_DELAY
 * @description Delay in milliseconds before removing a toast from the DOM
 */
const TOAST_REMOVE_DELAY = 1000000;

/**
 * @type ToasterToast
 * @description Extended type for toast properties including id and optional elements
 */
type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

/**
 * @constant actionTypes
 * @description Available action types for toast state management
 */
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

/**
 * @function genId
 * @description Generates a unique ID for each toast
 * @returns {string} A unique identifier
 */
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof actionTypes;

/**
 * @type Action
 * @description Union type for all possible toast actions
 */
type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: ToasterToast["id"];
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: ToasterToast["id"];
    };

/**
 * @interface State
 * @description Interface for the toast state
 */
interface State {
  toasts: ToasterToast[];
}

/**
 * @constant toastTimeouts
 * @description Map to store timeout IDs for toast removal
 */
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

/**
 * @function addToRemoveQueue
 * @description Adds a toast to the removal queue
 * @param {string} toastId - ID of the toast to be removed
 */
const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

/**
 * @function reducer
 * @description Reducer function for managing toast state
 * @param {State} state - Current state
 * @param {Action} action - Action to be performed
 * @returns {State} New state
 */
export const reducer = (state: State, action: Action): State => {
  //
};

/**
 * @constant listeners
 * @description Array of state change listeners
 */
const listeners: Array<(state: State) => void> = [];

/**
 * @constant memoryState
 * @description In-memory state storage for toasts
 */
let memoryState: State = { toasts: [] };

/**
 * @function dispatch
 * @description Dispatches an action to update toast state
 * @param {Action} action - Action to dispatch
 */
function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

/**
 * @type Toast
 * @description Type for toast properties excluding the ID
 */
type Toast = Omit<ToasterToast, "id">;

/**
 * @function toast
 * @description Creates and shows a new toast
 * @param {Toast} props - Toast properties
 * @returns {object} Toast controls (id, dismiss, update)
 */
function toast({ ...props }: Toast) {
  // ...existing code...
}

/**
 * @function useToast
 * @description Custom hook for managing toasts
 * @returns {object} Toast state and control methods
 */
function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

export { useToast, toast };
