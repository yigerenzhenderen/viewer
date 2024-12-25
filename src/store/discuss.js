import { defineStore } from 'pinia'

export const useDiscussStore = defineStore('discuss', {
    state: () => {
        return { 
            numDiscuss: 20,
            inputIng: false,
            replyCommentId: 0,
            // discussList: [
            //     { 
            //         wechatNickname: '刘翠花',
            //         commentText: '小时候经常和朋友去玩,小时候经常和朋友去玩小时候经常和朋友去玩小时候经常和朋友去玩小时候经常和朋友去玩小时候经常和朋友去玩小时候经常和朋友去玩小时候经常和朋友去玩小时候经常和朋友去玩小时候经常和朋友去玩',
            //         place: '湖南', // 可能需要通过人id去找
            //         actionTime: '2024.10.5',
            //         memberImgUrl: 'xxx',
            //         replies: [
            //             {
            //                 actionTime: '2024.10.5',
            //                 wechatNickname: "张大白",
            //                 memberImgUrl: "www.baidu.com",
            //                 commentText: "怀念小时候",
            //                 place: '湖南',
            //                 parentWechatNickName: "刘翠花"
            //             },
            //             {
            //                 actionTime: '2024.10.5',
            //                 wechatNickname: "张小白",
            //                 memberImgUrl: "www.baidu.com",
            //                 commentText: "我也怀念",
            //                 place: '湖南',
            //                 parentWechatNickName: "张大白"
                            
            //             }
            //         ]
            //     },
            //     {
            //         wechatNickname: '张三',
            //         commentText: '当时举办活动我在现场',
            //         place: '湖南', // 可能需要通过人id去找
            //         actionTime: '2024.10.5',
            //         memberImgUrl: 'xxx',
            //         replies: []
            //     }
            // ],
            discussList: []

        }
    },
    actions: {
    }
})