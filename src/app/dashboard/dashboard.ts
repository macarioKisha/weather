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
    if (!this.cityInput.trim()) {
      return;
    }

    if (this.cities.some(c => c.city.toLowerCase() === this.cityInput.toLowerCase())) {
      this.apiError = 'City is already added to the dashboard';
      return;
    }

    const newCity: CityWeather = { city: this.cityInput };
    this.cities.push(newCity);
    
    this.weatherService.getWeather(this.cityInput).subscribe({
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
