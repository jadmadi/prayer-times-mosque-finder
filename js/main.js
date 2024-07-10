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

// main.js

// DOM Elements
const detectLocationBtn = document.getElementById('detectLocation');
const cityInput = document.getElementById('cityInput');
const getCityPrayerTimesBtn = document.getElementById('getCityPrayerTimes');
const prayerTimesDiv = document.getElementById('prayerTimes');
const nextPrayerDiv = document.getElementById('nextPrayer');
const dateTimeDiv = document.getElementById('dateTime');
const countdownDiv = document.getElementById('countdown');
const sunPositionSpan = document.getElementById('sunPosition');
const currentSunIcon = document.getElementById('currentSunIcon');
const mosqueSection = document.getElementById('mosqueSection');
const mosqueList = document.getElementById('mosqueList');

// Global variables
let nextPrayerTime;

// Helper function to handle successful location retrieval
function handleLocation(latitude, longitude) {
    console.log('Location:', latitude, longitude);
    updateSunPosition(latitude, longitude);
    getPrayerTimes(latitude, longitude);
    handleLocationDetected(latitude, longitude); // This calls the function in googleMaps.js
}

// Event Listeners
detectLocationBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                handleLocation(position.coords.latitude, position.coords.longitude);
            },
            (error) => {
                console.error('Geolocation error:', error);
                alert("Unable to retrieve your location. Please enter a city name.");
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
        );
    } else {
        alert("Geolocation is not supported by your browser. Please enter a city name.");
    }
});

getCityPrayerTimesBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const latitude = parseFloat(data[0].lat);
                    const longitude = parseFloat(data[0].lon);
                    handleLocation(latitude, longitude);
                } else {
                    alert("Unable to find coordinates for the entered city. Please try again.");
                }
            })
            .catch(error => {
                console.error('Geocoding error:', error);
                alert("Error occurred while finding the city. Please try again.");
            });
    } else {
        alert("Please enter a city name.");
    }
});

// Function to update prayer times
function updatePrayerTimes(timings, date) {
    const prayerNames = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    const colors = ['bg-red-200', 'bg-orange-200', 'bg-yellow-200', 'bg-green-200', 'bg-blue-200', 'bg-indigo-200'];
    
    prayerTimesDiv.innerHTML = `<p class="font-bold text-center mb-2 text-xl">${date}</p>`;
    
    const now = new Date();
    nextPrayerTime = null;

    prayerNames.forEach((prayer, index) => {
        const prayerTime = new Date(`${date} ${timings[prayer]}`);
        const timeUntilPrayer = prayerTime - now;
        
        if (timeUntilPrayer > 0 && !nextPrayerTime) {
            nextPrayerTime = prayerTime;
        }

        prayerTimesDiv.innerHTML += `
            <div class="flex justify-between items-center ${colors[index]} p-3 rounded">
                <span class="font-semibold">${prayer}</span>
                <span>${timings[prayer]}</span>
            </div>
        `;
    });

    updateNextPrayerCountdown();
}

// Function to fetch prayer times
function getPrayerTimes(latitude, longitude) {
    const url = `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`;
    axios.get(url)
        .then(response => {
            const timings = response.data.data.timings;
            const date = response.data.data.date.readable;
            updatePrayerTimes(timings, date);
        })
        .catch(error => {
            console.error('Error fetching prayer times:', error);
            alert("Error fetching prayer times. Please try again.");
        });
}

// Update time and sun position every minute
setInterval(() => {
    updateDateTime();
    if (typeof updateSunPosition === 'function' && sunPositionSpan.dataset.latitude && sunPositionSpan.dataset.longitude) {
        updateSunPosition(parseFloat(sunPositionSpan.dataset.latitude), parseFloat(sunPositionSpan.dataset.longitude));
    }
}, 60000);

// Initial setup
setInterval(updateDateTime, 1000);
setInterval(updateNextPrayerCountdown, 1000);
updateDateTime();

// Store latitude and longitude in sunPositionSpan dataset for periodic updates
function updateSunPosition(latitude, longitude) {
    if (typeof calculateSunPosition === 'function') {
        const now = new Date();
        const sunPosition = calculateSunPosition(now, latitude, longitude);
        sunPositionSpan.textContent = `Sun Position: Altitude ${sunPosition.altitude.toFixed(2)}°, Azimuth ${sunPosition.azimuth.toFixed(2)}°`;
        currentSunIcon.textContent = getSunIcon(sunPosition.altitude);
        updateBackgroundColor(sunPosition.altitude);
        
        // Store latitude and longitude for periodic updates
        sunPositionSpan.dataset.latitude = latitude;
        sunPositionSpan.dataset.longitude = longitude;
    }
}

// Load Google Maps script (if not already loaded in googleMaps.js)
if (typeof loadGoogleMapsScript === 'function') {
    loadGoogleMapsScript();
}