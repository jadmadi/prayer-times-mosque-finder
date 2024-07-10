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
// sunPosition.js

function calculateSunPosition(date, latitude, longitude) {
    const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const declination = 23.45 * Math.sin(2 * Math.PI * (284 + dayOfYear) / 365);
    const hourAngle = (12 - date.getHours()) * 15;
    const altitude = Math.asin(Math.sin(latitude * Math.PI / 180) * Math.sin(declination * Math.PI / 180) + 
                     Math.cos(latitude * Math.PI / 180) * Math.cos(declination * Math.PI / 180) * Math.cos(hourAngle * Math.PI / 180));
    const azimuth = Math.acos((Math.sin(declination * Math.PI / 180) - Math.sin(altitude) * Math.sin(latitude * Math.PI / 180)) / 
                    (Math.cos(altitude) * Math.cos(latitude * Math.PI / 180)));
    return { altitude: altitude * 180 / Math.PI, azimuth: azimuth * 180 / Math.PI };
}

function getSunIcon(altitude) {
    if (altitude < 0) return '🌙'; // Night
    if (altitude < 10) return '🌅'; // Sunrise/Sunset
    if (altitude < 30) return '🌤️'; // Low in sky
    if (altitude < 60) return '⛅'; // Medium in sky
    return '☀️'; // High in sky
}

function updateBackgroundColor(altitude) {
    const hue = Math.max(0, Math.min(240, (altitude + 20) * 4));
    document.body.style.backgroundColor = `hsl(${hue}, 70%, 50%)`;
}

function updateSunPosition(latitude, longitude) {
    const now = new Date();
    const sunPosition = calculateSunPosition(now, latitude, longitude);
    sunPositionSpan.textContent = `Sun Position: Altitude ${sunPosition.altitude.toFixed(2)}°, Azimuth ${sunPosition.azimuth.toFixed(2)}°`;
    currentSunIcon.textContent = getSunIcon(sunPosition.altitude);
    updateBackgroundColor(sunPosition.altitude);
}