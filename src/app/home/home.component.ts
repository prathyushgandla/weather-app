import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HomeService } from './home.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  city = new FormControl('',{
  validators: [Validators.required, Validators.minLength(2)],
    });

  weatherData: any;
  weatherIcon: string = '';
  backgroundImage: string = '';
  apiErrorMessage: any = '';
  isSunny : boolean = false;

  constructor(private weatherService: HomeService){}

  fetchWeather(){
    const inputData = this.city.value;
    this.apiErrorMessage = null;
    this.weatherData = null;
    this.isSunny = false
    this.weatherService.getWeather(inputData).
    subscribe({
      next: (response:any) => {
        this.weatherData = response;
        this.setWeatherIcon(response.weather[0].main, response.sys.sunrise, response.sys.sunset);
        this.setBackgroundImage(response.weather[0].main, response.sys.sunrise, response.sys.sunset);
        console.log("data: " ,response);

      },
      error: (err:any) => {
        console.log("Error: " ,err);
        this.weatherData = null; // Clear existing data
        this.apiErrorMessage = err.message;
      },
    });
    // subscribe((data:any)=>{
    //   this.weatherData = data;
    //   this.setWeatherIcon(data.weather[0].main, data.sys.sunrise, data.sys.sunset);
    //   this.setBackgroundImage(data.weather[0].main, data.sys.sunrise, data.sys.sunset);
    //   console.log("data: " ,data);
    // })
  }

  setWeatherIcon(main: string, sunrise: number, sunset: number) {
    const currentTime = Math.floor(Date.now() / 1000); // Current time in UNIX timestamp
    const isDaytime = currentTime >= sunrise && currentTime <= sunset;

    if (main === 'Clear') {
      // Use sunny icon for day and clear-night icon for night
      this.weatherIcon = isDaytime
        ? '/sunny_weather_icon.png'  // Daytime sunny icon
        : '/moon_night_icon.png'; // Nighttime clear-night icon
    } else if (main === 'Rain') {
      // Use the same icon for rain and thunderstorm, regardless of day or night
      this.weatherIcon = '/rain_weather_icon.png';
    } else if (main === 'Thunderstorm') {
      // Use the same icon for rain and thunderstorm, regardless of day or night
      this.weatherIcon = '/rain_storm_thunderbolt_icon.png';
    }
    else if (isDaytime) {
      this.weatherIcon = '/sunny_weather_icon.png';
    }
    else if (!isDaytime) {
      this.weatherIcon = '/moon_night_icon.png';
    }
  }

  setBackgroundImage(main: string, sunrise: number, sunset: number){
    const currentTime = Math.floor(Date.now() / 1000); // Current time in UNIX timestamp
    const isDaytime = currentTime >= sunrise && currentTime <= sunset;

    if (main === 'Clear') {
      // Use sunny icon for day and clear-night icon for night
      this.backgroundImage = isDaytime
        ? 'url(/sunny.jpg)'  // Daytime sunny icon
        : 'url(/night.jpg)'; // Nighttime clear-night icon
        this.isSunny = isDaytime ? true : false;
    } else if (main === 'Rain' || main === 'Light Rain') {
      // Use the same icon for rain and thunderstorm, regardless of day or night
      this.backgroundImage = 'url(/rainy.jpg)';
    } else if (main === 'Thunderstorm') {
      // Use the same icon for rain and thunderstorm, regardless of day or night
      this.backgroundImage = 'url(/thundeStorm.jpg)';
    }
    else if (isDaytime) {
      this.backgroundImage = 'url(/sunny.jpg)';
      this.isSunny = true;
    }
    else if (!isDaytime) {
      this.backgroundImage = 'url(/night.jpg)';
    }
  }

  getErrorMessage() {
    if (this.city.hasError('required')) {
      return 'City name is required.';
    }
    if (this.city.hasError('minlength')) {
      return 'City name must be at least 3 characters.';
    }
    return '';
  }
}
