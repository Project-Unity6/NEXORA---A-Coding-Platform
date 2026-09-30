function normalizeDate(date) {
    return new Date(
        Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate()
        )
    );
}

function getDayDifference(date1, date2) {

    const ONE_DAY = 24 * 60 * 60 * 1000;

    return Math.floor(
        (normalizeDate(date1) - normalizeDate(date2)) / ONE_DAY
    );
}


module.exports = {normalizeDate,getDayDifference}