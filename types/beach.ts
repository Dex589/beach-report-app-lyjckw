
export interface Beach {
  id: string;
  name: string;
  location: string;
  state: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  distance?: number;
  isFavorite?: boolean;
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
}

export interface TideInfo {
  time: string;
  type: 'High Tide' | 'Low Tide';
  height: number;
}
