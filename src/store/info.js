import { defineStore } from 'pinia'

export const useInfoStore = defineStore('info', {
    state: () => {
        return { 
            info: "",
            sneak: true,
        }
    }
})