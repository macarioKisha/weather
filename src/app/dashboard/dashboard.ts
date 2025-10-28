import { Component } from '@angular/core';
import { Services, WeatherData } from '../function/services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CityWeather {
  city: string;
  weather?: WeatherData;
  error?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  cityInput = '';
  cities: CityWeather[] = [];
  displayCount: string = 'all';
  temperatureFilter: 'all' | 'hot' | 'cold' = 'all';
  apiError = '';

  constructor(private weatherService: Services) {}

  addCity() {
    this.apiError = '';
    const normalizedInput = this.cityInput.trim().toLowerCase();

    if (!normalizedInput) {
      return;
    }

    if (this.cities.some(c => c.city.toLowerCase() === normalizedInput)) {
      this.apiError = 'City is already added to the dashboard';
      return;
    }

    // Store the original input with proper capitalization
    const formattedCity = this.cityInput.trim().charAt(0).toUpperCase() +
                         this.cityInput.trim().slice(1).toLowerCase();

    const newCity: CityWeather = { city: formattedCity };
    this.cities.push(newCity);

    this.weatherService.getWeather(formattedCity).subscribe({
      next: (data) => {
        newCity.weather = data;
      },
      error: (error) => {
        newCity.error = 'Failed to load weather data';
        console.error('Weather API error:', error);
        this.apiError = 'Failed to fetch weather data. Please check the city name and try again.';
      }
    });

    this.cityInput = '';
  }

  removeCity(index: number) {
    this.cities.splice(index, 1);
  }

  removeCityByName(name: string) {
    const idx = this.cities.findIndex(c => c.city.toLowerCase() === name.toLowerCase());
    if (idx > -1) {
      this.cities.splice(idx, 1);
    }
  }

  filteredCities(): CityWeather[] {
    let filtered = [...this.cities];

    if (this.temperatureFilter !== 'all') {
      filtered = filtered.filter(city => {
        if (!city.weather) return true;
        const temp = city.weather.current.temperature;
        return this.temperatureFilter === 'hot' ? temp > 20 : temp <= 20;
      });
    }

    if (this.displayCount !== 'all') {
      const count = parseInt(this.displayCount);
      filtered = filtered.slice(0, count);
    }

    return filtered;
  }
}
