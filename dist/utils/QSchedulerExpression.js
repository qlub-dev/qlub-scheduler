"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVERY_WEEK_AT = exports.EVERY_DAY_AT = exports.EVERY_FIRST_DAY_OF_MOUNTH_AT = exports.QSchedulerExpression = void 0;
var QSchedulerExpression;
(function (QSchedulerExpression) {
    QSchedulerExpression["EVERY_SECOND"] = "* * * * * *";
    QSchedulerExpression["EVERY_5_SECONDS"] = "*/5 * * * * *";
    QSchedulerExpression["EVERY_10_SECONDS"] = "*/10 * * * * *";
    QSchedulerExpression["EVERY_30_SECONDS"] = "*/30 * * * * *";
    QSchedulerExpression["EVERY_MINUTE"] = "*/1 * * * *";
    QSchedulerExpression["EVERY_5_MINUTES"] = "0 */5 * * * *";
    QSchedulerExpression["EVERY_10_MINUTES"] = "0 */10 * * * *";
    QSchedulerExpression["EVERY_30_MINUTES"] = "0 */30 * * * *";
    QSchedulerExpression["EVERY_HOUR"] = "0 0-23/1 * * *";
    QSchedulerExpression["EVERY_2_HOURS"] = "0 0-23/2 * * *";
    QSchedulerExpression["EVERY_3_HOURS"] = "0 0-23/3 * * *";
    QSchedulerExpression["EVERY_4_HOURS"] = "0 0-23/4 * * *";
    QSchedulerExpression["EVERY_5_HOURS"] = "0 0-23/5 * * *";
    QSchedulerExpression["EVERY_6_HOURS"] = "0 0-23/6 * * *";
    QSchedulerExpression["EVERY_7_HOURS"] = "0 0-23/7 * * *";
    QSchedulerExpression["EVERY_8_HOURS"] = "0 0-23/8 * * *";
    QSchedulerExpression["EVERY_9_HOURS"] = "0 0-23/9 * * *";
    QSchedulerExpression["EVERY_10_HOURS"] = "0 0-23/10 * * *";
    QSchedulerExpression["EVERY_11_HOURS"] = "0 0-23/11 * * *";
    QSchedulerExpression["EVERY_12_HOURS"] = "0 0-23/12 * * *";
    QSchedulerExpression["EVERY_DAY_AT_1AM"] = "0 01 * * *";
    QSchedulerExpression["EVERY_DAY_AT_2AM"] = "0 02 * * *";
    QSchedulerExpression["EVERY_DAY_AT_3AM"] = "0 03 * * *";
    QSchedulerExpression["EVERY_DAY_AT_4AM"] = "0 04 * * *";
    QSchedulerExpression["EVERY_DAY_AT_5AM"] = "0 05 * * *";
    QSchedulerExpression["EVERY_DAY_AT_6AM"] = "0 06 * * *";
    QSchedulerExpression["EVERY_DAY_AT_7AM"] = "0 07 * * *";
    QSchedulerExpression["EVERY_DAY_AT_8AM"] = "0 08 * * *";
    QSchedulerExpression["EVERY_DAY_AT_9AM"] = "0 09 * * *";
    QSchedulerExpression["EVERY_DAY_AT_10AM"] = "0 10 * * *";
    QSchedulerExpression["EVERY_DAY_AT_11AM"] = "0 11 * * *";
    QSchedulerExpression["EVERY_DAY_AT_NOON"] = "0 12 * * *";
    QSchedulerExpression["EVERY_DAY_AT_1PM"] = "0 13 * * *";
    QSchedulerExpression["EVERY_DAY_AT_2PM"] = "0 14 * * *";
    QSchedulerExpression["EVERY_DAY_AT_3PM"] = "0 15 * * *";
    QSchedulerExpression["EVERY_DAY_AT_4PM"] = "0 16 * * *";
    QSchedulerExpression["EVERY_DAY_AT_5PM"] = "0 17 * * *";
    QSchedulerExpression["EVERY_DAY_AT_6PM"] = "0 18 * * *";
    QSchedulerExpression["EVERY_DAY_AT_7PM"] = "0 19 * * *";
    QSchedulerExpression["EVERY_DAY_AT_8PM"] = "0 20 * * *";
    QSchedulerExpression["EVERY_DAY_AT_9PM"] = "0 21 * * *";
    QSchedulerExpression["EVERY_DAY_AT_10PM"] = "0 22 * * *";
    QSchedulerExpression["EVERY_DAY_AT_11PM"] = "0 23 * * *";
    QSchedulerExpression["EVERY_DAY_AT_MIDNIGHT"] = "0 0 * * *";
    QSchedulerExpression["EVERY_WEEK"] = "0 0 * * 0";
    QSchedulerExpression["EVERY_WEEKDAY"] = "0 0 * * 1-5";
    QSchedulerExpression["EVERY_WEEKEND"] = "0 0 * * 6,0";
    QSchedulerExpression["EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT"] = "0 0 1 * *";
    QSchedulerExpression["EVERY_1ST_DAY_OF_MONTH_AT_NOON"] = "0 12 1 * *";
    QSchedulerExpression["EVERY_2ND_HOUR"] = "0 */2 * * *";
    QSchedulerExpression["EVERY_2ND_HOUR_FROM_1AM_THROUGH_11PM"] = "0 1-23/2 * * *";
    QSchedulerExpression["EVERY_2ND_MONTH"] = "0 0 1 */2 *";
    QSchedulerExpression["EVERY_QUARTER"] = "0 0 1 */3 *";
    QSchedulerExpression["EVERY_6_MONTHS"] = "0 0 1 */6 *";
    QSchedulerExpression["EVERY_YEAR"] = "0 0 1 1 *";
    QSchedulerExpression["EVERY_30_MINUTES_BETWEEN_9AM_AND_5PM"] = "0 */30 9-17 * * *";
    QSchedulerExpression["EVERY_30_MINUTES_BETWEEN_9AM_AND_6PM"] = "0 */30 9-18 * * *";
    QSchedulerExpression["EVERY_30_MINUTES_BETWEEN_10AM_AND_7PM"] = "0 */30 10-19 * * *";
    QSchedulerExpression["MONDAY_TO_FRIDAY_AT_1AM"] = "0 0 01 * * 1-5";
    QSchedulerExpression["MONDAY_TO_FRIDAY_AT_2AM"] = "0 0 02 * * 1-5";
    QSchedulerExpression["MONDAY_TO_FRIDAY_AT_3AM"] = "0 0 03 * * 1-5";
    QSchedulerExpression["MONDAY_TO_FRIDAY_AT_4AM"] = "0 0 04 * * 1-5";
    QSchedulerExpression["MONDAY_TO_FRIDAY_AT_5AM"] = "0 0 05 * * 1-5";
    QSchedulerExpression["MONDAY_TO_FRIDAY_AT_6AM"] = "0 0 06 * * 1-5";
    QSchedulerExpression["MONDAY_TO_FRIDAY_AT_7AM"] = "0 0 07 * * 1-5";
    QSchedulerExpression["MONDAY_TO_FRIDAY_AT_8AM"] = "0 0 08 * * 1-5";
    QSchedulerExpression["MONDAY_TO_FRIDAY_AT_9AM"] = "0 0 09 * * 1-5";
    QSchedulerExpression["MONDAY_TO_FRIDAY_AT_09_30AM"] = "0 30 09 * * 1-5";
    QSchedulerExpression["MONDAY_TO_FRIDAY_AT_10AM"] = "0 0 10 * * 1-5";
    QSchedulerExpression["MONDAY_TO_FRIDAY_AT_11AM"] = "0 0 11 * * 1-5";
    QSchedulerExpression["MONDAY_TO_FRIDAY_AT_11_30AM"] = "0 30 11 * * 1-5";
    QSchedulerExpression["MONDAY_TO_FRIDAY_AT_12PM"] = "0 0 12 * * 1-5";
    QSchedulerExpression["MONDAY_TO_FRIDAY_AT_1PM"] = "0 0 13 * * 1-5";
    QSchedulerExpression["MONDAY_TO_FRIDAY_AT_2PM"] = "0 0 14 * * 1-5";
    QSchedulerExpression["MONDAY_TO_FRIDAY_AT_3PM"] = "0 0 15 * * 1-5";
    QSchedulerExpression["MONDAY_TO_FRIDAY_AT_4PM"] = "0 0 16 * * 1-5";
    QSchedulerExpression["MONDAY_TO_FRIDAY_AT_5PM"] = "0 0 17 * * 1-5";
    QSchedulerExpression["MONDAY_TO_FRIDAY_AT_6PM"] = "0 0 18 * * 1-5";
    QSchedulerExpression["MONDAY_TO_FRIDAY_AT_7PM"] = "0 0 19 * * 1-5";
    QSchedulerExpression["MONDAY_TO_FRIDAY_AT_8PM"] = "0 0 20 * * 1-5";
    QSchedulerExpression["MONDAY_TO_FRIDAY_AT_9PM"] = "0 0 21 * * 1-5";
    QSchedulerExpression["MONDAY_TO_FRIDAY_AT_10PM"] = "0 0 22 * * 1-5";
    QSchedulerExpression["MONDAY_TO_FRIDAY_AT_11PM"] = "0 0 23 * * 1-5";
})(QSchedulerExpression = exports.QSchedulerExpression || (exports.QSchedulerExpression = {}));
function checkTime(time) {
    if (time.minute > 60) {
        throw new Error("Minute cannot be bigger than 60");
    }
    if (time.clock > 24) {
        throw new Error("Clock cannot be bigger than 24");
    }
}
function EVERY_FIRST_DAY_OF_MOUNTH_AT(time) {
    checkTime(time);
    return `${time.minute} ${time.clock} 1 * *`;
}
exports.EVERY_FIRST_DAY_OF_MOUNTH_AT = EVERY_FIRST_DAY_OF_MOUNTH_AT;
function EVERY_DAY_AT(time) {
    checkTime(time);
    return `${time.minute} ${time.clock} * * *`;
}
exports.EVERY_DAY_AT = EVERY_DAY_AT;
function EVERY_WEEK_AT(time) {
    checkTime(time);
    return `${time.minute} ${time.clock} * * 1`;
}
exports.EVERY_WEEK_AT = EVERY_WEEK_AT;
//# sourceMappingURL=QSchedulerExpression.js.map