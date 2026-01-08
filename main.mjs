
//     async function weather_app(event) {
//         event.preventDefault();
//          let city = document.getElementById("city").value.trim();
   
//         // console.log(city);
//         // const api_key_default= "98055b8a93497a89086f9015ec508138"
//         const api_key = "a516986ff28271fa99675b3562f8578b";
//         // const response =  await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}&units=metric`);
//         const response = await axios.get(
//             `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${api_key}&unit=metrics`
//         );




        

//         console.log(response.data);
//         const city_name =document.getElementById("city_name").innerText = ` ${response.data.city.name}`;
//         document.getElementById("country_name").innerHTML = ` ${response.data.city.country}`;

async function getWeatherByLocation(lat, lon) {
    const api_key = "a516986ff28271fa99675b3562f8578b";

    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`
        );

        document.getElementById("city").value = response.data.city.name;
        renderWeather(response.data);

    } catch (error) {
        console.error(error);
        Swal.fire("Error", "Unable to detect your location weather", "error");
    }
}


function renderWeather(data) {
    document.getElementById("city_name").innerText = data.city.name;
    document.getElementById("country_name").innerText = data.city.country;

    const timezoneOffsetSec = data.city.timezone;
    const timezoneOffsetHours = timezoneOffsetSec / 3600;
    
    const gmtOffset = timezoneOffsetHours >= 0 ? 
        `GMT+${timezoneOffsetHours}` : 
        `GMT${timezoneOffsetHours}`;

    function formatTime12h(date) {
        let hours = date.getUTCHours();
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${hours}:${minutes} ${ampm}`;
    }

    function formatTime24h(date) {
        let hours = date.getUTCHours();
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    function formatDate(date) {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    const nowUTC = new Date();
    
   const cityTime = new Date(nowUTC.getTime() + timezoneOffsetSec * 1000);

   document.getElementById("timezone").innerHTML = `
        <div style="margin-bottom: 5px;">
            <strong>Local Time:</strong> ${formatTime12h(cityTime)} (${formatTime24h(cityTime)})
        </div>
        
        <div>
            <strong>${formatDate(cityTime)}</strong>
        </div>
        <div style="margin-bottom: 5px;">
            Timezone: ${gmtOffset} (${timezoneOffsetHours > 0 ? `${timezoneOffsetHours} hours ahead of GMT` : 
            timezoneOffsetHours < 0 ? `${Math.abs(timezoneOffsetHours)} hours behind GMT` : 'Same as GMT'})
        </div>
    `;

    function formatLocalTime(unix, offset) {
        const d = new Date((unix + offset) * 1000);
        return formatTime12h(d);
    }


    document.getElementById("sunrise").innerText = formatLocalTime(data.city.sunrise, timezoneOffsetSec);
    document.getElementById("sunset").innerText = formatLocalTime(data.city.sunset, timezoneOffsetSec);
    document.getElementById("humidity").innerText = `${data.list[0].main.humidity} %`;
    document.getElementById("wind_speed").innerText = `${(data.list[0].wind.speed * 3.6).toFixed(1)} km/h`;
    document.getElementById("sunny").innerText = data.list[0].weather[0].description;
    document.getElementById("temp").innerText = `${data.list[0].main.temp.toFixed(1)} °C`;
    updateTimeComparison(cityTime, nowUTC, gmtOffset, timezoneOffsetHours);
}


function updateTimeComparison(localTime, utcTime, gmtOffset, offsetHours) {
    let timeComparisonDiv = document.getElementById("timeComparison");

    const diffMs = localTime - utcTime;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    

    function formatTime12h(date) {
        let hours = date.getUTCHours();
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${hours}:${minutes} ${ampm}`;
    }
}

async function weather_app(event) {
    event.preventDefault();

    const city = document.getElementById("city").value.trim();
    if (!city) {
        Swal.fire("Warning", "Please enter a city name", "warning");
        return;
    }

    const api_key = "a516986ff28271fa99675b3562f8578b";

    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${api_key}&units=metric`
        );
        renderWeather(response.data);

    } catch (error) {
        Swal.fire("City Not Found", "Please enter a valid city name", "error");
    }
}

// AUTO DETECT USER LOCATION

window.onload = function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                getWeatherByLocation(lat, lon);
            },
            () => {
                console.warn("Location permission denied");
                document.getElementById("city").value = "London";
                weather_app(new Event('submit'));
            }
        );
    } else {
        document.getElementById("city").value = "London";
        weather_app(new Event('submit'));
    }
};


function formatTime12h(date) {
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
}

function formatTime24h(date) {
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}