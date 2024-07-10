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
// prayerTimes.js

function getPrayerTimes(latitude, longitude) {
    const url = `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`;
    axios.get(url)
        .then(response => {
            const timings = response.data.data.timings;
            const date = response.data.data.date.readable;
            
            const prayerNames = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
            const colors = ['bg-red-200', 'bg-orange-200', 'bg-yellow-200', 'bg-green-200', 'bg-blue-200', 'bg-indigo-200'];
            
            prayerTimesDiv.innerHTML = `<p class="font-bold text-center mb-2 text-xl">${date}</p>`;
            
            const now = new Date();
            nextPrayerTime = null;

            prayerNames.forEach((prayer, index) => {
                const prayerTime = new Date(`${date} ${timings[prayer]}`);
                const prayerSunPosition = calculateSunPosition(prayerTime, latitude, longitude);
                const timeUntilPrayer = prayerTime - now;
                
                if (timeUntilPrayer > 0 && !nextPrayerTime) {
                    nextPrayerTime = prayerTime;
                }

                prayerTimesDiv.innerHTML += `
                    <div class="flex justify-between items-center ${colors[index]} p-3 rounded">
                        <span class="font-semibold">${prayer}</span>
                        <span>${timings[prayer]}</span>
                        <span class="text-sm">
                            Alt: ${prayerSunPosition.altitude.toFixed(1)}°, Az: ${prayerSunPosition.azimuth.toFixed(1)}°
                            ${getSunIcon(prayerSunPosition.altitude)}
                        </span>
                    </div>
                `;
            });

            updateNextPrayerCountdown();
            
            // Initialize map and search for mosques
            initMap(latitude, longitude);
            searchNearbyMosques(latitude, longitude);
            
            // Show the mosque section
            mosqueSection.classList.remove('hidden');
        })
        .catch(error => {
            console.error('Error fetching prayer times:', error);
            alert("Error fetching prayer times. Please try again.");
        });
}