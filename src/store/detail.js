import { defineStore } from 'pinia'

export const useDetailStore = defineStore('detail', {
    state: () => {
        return { 
            editing: false,
            form:{
                id: "",
                name: '',
                desc: '',
                shotTime: '',
                shoter: '',
                place: '',
                kws: [],
            },
            item: null,
            structure: null,
            page: 0,
            id: null,
            hide: true,
            sneak: false,
            x: 100,
            y: 100,
            maniShow: false,
        }
    }
})