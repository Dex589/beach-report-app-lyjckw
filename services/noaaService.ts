
import { BeachConditions, TideInfo } from '@/types/beach';

// NOAA API endpoints
const NOAA_TIDES_API = 'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter';
const NOAA_WEATHER_API = 'https://api.weather.gov/points';

// Station IDs for each beach location
export const NOAA_STATIONS: Record<string, { 
  tideStation: string; 
  weatherLat: number; 
  weatherLon: number;
}> = {
  '1': { tideStation: '8723214', weatherLat: 25.7907, weatherLon: -80.1300 }, // Miami Beach
  '2': { tideStation: '8726724', weatherLat: 27.9659, weatherLon: -82.8001 }, // Clearwater Beach
  '3': { tideStation: '8726724', weatherLat: 27.8964, weatherLon: -82.8426 }, // Indian Rocks Beach
  '4': { tideStation: '8726724', weatherLat: 28.0089, weatherLon: -82.8065 }, // Caladesi Island
  '5': { tideStation: '8726724', weatherLat: 27.9192, weatherLon: -82.8376 }, // Belleair Beach
  '6': { tideStation: '8726724', weatherLat: 27.8506, weatherLon: -82.8426 }, // Indian Shores
  '7': { tideStation: '9410660', weatherLat: 34.0195, weatherLon: -118.4912 }, // Santa Monica Beach
  '8': { tideStation: '9410660', weatherLat: 33.9850, weatherLon: -118.4695 }, // Venice Beach
  '9': { tideStation: '9410660', weatherLat: 34.0259, weatherLon: -118.7798 }, // Malibu Beach
  '10': { tideStation: '9410580', weatherLat: 33.6595, weatherLon: -117.9988 }, // Huntington Beach
};

interface NOAAWaterLevelData {
  t: string; // time
  v: string; // value
}

interface NOAATideData {
  t: string; // time
  v: string; // value
  type: string; // H or L
}

interface NOAAWeatherData {
  properties: {
    temperature?: {
      value: number;
    };
    relativeHumidity?: {
      value: number;
    };
    windSpeed?: {
      value: number;
    };
    windDirection?: {
      value: number;
    };
  };
}

/**
 * Fetch water level (tide) data from NOAA
 */
export const fetchWaterLevel = async (stationId: string): Promise<number | null> => {
  try {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
    
    const url = `${NOAA_TIDES_API}?date=latest&station=${stationId}&product=water_level&datum=MLLW&time_zone=lst_ldt&units=english&format=json`;
    
    console.log('Fetching water level from NOAA:', url);
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      const latestReading = data.data[0] as NOAAWaterLevelData;
      return parseFloat(latestReading.v);
    }
    
    console.log('No water level data available');
    return null;
  } catch (error) {
    console.error('Error fetching water level:', error);
    return null;
  }
};

/**
 * Fetch tide predictions from NOAA
 */
export const fetchTidePredictions = async (stationId: string): Promise<TideInfo[]> => {
  try {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const beginDate = now.toISOString().split('T')[0].replace(/-/g, '');
    const endDate = tomorrow.toISOString().split('T')[0].replace(/-/g, '');
    
    const url = `${NOAA_TIDES_API}?begin_date=${beginDate}&end_date=${endDate}&station=${stationId}&product=predictions&datum=MLLW&time_zone=lst_ldt&units=english&interval=hilo&format=json`;
    
    console.log('Fetching tide predictions from NOAA:', url);
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.predictions && data.predictions.length > 0) {
      return data.predictions.slice(0, 4).map((pred: NOAATideData) => {
        const time = new Date(pred.t);
        const formattedTime = time.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        });
        
        return {
          time: formattedTime,
          type: pred.type === 'H' ? 'High Tide' : 'Low Tide',
          height: parseFloat(pred.v),
        } as TideInfo;
      });
    }
    
    console.log('No tide prediction data available');
    return [];
  } catch (error) {
    console.error('Error fetching tide predictions:', error);
    return [];
  }
};

/**
 * Fetch water temperature from NOAA
 */
export const fetchWaterTemperature = async (stationId: string): Promise<number | null> => {
  try {
    const url = `${NOAA_TIDES_API}?date=latest&station=${stationId}&product=water_temperature&time_zone=lst_ldt&units=english&format=json`;
    
    console.log('Fetching water temperature from NOAA:', url);
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      const latestReading = data.data[0] as NOAAWaterLevelData;
      return parseFloat(latestReading.v);
    }
    
    console.log('No water temperature data available');
    return null;
  } catch (error) {
    console.error('Error fetching water temperature:', error);
    return null;
  }
};

/**
 * Fetch air temperature from NOAA
 */
