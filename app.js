class Weather {
  constructor() {
    this.weatherCards = document.querySelector(".weather-cards");
    this.default = "London";
    this.city;
    this.day = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    this.month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  }

  async fetchData(input) {
    const key = "3f86465e08723a0031ac7013675e093a";

    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${input}&units=metric&appid=${key}`);
    const data = await response.json();
    console.log(data);
    return data;
  }

  async fetchLocation(input) {
    const key = "3f86465e08723a0031ac7013675e093a";

    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=1&appid=${key}`);
    const coordinates = await response.json();
    return coordinates;
  }

  async fetchOneCallApi(coord) {
    const key = "3f86465e08723a0031ac7013675e093a";

    const { lat, lon } = coord[0];

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&units=metric&appid=${key}`
    );
    const data = await response.json();
    console.log(data);
    return data;
  }

  generateOneCallCard(data) {
    this.weatherCards.innerHTML = `
        <article class="weather-container">
          <img src="http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png" alt="">
          <h1>${data.timezone}</h1>
          <div class="date">Tuesday, January 10, 2021</div>
          <div class="temperature">${data.current.temp}&deg;C</div>
          <div class="underline"></div>
          <div class="conditions">${data.current.weather[0].main}</div>
          <div class="min-max-temp">25&deg;c / 23&deg;c</div>
          <div class="daily-forecast">
            <div class="daily">
              <img src="http://openweathermap.org/img/wn/${data.daily[0].weather[0].icon}@2x.png" alt="">
              <div class="daily-temp">${data.daily[0].temp.min}&deg;c / ${data.daily[0].temp.max}&deg;c </div>
              <div class='weekday'>monday</div>
            </div>
            <div class="daily">
              <img src="http://openweathermap.org/img/wn/${data.daily[1].weather[0].icon}@2x.png" alt="">
              <div class="daily-temp">${data.daily[1].temp.min}&deg;c / ${data.daily[1].temp.max}&deg;c </div>
              <div class='weekday'>monday</div>
            </div>
            <div class="daily">
              <img src="http://openweathermap.org/img/wn/${data.daily[2].weather[0].icon}@2x.png" alt="">
              <div class="daily-temp">${data.daily[2].temp.min}&deg;c / ${data.daily[2].temp.max}&deg;c </div>
              <div class='weekday'>monday</div>
            </div>
            
          </div>
          <div class="map-btn">^</div>
        </article>
      `;
  }

  generateCard(data) {
    //current date
    const date = new Date();
    const currentDay = date.getDay();
    const currentMonth = date.getMonth();
    const currentDate = date.getDate();
    const currentYear = date.getFullYear();
    // sunrise time
    const sunriseDate = new Date(data.sys.sunrise * 1000);
    const sunriseHours = sunriseDate.getHours();
    const sunriseMinutes = sunriseDate.getMinutes();
    // sunset time
    const sunsetDate = new Date(data.sys.sunset * 1000);
    const sunsetHours = sunsetDate.getHours();
    const sunsetMinutes = sunsetDate.getMinutes();

    this.weatherCards.innerHTML = `
        <article class="weather-container">
          <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="">
          <h1>${data.name}</h1>
          <div class="date">${this.day[currentDay - 1]}, ${this.month[currentMonth]} ${currentDay}, ${currentYear}</div>
          <div class="temperature">${Math.round(data.main.temp)}&deg;C</div>
          <div class="underline"></div>
          <div class="conditions">${data.weather[0].main}</div>
          <div class="min-max-temp">${Math.round(data.main.temp_min)}&deg;c / ${Math.round(data.main.temp_max)}&deg;c</div>
          <div class="wind">
            <i class="fas fa-wind"></i>
            <div class='wind-speed'>${Math.round(data.wind.speed)}m/s</div>
          </div>
          <div class="sunrise-sunset">
            <div class="sunrise">
              <i class="fas fa-sun"></i>
              <div>${sunriseHours}:${sunriseMinutes}</div>
            </div>
            <div class="sunset">
              <i class="fas fa-moon"></i>
              <div>${sunsetHours}:${sunsetMinutes}</div>
            </div>
          </div>
          <div class="daily-btn">
            <i class="fas fa-chevron-up"></i>
          </div>
        </article>
      `;
  }

  generateCardOverlay() {
    this.weatherCards.innerHTML = `
      <article class="overlay">
        <h1>test jbfsfs</h1>
      </article>
    `;
  }

  saveToLS(data) {
    localStorage.setItem("city", JSON.stringify(data));
  }

  getFromLS() {
    const ls = localStorage.getItem("city");

    if (ls == null || ls == undefined) {
      return this.default;
    } else {
      this.city = JSON.parse(localStorage.getItem("city"));
    }

    return this.city;
  }

  clearLS() {
    localStorage.clear();
  }
}

// Variables
const searchContainer = document.querySelector(".input-container");
const showWeatherBtn = document.querySelector(".submit-btn");
const addNewBtn = document.querySelector(".add-btn");
const input = document.querySelector(".input");

const weather = new Weather();

// search field ui
searchContainer.addEventListener("mouseover", () => {
  const input = document.querySelector(".input");

  searchContainer.classList.add("focus");
  setTimeout(() => input.focus(), 400);
});

// buttons functionality / cards ui
showWeatherBtn.addEventListener("click", () => {
  const city = input.value;
  weather.fetchData(city).then((data) => {
    weather.generateCard(data);
    weather.saveToLS(data);
  });
  input.value = "";
  searchContainer.classList.remove("focus");
});

addNewBtn.addEventListener("click", () => {
  const city = input.value;
  weather
    .fetchLocation(city)
    .then((coord) => weather.fetchOneCallApi(coord))
    .then((data) => weather.generateOneCallCard(data));
  input.value = "";
});

// on page initial load display weather card
window.addEventListener("DOMContentLoaded", () => {
  const initial = weather.getFromLS();
  if (initial === "London") {
    weather.fetchData(initial).then((data) => weather.generateCard(data));
  }

  weather.generateCard(initial);
});
