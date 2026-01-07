
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
// if(city_name===" undefined"){
//     alert("Please enter a valid city name");
//     return;
// }
     
// if(country_name===" undefined"){
//     alert("Please enter a valid city name");
//     return;
// }

//        const nowUTC = new Date();
// const timezoneSeconds = response.data.city.timezone;
// const timezoneHours = timezoneSeconds / 3600;
// const cityTime = new Date(nowUTC.getTime() + timezoneSeconds * 1000);
// const timezoneElement = document.getElementById("timezone");
// function formatTime12h(date) {
//     let hours = date.getUTCHours();
//     const minutes = date.getUTCMinutes().toString().padStart(2, '0');
//     const ampm = hours >= 12 ? 'pm' : 'am';
//     hours = hours % 12;
//     hours = hours ? hours : 12; 
    
//     return `${hours}:${minutes} ${ampm}`;
// }
// function formatDate(date) {
//     const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
//     return date.toLocaleDateString('en-US', options);
// }

// const formattedTime = formatTime12h(cityTime);
// const formattedDate = formatDate(cityTime);
// const timezoneDisplay = `GMT${timezoneHours >= 0 ? '+' : ''}${Math.abs(timezoneHours)}`;

// timezoneElement.innerHTML = `
//     <div>${formattedTime}</div>
//     <div>${formattedDate} (${timezoneDisplay})</div>
// `;







// const cityTimezoneOffset = response.data.city.timezone; 
// function formatLocalTime(unixTimestamp, timezoneOffset) {
//     const utcTime = new Date(unixTimestamp * 1000);
//     const localTime = new Date(utcTime.getTime() + (timezoneOffset * 1000));
//     const hours = localTime.getUTCHours();
//     const minutes = localTime.getUTCMinutes().toString().padStart(2, '0');
//     const ampm = hours >= 12 ? 'PM' : 'AM';
//     const hours12 = hours % 12 || 12;
    
//     return `${hours12}:${minutes} ${ampm}`;
// }






// document.getElementById("sunrise").innerHTML = `${formatLocalTime(response.data.city.sunrise, cityTimezoneOffset)}`;
// document.getElementById("sunset").innerHTML = `${formatLocalTime(response.data.city.sunset, cityTimezoneOffset)}`;
// document.getElementById("humidity").innerText = `: ${response.data.list[0].main.humidity} %`;




// const windSpeedMps = response.data.list[0].wind.speed;
// const windSpeedKph = (windSpeedMps * 3.6).toFixed(1); 
// document.getElementById("wind_speed").innerText = `${windSpeedKph} km/h`;
//  document.getElementById("sunny").innerText = `${response.data.list[0].weather[0].description}`;
 
// const tempKelvin = response.data.list[0].main.temp;
// const tempCelsius = tempKelvin - 273.15;

// document.getElementById("temp").innerText =
//   ` ${tempCelsius.toFixed(1)} °C`;
  

//    function updateDateTime() {
//       const now = new Date();
//       const options = { weekday: 'long', year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit'};
//       document.getElementById('datetime').innerText = "Local Time ): " + now.toLocaleDateString('en-US', options);
//     }
//     setInterval(updateDateTime, 1000);
        
//     }

/// here is update code

async function weather_app(event) {
    event.preventDefault();
    
    const city = document.getElementById("city").value.trim();
    if (!city) {
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Please enter a city name!',
        });
        return;
    }

    const api_key = "a516986ff28271fa99675b3562f8578b";

    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${api_key}&units=metric`
        );

        const data = response.data;

        const cityNameEl = document.getElementById("city_name");
        const countryNameEl = document.getElementById("country_name");

        cityNameEl.innerText = data.city.name || "N/A";
        countryNameEl.innerText = data.city.country || "N/A";

        if (!data.city.name || !data.city.country) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid City',
                text: 'Please enter a valid city name!',
            });
            return;
        }

        const nowUTC = new Date();
        const timezoneOffsetSec = data.city.timezone;
        const cityTime = new Date(nowUTC.getTime() + timezoneOffsetSec * 1000);
        const timezoneElement = document.getElementById("timezone");

        function formatTime12h(date) {
            let hours = date.getUTCHours();
            const minutes = date.getUTCMinutes().toString().padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            return `${hours}:${minutes} ${ampm}`;
        }

        function formatDate(date) {
            return date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        }

        const formattedTime = formatTime12h(cityTime);
        const formattedDate = formatDate(cityTime);
        const timezoneDisplay = `GMT${timezoneOffsetSec >= 0 ? '+' : ''}${timezoneOffsetSec / 3600}`;

        timezoneElement.innerHTML = `
            <div>${formattedTime}</div>
            <div>${formattedDate} (${timezoneDisplay})</div>
        `;

        function formatLocalTime(unixTimestamp, timezoneOffset) {
            const utcTime = new Date(unixTimestamp * 1000);
            const localTime = new Date(utcTime.getTime() + timezoneOffset * 1000);
            let hours = localTime.getUTCHours();
            const minutes = localTime.getUTCMinutes().toString().padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            return `${hours}:${minutes} ${ampm}`;
        }

        document.getElementById("sunrise").innerText = formatLocalTime(data.city.sunrise, timezoneOffsetSec);
        document.getElementById("sunset").innerText = formatLocalTime(data.city.sunset, timezoneOffsetSec);

        document.getElementById("humidity").innerText = `: ${data.list[0].main.humidity} %`;

        const windSpeedKph = (data.list[0].wind.speed * 3.6).toFixed(1);
        document.getElementById("wind_speed").innerText = `${windSpeedKph} km/h`;

        document.getElementById("sunny").innerText = data.list[0].weather[0].description;

        document.getElementById("temp").innerText = `${data.list[0].main.temp.toFixed(1)} °C`;

        function updateDateTime() {
            const now = new Date();
            const options = { weekday: 'long', year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit'};
            document.getElementById('datetime').innerText = "Local Time: " + now.toLocaleDateString('en-US', options);
        }
        setInterval(updateDateTime, 1000);

    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: 'error',
            title: 'City Not Found',
            text: 'Please enter a valid city name or check your network!',
        });
    }
}
