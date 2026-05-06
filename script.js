const apiKey = "YOUR_API_KEY"; // ✅ fixed (string)

async function getWeather() {
  const city = document.getElementById("cityInput").value.trim();
  const errorMsg = document.getElementById("errorMsg");
  const weatherCard = document.getElementById("weatherCard");

  // Clear previous error
  errorMsg.innerText = "";
  weatherCard.style.display = "none";

  // Validation
  if (!city) {
    errorMsg.innerText = "⚠️ Please enter a city name";
    return;
  }

  try {
    // Show loading state
    errorMsg.innerText = "⏳ Fetching weather...";

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    const data = await response.json();

    // Handle API errors properly
    if (!response.ok) {
      throw new Error(data.message || "City not found");
    }

    // Extract data safely
    const temp = data.main?.temp;
    const description = data.weather?.[0]?.description;
    const humidity = data.main?.humidity;
    const wind = data.wind?.speed;
    const cityName = data.name;
    const iconCode = data.weather?.[0]?.icon;

    // Update UI
    document.getElementById("cityName").innerText = cityName;
    document.getElementById("temperature").innerText = `${temp}°C`;
    document.getElementById("description").innerText = description;
    document.getElementById("humidity").innerText = `Humidity: ${humidity}%`;
    document.getElementById("wind").innerText = `Wind Speed: ${wind} m/s`;

    document.getElementById("weatherIcon").src =
      `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    // Show result
    weatherCard.style.display = "block";
    errorMsg.innerText = "";

  } catch (error) {
    errorMsg.innerText = `❌ ${error.message}`;
    weatherCard.style.display = "none";
  }
}

/* 🔥 Press Enter to search */
document.getElementById("cityInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    getWeather();
  }
});

/* 🌍 Auto-detect location on load */
window.onload = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;

          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
          );

          const data = await response.json();

          if (!response.ok) return;

          document.getElementById("cityName").innerText = data.name;
          document.getElementById("temperature").innerText = `${data.main.temp}°C`;
          document.getElementById("description").innerText = data.weather[0].description;
          document.getElementById("humidity").innerText = `Humidity: ${data.main.humidity}%`;
          document.getElementById("wind").innerText = `Wind Speed: ${data.wind.speed} m/s`;
          document.getElementById("weatherIcon").src =
            `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

          document.getElementById("weatherCard").style.display = "block";
        } catch (err) {
          console.log("Location fetch failed");
        }
      },
      () => {
        console.log("Location permission denied");
      }
    );
  }
};