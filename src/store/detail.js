import { defineStore } from 'pinia'

export const useDetailStore = defineStore('detail', {
    state: () => {
        return { 
            item: null,
            structure: null,
            page: 0,
            id: null,
            hide: true,
            sneak: false,
        }
    }
})