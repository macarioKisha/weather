import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface WeatherData {
  current: {
    temperature: number;
    weather_descriptions: string[];
    weather_icons: string[];
  };
  location: {
    name: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class Services {
  private apiKey = '5e9a089cb0faf5f6b1ec8b211a019737';
  private baseUrl = 'http://api.weatherstack.com/current';

  constructor(private http: HttpClient) {}

  getWeather(city: string): Observable<WeatherData> {
    const url = `${this.baseUrl}?access_key=${this.apiKey}&query=${encodeURIComponent(city)}`;
    return this.http.get<WeatherData>(url);
  }
}
