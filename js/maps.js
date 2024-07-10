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
// maps.js

let map;
let markers = [];

function initMap(lat, lng) {
    map = L.map('map').setView([lat, lng], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add marker for user location
    L.marker([lat, lng]).addTo(map)
        .bindPopup('Your Location')
        .openPopup();

    searchNearbyMosques(lat, lng);
}

function searchNearbyMosques(lat, lng) {
    // Clear previous markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];

    // Use Overpass API to find nearby mosques
    const query = `
    [out:json][timeout:25];
    (
      node["amenity"="place_of_worship"]["religion"="muslim"](around:5000,${lat},${lng});
      way["amenity"="place_of_worship"]["religion"="muslim"](around:5000,${lat},${lng});
      relation["amenity"="place_of_worship"]["religion"="muslim"](around:5000,${lat},${lng});
    );
    out body;
    >;
    out skel qt;
    `;

    fetch(`https://overpass-api.de/api/interpreter`, {
        method: 'POST',
        body: query
    })
    .then(response => response.json())
    .then(data => {
        const mosqueList = document.getElementById('mosqueList');
        mosqueList.innerHTML = ''; // Clear previous results

        if (data.elements && data.elements.length > 0) {
            data.elements.forEach(element => {
                if (element.type === 'node' && element.lat && element.lon) {
                    createMosqueItem(element, lat, lng);
                    createMarker(element);
                }
            });

            // Show the mosque section
            document.getElementById('mosqueSection').classList.remove('hidden');
        } else {
            throw new Error('No mosques found nearby');
        }
    })
    .catch(error => {
        console.error('Error fetching nearby mosques:', error);
        alert('Failed to find nearby mosques. Please try again.');
        document.getElementById('mosqueSection').classList.add('hidden');
    });
}

function createMosqueItem(place, userLat, userLon) {
    const mosqueList = document.getElementById('mosqueList');
    const distance = calculateDistance(userLat, userLon, place.lat, place.lon);
    const directionsUrl = `https://www.openstreetmap.org/directions?from=${userLat},${userLon}&to=${place.lat},${place.lon}`;

    const mosqueItem = document.createElement('div');
    mosqueItem.className = 'bg-gray-100 p-4 rounded-lg';
    mosqueItem.innerHTML = `
        <h3 class="font-bold text-xl mb-2">🕌  ${place.tags && place.tags.name ? place.tags.name : 'Unnamed Mosque'}</h3>
        <p>Distance: ${distance.toFixed(2)} km</p>
        <a href="${directionsUrl}" target="_blank" class="text-blue-500 hover:text-blue-700">Get Directions</a>
    `;

    mosqueList.appendChild(mosqueItem);
}

function createMarker(place) {
    const marker = L.marker([place.lat, place.lon]).addTo(map);
    marker.bindPopup(place.tags && place.tags.name ? place.tags.name : 'Unnamed Mosque');
    markers.push(marker);
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI/180);
}

function handleLocationDetected(latitude, longitude) {
    initMap(latitude, longitude);
}

// No need to load Google Maps script