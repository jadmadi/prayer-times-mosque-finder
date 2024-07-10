/*
    Prayer Times & Mosque Finder
    Copyright (C) 2024 Jad Madi
 
Author: Jad Madi
GitHub: @jadmadi (https://github.com/jadmadi)
email: jad@madi.se
Website: https://madi.se
LinkedIn: https://linkedin.com/in/hakammadi
 *
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
 *
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
 *
You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
This work is also aligned with the principles of the Waqf General Public License,
with the intention of being a perpetual charitable endowment (Waqf) for the benefit
of all Muslims. For more information on Waqf, visit: https://github.com/ojuba-org/waqf
 *

If you find this project useful, please consider:
- Starring the repository on GitHub
- Sharing it with others who might benefit
- Contributing to its development
- Providing feedback or suggestions for improvement
 *
For professional inquiries or collaborations, please contact via LinkedIn or website.
 *
This project utilizes the following third-party resources:
- OpenStreetMap (© OpenStreetMap contributors)
- Leaflet.js (https://leafletjs.com)
- Aladhan API (https://aladhan.com/prayer-times-api)
- Tailwind CSS (https://tailwindcss.com)
- Ojuba-org - Waqf License (https://github.com/ojuba-org/waqf)
 *
Last updated: [03 Muḥarram 1446 AH ** 10/07/20244]
 */


// dateTime.// dateTime.js

/**
 * Updates the date and time displayed on the webpage.
 * 
 * This function:
 * - Gets the current date and time
 * - Formats the date in both Gregorian and Hijri calendars
 * - Fetches the Hijri date from Aladhan.com API
 * - Displays Hijri date, Gregorian date, and current time on the webpage
 * - Falls back to showing only Gregorian date and time if there's an error
 */
async function updateDateTime() {
    const now = new Date();
    const gregorianDate = now.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
    });
    const [month, day, year] = gregorianDate.split('/');
    const formattedDate = `${day}-${month}-${year}`;

    try {
        // Fetch Hijri date from Aladhan.com API
        const response = await axios.get(`https://api.aladhan.com/v1/gToH/${formattedDate}`);
        const hijriDate = response.data.data.hijri;
        const gregorian = now.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        const time = now.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit', 
            hour12: false 
        });

        // Display both Hijri and Gregorian dates, along with current time
        dateTimeDiv.innerHTML = `
            Hijri (${hijriDate.day} ${hijriDate.month.en} ${hijriDate.year} AH) <br>
            Gregorian (${gregorian}) <br>
            Time: ${time}
        `;
    } catch (error) {
        console.error('Error fetching Hijri date:', error);
        // Fallback to displaying only Gregorian date and time if there's an error
        dateTimeDiv.innerHTML = `
            Date: ${gregorianDate} <br>
            Time: ${now.toLocaleTimeString()}
        `;
    }
}

/**
 * Shows a countdown to the next prayer time.
 * 
 * This function:
 * - Checks if there's a next prayer time set
 * - Calculates the time remaining until that prayer
 * - Displays the countdown in hours, minutes, and seconds
 * - Shows "It's prayer time!" when the countdown reaches zero
 * 
 * Note: Additional logic could be added to update to the next prayer time
 * after the current one passes.
 */
function updateNextPrayerCountdown() {
    if (nextPrayerTime) {
        const now = new Date();
        const timeUntilPrayer = nextPrayerTime - now;
        if (timeUntilPrayer > 0) {
            // Calculate hours, minutes, and seconds until next prayer
            const hours = Math.floor(timeUntilPrayer / 3600000);
            const minutes = Math.floor((timeUntilPrayer % 3600000) / 60000);
            const seconds = Math.floor((timeUntilPrayer % 60000) / 1000);
            // Display countdown
            countdownDiv.textContent = `Next Prayer in: ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
            // It's prayer time!
            countdownDiv.textContent = "It's prayer time!";
            // TODO: Add logic here to update to the next prayer time
        }
    }
}