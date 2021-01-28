class Weather {
  constructor() {
    this.weatherCards = document.querySelector(".weather-cards");
    this.overlayContainer = document.querySelector(".overlay");
    this.key = "3f86465e08723a0031ac7013675e093a";
    this.default = "London";
    this.city;
    this.day = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    this.month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  }

  async fetchData(input) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${input}&units=metric&appid=${this.key}`);
    const data = await response.json();
    console.log(data);
    return data;
  }

  async fetchLocation(input) {
    const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=1&appid=${this.key}`);
    const coordinates = await response.json();
    return coordinates;
  }

  async fetchOneCallApi(coord) {
    const { lat, lon } = coord[0];
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,alerts&units=metric&appid=${this.key}`
    );
    const data = await response.json();
    console.log(data);
    return data;
  }

  generateCardOverlay(data) {
    this.overlayContainer.innerHTML = `
      <div class="daily-forecast">
                <div class="daily">
                  <img src="http://openweathermap.org/img/wn/${data.daily[0].weather[0].icon}@2x.png" alt="">
                  <div class="daily-temp">${data.daily[0].temp.min}&deg;c / ${data.daily[0].temp.max}&deg;c </div>
                  <div class='weekday'>monday</div>
                </div>
            </div>
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
      <div class="container">
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
        <article class="overlay"></article>
      </div>
      `;

    const overlay = document.querySelector(".overlay");
    const main = document.querySelector(".weather-container");
    const overlayBtn = document.querySelector(".daily-btn");
    overlayBtn.addEventListener("click", () => {
      this.fetchLocation(data.name)
        .then((coord) => this.fetchOneCallApi(coord))
        .then((data) => {
          const over = document.querySelector(".overlay");
          over.innerHTML = `
          
          <h2>Hourly</h2>
            <div class='hourly'>
              <div class='hour'>
                <p class='time'>10:00</p>
                <p>${Math.round(data.hourly[0].temp)}&deg;c</p>
                <img src="http://openweathermap.org/img/wn/${data.hourly[0].weather[0].icon}@2x.png" alt="">
              </div>
              <div class='hour'>
                <p class='time'>10:00</p>
                <p>${Math.round(data.hourly[1].temp)}&deg;c</p>
                <img src="http://openweathermap.org/img/wn/${data.hourly[0].weather[0].icon}@2x.png" alt="">
              </div>
              <div class='hour'>
                <p class='time'>10:00</p>
                <p>${Math.round(data.hourly[3].temp)}&deg;c</p>
                <img src="http://openweathermap.org/img/wn/${data.hourly[0].weather[0].icon}@2x.png" alt="">
              </div>
              <div class='hour'>
                <p class='time'>10:00</p>
                <p>${Math.round(data.hourly[4].temp)}&deg;c</p>
                <img src="http://openweathermap.org/img/wn/${data.hourly[0].weather[0].icon}@2x.png" alt="">
              </div>
            </div>
            <h2>Daily</h2>
            <div class="daily-forecast">
                <div class="daily">
                  <img src="http://openweathermap.org/img/wn/${data.daily[0].weather[0].icon}@2x.png" alt="">
                  <div class="daily-temp">${Math.round(data.daily[0].temp.min)}&deg;c / ${Math.round(data.daily[0].temp.max)}&deg;c </div>
                  <div class='weekday'>${this.day[currentDay]}</div>
                </div>
                <div class="daily">
                  <img src="http://openweathermap.org/img/wn/${data.daily[0].weather[0].icon}@2x.png" alt="">
                  <div class="daily-temp">${Math.round(data.daily[1].temp.min)}&deg;c / ${Math.round(data.daily[1].temp.max)}&deg;c </div>
                  <div class='weekday'>${this.day[currentDay + 1]}</div>
                </div>
                <div class="daily">
                  <img src="http://openweathermap.org/img/wn/${data.daily[0].weather[0].icon}@2x.png" alt="">
                  <div class="daily-temp">${Math.round(data.daily[2].temp.min)}&deg;c / ${Math.round(data.daily[2].temp.max)}&deg;c </div>
                  <div class='weekday'>${this.day[currentDay + 2]}</div>
                </div>
            </div>
          <div class="weather-btn">
            <i class="fas fa-chevron-down"></i>
          </div>
         
    `;

          const weatherBtn = document.querySelector(".weather-btn");
          weatherBtn.addEventListener("click", () => {
            overlay.style.opacity = "0";
            setTimeout(() => (overlay.style.height = "0"), 50);
            setTimeout(() => (main.style.opacity = "1"), 100);
          });
        });
      overlay.style.height = "100%";
      setTimeout(() => (overlay.style.opacity = "1"), 130);
      main.style.opacity = "0";
    });
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
