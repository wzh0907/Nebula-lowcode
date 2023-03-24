let nowDate = new Date(); // 当前日期 
let nowMonth = nowDate.getMonth()+1; // 当前月 
let nowYear = nowDate.getFullYear(); // 当前年 
nowYear += (nowYear < 2000) ? 1900 : 0; //
var nowTime = nowDate.getTime();
var nowDay = nowDate.getDay();
var nowDayOfWeek = nowDate.getDay(); //今天本周的第几天
function getDateByType(type) {
    let value = "";
    var oneDayTime = 24 * 60 * 60 * 1000;
    let MondayTime = nowTime - (nowDay - 1) * oneDayTime; // 周一
    let SundayTime = nowTime + (7 - nowDay) * oneDayTime; // 周日
    // 本月的开始时间
    let monthStartDate = new Date(nowYear, nowMonth, 1);
    // 本月的结束时间
    let monthEndDate = new Date(nowYear, nowMonth + 1, 0);
    // 本周一
    let MondayDate = new Date(MondayTime);
    // 本周日
    let SundayDate = new Date(SundayTime);
    // console.log('xxxx', type, MondayDate)
    // 判断类型显示日期
    if (type === 'Today') {
        value = formatDate(new Date())
    } else if (type === 'Monday') {
        value = formatDate(MondayDate)
    } else if (type === 'Sunday') {
        value = formatDate(SundayDate)
    } else if (type === 'MonthStart') {
        value = formatDate(monthStartDate)
    } else if (type === 'MonthEnd') {
        value = formatDate(monthEndDate)
    }
    return value;
}

function lastDay(x) { 
    let lastDay = new Date();
    lastDay.setDate(nowDate.getDate()-x);
    return formatDate(lastDay);
}
/**
 * 获取本（周，月，季度，年） 第几天 
 * @param {第几天} x  
 * @param {单位} unit 
 * @param {是否为最后一天} isLastDay 
 * @returns 
 */
function currentUnitDay(x, unit, isLastDay) {
    let currentDay = new Date();
    if (unit == 'week') {
        if (isLastDay) {
            x = 7;
        }
        currentDay.setDate(nowDate.getDate()-nowDayOfWeek+x);
    } else if (unit == 'month') {
        if (isLastDay) {
            x = getMonthDays(nowMonth-1);
        }
        currentDay = new Date(nowYear, nowMonth-1, x);
    } else if (unit == 'season') {
        if (isLastDay) {
            var quarterEndMonth = getQuarterStartMonth() + 2;
            currentDay = new Date(nowYear, quarterEndMonth,
                getMonthDays(quarterEndMonth));
        } else {
            currentDay = new Date(nowYear, getQuarterStartMonth(), x);
        }

    } else if (unit == 'year') {
        if(isLastDay){
            currentDay=new Date(nowYear,11,31);
        }else{
            currentDay = new Date(nowYear,0, x);
        }
    }
    return formatDate(currentDay);

}
/**
 * 获取上（周，月，季度，年） 第几天 
 * @param {第几天} x  
 * @param {单位} unit 
 * @param {是否为最后一天} isLastDay 
 * @returns 
 */
function lastUnitDay(x, unit, isLastDay) {
    let lastDay = new Date();
    if (unit == 'week') {
        if (isLastDay) {
            x = 7;
        }
        lastDay.setDate(nowDate.getDate()-7-nowDayOfWeek+x);
    } else if (unit == 'month') {
        if (isLastDay) {
            x = getMonthDays(nowMonth-2);
        }
        lastDay = new Date(nowYear, nowMonth-2, x);
    } else if (unit == 'season') {
        if (isLastDay) {
            var quarterEndMonth = getQuarterStartMonth() - 1;
            lastDay = new Date(nowYear, quarterEndMonth,
                getMonthDays(quarterEndMonth));
        } else {
            lastDay = new Date(nowYear, getQuarterStartMonth()-3, x);
        }

    } else if (unit == 'year') {
        if(isLastDay){
            lastDay=new Date(nowYear-1,11,31);
        }else{
            lastDay = new Date(nowYear-1,0, x);
        }
    }
    return formatDate(lastDay);

 }
//获得某月的天数
function getMonthDays(myMonth) {
    var monthStartDate = new Date(nowYear, myMonth, 1);
    var monthEndDate = new Date(nowYear, myMonth + 1, 1);
    var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
    return days;
}
//获得本季度的开始月份
function getQuarterStartMonth() {
    var quarterStartMonth = 0;
    if (nowMonth < 3) {
        quarterStartMonth = 0;
    }
    if (2 < nowMonth && nowMonth < 6) {
        quarterStartMonth = 3;
    }
    if (5 < nowMonth && nowMonth < 9) {
        quarterStartMonth = 6;
    }
    if (nowMonth > 8) {
        quarterStartMonth = 9;
    }
    return quarterStartMonth;
}
function formatDate(date) {

    let month = date.getMonth() + 1
    if (month < 10) {
        month = "0" + month
    }
    let day = date.getDate();
    if (day < 10) {
        day = "0" + day
    }
    return `${date.getFullYear()}-${month}-${day}`;
}
export { getDateByType,lastDay,currentUnitDay,lastUnitDay }
