document.addEventListener('DOMContentLoaded', function() {
    const map = document.getElementById('map');
    const zoomBtn = document.getElementById('zoom-btn');
    const distancePara = document.getElementById('distance');

    // Toggle zoom animation on button click
    let isZoomed = false;
    zoomBtn.addEventListener('click', function() {
        if (isZoomed) {
            map.style.transform = 'scale(1) translateY(0)';
            isZoomed = false;
            zoomBtn.textContent = 'Zoom In on Map';
        } else {
            map.style.transform = 'scale(1.1) translateY(-5px)';
            isZoomed = true;
            zoomBtn.textContent = 'Zoom Out';
        }
    });

    // Get user's geolocation and calculate approximate distance
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    } else {
        distancePara.textContent = 'Geolocation is not supported by this browser.';
    }

    function success(position) {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        // Our location coordinates (e.g., Harbel Super Market, Twe Farm Road, Liberia)
        const ourLat = 6.2905;
        const ourLng = -10.8025;

        // Simple distance calculation (Haversine formula)
        const distance = calculateDistance(userLat, userLng, ourLat, ourLng);
        distancePara.textContent = `Your approximate distance from us: ${distance.toFixed(2)} km`;
    }

    function error() {
        distancePara.textContent = 'Unable to retrieve your location. Please enable location services.';
    }

    // Haversine formula for distance between two points
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
});