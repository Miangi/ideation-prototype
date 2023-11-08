import { writable } from 'svelte/store'

export const app = writable()

export const visibleModals = writable({
	taskInfo: false,
	taskInstructions: false,
	taskSolution: false
})

export const unseenContent = writable({
	taskInfo: true,
	taskInstructions: true,
	taskSolution: true
})