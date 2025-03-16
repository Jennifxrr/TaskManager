module.exports = (date1, date2) => {

	let years = date2.getFullYear() - date1.getFullYear();
	let months = date2.getMonth() - date1.getMonth();
	let days = date2.getDate() - date1.getDate();

	if (months < 0) {
		years--;
		months += 12;
	}

	if (days < 0) {
		months--;
		const prevMonth = new Date(date2.getFullYear(), date2.getMonth() - 1, date1.getDate());
		days += new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0).getDate();
	}

	const differenceInMilliseconds = date2 - date1;
	const millisecondsInAnHour = 1000 * 60 * 60;
	const millisecondsInAMinute = 1000 * 60;

	const hours = Math.floor((differenceInMilliseconds % millisecondsInAnHour) / millisecondsInAnHour);
	const minutes = Math.floor((differenceInMilliseconds % millisecondsInAMinute) / millisecondsInAMinute);

	const timeuntil = [];

	if (years > 0) timeuntil.push(`\`${years}y\``);
	if (months > 0) timeuntil.push(`\`${months}mo\``);
	if (days > 0) timeuntil.push(`\`${days}d\``);
	if (hours > 0) timeuntil.push(`\`${hours}h\``);
	if (minutes > 0) timeuntil.push(`\`${minutes}h\``);

	return (timeuntil);

};