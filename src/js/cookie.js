import Cookies from 'js-cookie';
import fetch from './fetch';

// 存储用户登录信息

const user_info_key = 'hn_user_info'

function storeUserCookie(userInfo) {
    Cookies.set(user_info_key, JSON.stringify(userInfo), { expires: 1 });
}



// 获取 从储存的信息的id中fetch 因为不保证cookie中信息是最新的
function getMemberIdFromCookie() {
    const userInfoString = Cookies.get(user_info_key);
    let memberId = null;
    if (userInfoString) {
        memberId = JSON.parse(userInfoString).memberId;
    }
    return memberId;
}

// 移除
function removeCookie() {
    Cookies.remove(user_info_key);
}

export default { getMemberIdFromCookie, storeUserCookie, removeCookie } 
