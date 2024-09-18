// thirdQuart.js

function calculateLastThird(maghribTime, fajrTime) {
    // Get current date
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Parse times and set to today's date
    const maghrib = new Date(today.toDateString() + ' ' + maghribTime);
    let fajr = new Date(tomorrow.toDateString() + ' ' + fajrTime);

    // If Fajr is before Maghrib, it's for the next day
    if (fajr < maghrib) {
        fajr.setDate(fajr.getDate() + 1);
    }

    const duration = fajr - maghrib;
    const thirdDuration = duration / 3;
    const lastThirdStart = new Date(maghrib.getTime() + 2 * thirdDuration);

    return lastThirdStart;
}


function updateLastThird(timings) {
    const lastThird = calculateLastThird(timings['Maghrib'], timings['Fajr']);
    const lastThirdElement = document.getElementById('lastThird');
    if (lastThirdElement) {
        const timeString = lastThird.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        lastThirdElement.innerHTML = `
            <span class="block text-4xl font-bold">Last Third of Night starts at:</span>
            <span class="block text-4xl mt-4 font-bold">${timeString}</span>
        `;
    }
}