export const fetchAirTemperature = async (stationId: string): Promise<number | null> => {
  try {
    const url = `${NOAA_TIDES_API}?date=latest&station=${stationId}&product=air_temperature&time_zone=lst_ldt&units=english&format=json`;
    
    console.log('Fetching air temperature from NOAA:', url);
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      const latestReading = data.data[0] as NOAAWaterLevelData;
      return parseFloat(latestReading.v);
    }
    
    console.log('No air temperature data available');
    return null;
  } catch (error) {
    console.error('Error fetching air temperature:', error);
    return null;
  }
};

/**
 * Fetch wind data from NOAA
 */
export const fetchWindData = async (stationId: string): Promise<{ speed: number; direction: string } | null> => {
  try {
    const url = `${NOAA_TIDES_API}?date=latest&station=${stationId}&product=wind&time_zone=lst_ldt&units=english&format=json`;
    
    console.log('Fetching wind data from NOAA:', url);
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.data && data.data.length > 0) {
      const latestReading = data.data[0];
      const speed = parseFloat(latestReading.s); // wind speed
      const directionDegrees = parseFloat(latestReading.d); // wind direction in degrees
      
      // Convert degrees to cardinal direction
      const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
      const index = Math.round(directionDegrees / 22.5) % 16;
      const direction = directions[index];
      
      return { speed, direction };
    }
    
    console.log('No wind data available');
    return null;
  } catch (error) {
    console.error('Error fetching wind data:', error);
    return null;
  }
};

/**
 * Fetch weather data from NWS API
 */
