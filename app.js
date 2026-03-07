document.querySelector('.navbar-nav').addEventListener('click', (e) => {
  if (e.target.classList.contains('nav-link')) {
    e.preventDefault();

    const sectionId = e.target.getAttribute('href').replace('#', '');

    document.querySelectorAll('section[id]').forEach((section) => {
      section.classList.add('d-none');
    });

    document.querySelectorAll('.nav-link').forEach((link) => {
      link.classList.remove('active');
    });

    document.getElementById(sectionId).classList.remove('d-none');
    e.target.classList.add('active');
  }
});

document.getElementById('searchForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const city = document.getElementById('cityInput').value.trim();

  if (city) {
    fetchWeatherData(city);
    document.getElementById('cityInput').value = '';
  }
});

function renderHourlyWeatherTable(data) {
  const tableBody = document.getElementById('hourlyTableBody');
  tableBody.innerHTML = '';

  const hourlyData = data.list.slice(0, 8);

  hourlyData.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const dateTime = date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    const temp = Math.round(item.main.temp);
    const description = item.weather[0].description;
    const icon = item.weather[0].icon;
    const humidity = item.main.humidity;
    const windSpeed = item.wind.speed;

    const row = document.createElement('tr');
    row.innerHTML = `
      <td><img src="https://openweathermap.org/img/wn/${icon}.png" alt="${description}"></td>
      <td>${description}</td>
      <td>${dateTime}</td>
      <td>${temp}°C</td>
      <td>${humidity}%</td>
      <td>${windSpeed} m/s</td>
    `;
    tableBody.appendChild(row);
  });
}

function renderStatistics(data) {
  const temperatures = data.list.map((item) => Math.round(item.main.temp));
  const humidities = data.list.map((item) => item.main.humidity);

  const tempHighest = temperatures.reduce(
    (max, temp) => (temp > max ? temp : max),
    temperatures[0],
  );
  const tempLowest = temperatures.reduce(
    (min, temp) => (temp < min ? temp : min),
    temperatures[0],
  );
  const tempAverage = Math.round(
    temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length,
  );

  const humidityHighest = humidities.reduce(
    (max, hum) => (hum > max ? hum : max),
    humidities[0],
  );
  const humidityLowest = humidities.reduce(
    (min, hum) => (hum < min ? hum : min),
    humidities[0],
  );
  const humidityAverage = Math.round(
    humidities.reduce((sum, hum) => sum + hum, 0) / humidities.length,
  );

  const warmestIndex = temperatures.indexOf(tempHighest);
  const coldestIndex = temperatures.indexOf(tempLowest);

  const warmestDate = new Date(data.list[warmestIndex].dt * 1000);
  const coldestDate = new Date(data.list[coldestIndex].dt * 1000);

  const formatDateTime = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  document.getElementById('tempHighest').textContent = tempHighest;
  document.getElementById('tempAverage').textContent = tempAverage;
  document.getElementById('tempLowest').textContent = tempLowest;

  document.getElementById('humidityHighest').textContent = humidityHighest;
  document.getElementById('humidityAverage').textContent = humidityAverage;
  document.getElementById('humidityLowest').textContent = humidityLowest;

  document.getElementById('warmestTime').textContent =
    `${formatDateTime(warmestDate)} (${tempHighest}°C)`;
  document.getElementById('coldestTime').textContent =
    `${formatDateTime(coldestDate)} (${tempLowest}°C)`;
}

async function fetchWeatherData(city = 'Skopje') {
  const apiKey = '';
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&APPID=${apiKey}`;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Weather data:', data);

    renderStatistics(data);
    renderHourlyWeatherTable(data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

fetchWeatherData();
