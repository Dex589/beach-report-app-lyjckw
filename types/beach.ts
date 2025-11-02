
export interface Beach {
  id: string;
  name: string;
  location: string;
  state: string;
  latitude: number;
  longitude: number;
  image: any; // Can be either a URL string or local image using require()
  distance?: number;
  isFavorite?: boolean;
  cameraLink?: string; // Optional live camera link
}

export interface BeachConditions {
  beachId: string;
  waterTemp: number;
  surfHeight: number;
  currentTide: number;
  tideStatus: 'Rising' | 'Falling' | 'High' | 'Low';
  airTemp: number;
  windSpeed: number;
  windDirection: string;
  humidity: number;
  uvIndex: number;
  uvGuide: string;
  sunrise: string;
  sunset: string;
  liveCameraUrl?: string;
  currentConditions: string;
  flagWarning: 'green' | 'yellow' | 'red' | 'purple';
  flagWarningText: string;
  lastUpdated: string;
  forecastHighTemp: number;
  forecastLowTemp: number;
  forecastPrecipitation: number;
  forecastConditions: string;
}

export interface TideInfo {
  time: string;
  type: 'High Tide' | 'Low Tide';
  height: number;
}