export const fetchWeatherData = async (lat: number, lon: number): Promise<any> => {
  try {
    // First, get the grid point
    const pointUrl = `${NOAA_WEATHER_API}/${lat.toFixed(4)},${lon.toFixed(4)}`;
    console.log('Fetching weather grid point:', pointUrl);
    
    const pointResponse = await fetch(pointUrl, {
      headers: {
        'User-Agent': 'BeachReportApp/1.0',
      },
    });
    
    if (!pointResponse.ok) {
      console.log('Weather API point request failed:', pointResponse.status);
      return null;
    }
    
    const pointData = await pointResponse.json();
    const forecastUrl = pointData.properties.forecast;
    
    // Get the forecast
    console.log('Fetching weather forecast:', forecastUrl);
    const forecastResponse = await fetch(forecastUrl, {
      headers: {
        'User-Agent': 'BeachReportApp/1.0',
      },
    });
    
    if (!forecastResponse.ok) {
      console.log('Weather API forecast request failed:', forecastResponse.status);
      return null;
    }
    
    const forecastData = await forecastResponse.json();
    
    if (forecastData.properties && forecastData.properties.periods && forecastData.properties.periods.length > 0) {
      return forecastData.properties.periods[0];
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
};

/**
 * Calculate UV index based on time of day and location
 * This is a simplified calculation - in production, use a dedicated UV API
 */
const calculateUVIndex = (lat: number): number => {
  const now = new Date();
  const hour = now.getHours();
  
  // UV is highest between 10am and 4pm
  if (hour < 6 || hour > 18) return 0;
  if (hour < 10 || hour > 16) return 3;
  
  // Higher UV closer to equator
  const latFactor = 1 + (Math.abs(lat) / 90);
  const baseUV = 8;
  
  return Math.min(11, Math.round(baseUV * latFactor));
};

/**
 * Get UV guide text based on UV index
 */
const getUVGuide = (uvIndex: number): string => {
  if (uvIndex <= 2) return 'Low - Minimal protection needed';
  if (uvIndex <= 5) return 'Moderate - Wear sunscreen';
  if (uvIndex <= 7) return 'High - Wear sunscreen and hat';
  if (uvIndex <= 10) return 'Very High - Extra protection needed';
  return 'Extreme - Avoid sun exposure';
};

/**
 * Calculate sunrise and sunset times
 * This is a simplified calculation - in production, use a dedicated sun times API
 */
const calculateSunTimes = (lat: number, lon: number): { sunrise: string; sunset: string } => {
  // This is a very simplified calculation
  // In production, use a library like suncalc or an API
  const now = new Date();
  const sunrise = new Date(now);
  sunrise.setHours(7, 18, 0);
  
  const sunset = new Date(now);
  sunset.setHours(18, 53, 0);
  
  return {
    sunrise: sunrise.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
    sunset: sunset.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
  };
};

/**
 * Determine tide status based on current and predicted tides
 */
const determineTideStatus = (currentTide: number, predictions: TideInfo[]): 'Rising' | 'Falling' | 'High' | 'Low' => {
  if (predictions.length < 2) return 'Rising';
  
  const nextTide = predictions[0];
  
  if (nextTide.type === 'High Tide') {
    return currentTide > nextTide.height * 0.9 ? 'High' : 'Rising';
  } else {
    return currentTide < nextTide.height * 1.1 ? 'Low' : 'Falling';
  }
};

/**
 * Determine flag warning based on conditions
 */
const determineFlagWarning = (
  surfHeight: number,
  windSpeed: number,
  uvIndex: number
): { flag: 'green' | 'yellow' | 'red' | 'purple'; text: string } => {
  // Red flag conditions
  if (surfHeight > 4 || windSpeed > 25) {
    return {
      flag: 'red',
      text: 'Dangerous conditions - High surf or strong winds',
    };
  }
  
  // Yellow flag conditions
  if (surfHeight > 2.5 || windSpeed > 15 || uvIndex > 8) {
    return {
      flag: 'yellow',
      text: 'Caution - Moderate surf or wind',
    };
  }
  
  // Green flag - safe conditions
  return {
    flag: 'green',
    text: 'Safe conditions - No hazards',
  };
};

/**
 * Fetch complete beach conditions from NOAA APIs
 */
export const fetchBeachConditions = async (beachId: string): Promise<BeachConditions | null> => {
  try {
    const stationInfo = NOAA_STATIONS[beachId];
    
    if (!stationInfo) {
      console.error('No NOAA station info for beach:', beachId);
      return null;
    }
    
    console.log(`Fetching conditions for beach ${beachId} from station ${stationInfo.tideStation}`);
    
    // Fetch all data in parallel
    const [
      waterLevel,
      tidePredictions,
      waterTemp,
      airTemp,
      windData,
      weatherData,
    ] = await Promise.all([
      fetchWaterLevel(stationInfo.tideStation),
      fetchTidePredictions(stationInfo.tideStation),
      fetchWaterTemperature(stationInfo.tideStation),
      fetchAirTemperature(stationInfo.tideStation),
      fetchWindData(stationInfo.tideStation),
      fetchWeatherData(stationInfo.weatherLat, stationInfo.weatherLon),
    ]);
    
    // Calculate derived values
    const uvIndex = calculateUVIndex(stationInfo.weatherLat);
    const uvGuide = getUVGuide(uvIndex);
    const sunTimes = calculateSunTimes(stationInfo.weatherLat, stationInfo.weatherLon);
    
    // Use weather data if available
    let finalAirTemp = airTemp || 75;
    let finalWindSpeed = windData?.speed || 10;
    let finalWindDirection = windData?.direction || 'E';
    let humidity = 60;
    
    if (weatherData) {
      if (weatherData.temperature) {
        // Convert Celsius to Fahrenheit if needed
        finalAirTemp = weatherData.temperature;
      }
      if (weatherData.windSpeed) {
        // Parse wind speed (e.g., "10 mph" or "10 to 15 mph")
        const windMatch = weatherData.windSpeed.match(/(\d+)/);
        if (windMatch) {
          finalWindSpeed = parseInt(windMatch[1]);
        }
      }
      if (weatherData.windDirection) {
        finalWindDirection = weatherData.windDirection;
      }
      if (weatherData.relativeHumidity && weatherData.relativeHumidity.value) {
        humidity = weatherData.relativeHumidity.value;
      }
    }
    
    // Estimate surf height (simplified - in production, use a surf forecast API)
    const surfHeight = 1 + Math.random() * 2;
    
    // Determine tide status
    const currentTide = waterLevel || 1.5;
    const tideStatus = determineTideStatus(currentTide, tidePredictions);
    
    // Determine flag warning
    const flagWarning = determineFlagWarning(surfHeight, finalWindSpeed, uvIndex);
    
    const conditions: BeachConditions = {
      beachId,
      waterTemp: waterTemp || 72,
      surfHeight,
      currentTide,
      tideStatus,
      airTemp: finalAirTemp,
      windSpeed: finalWindSpeed,
      windDirection: finalWindDirection,
      humidity,
      uvIndex,
      uvGuide,
      sunrise: sunTimes.sunrise,
      sunset: sunTimes.sunset,
      currentConditions: weatherData?.shortForecast || 'Good conditions',
      flagWarning: flagWarning.flag,
      flagWarningText: flagWarning.text,
      lastUpdated: new Date().toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      }),
    };
    
    console.log('Successfully fetched beach conditions:', conditions);
    return conditions;
    
  } catch (error) {
    console.error('Error fetching beach conditions:', error);
    return null;
  }
};

/**
 * Fetch tide schedule for a beach
 */
export const fetchTideSchedule = async (beachId: string): Promise<TideInfo[]> => {
  try {
    const stationInfo = NOAA_STATIONS[beachId];
    
    if (!stationInfo) {
      console.error('No NOAA station info for beach:', beachId);
      return [];
    }
    
    return await fetchTidePredictions(stationInfo.tideStation);
  } catch (error) {
    console.error('Error fetching tide schedule:', error);
    return [];
  }
};
