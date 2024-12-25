


export function getImgUrl(url) {
	return new URL(url, import.meta.url).href;
}

export function formatDate(dateString) {
    // 将日期字符串转换为 Date 对象
    const date = new Date(dateString);

    // 获取年月日
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth 返回 0 到 11，所以需要加 1
    const day = String(date.getDate()).padStart(2, '0'); // 确保日和月是两位数

    // 返回格式化后的日期
    return `${year}年${month}月${day}日`;
}