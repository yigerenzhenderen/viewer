import Cookies from 'js-cookie';

// 存储

const user_info_key = 'hn_user_info'

function storeUserCookie(userInfo) {
    Cookies.set(user_info_key, JSON.stringify(userInfo), { expires: 1 });
}



// 获取
function getUserInfo() {
    const userInfoString = Cookies.get(user_info_key);
    let userInfo = null;
    if (userInfoString) {
        userInfo = JSON.parse(userInfoString);
    }
    return userInfo;
}

// 移除
function removeCookie() {
    Cookies.remove(user_info_key);
}

export default { getUserInfo, storeUserCookie, removeCookie } 
