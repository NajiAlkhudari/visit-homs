'use client';

import React from 'react';
import useWeather from '../hooks/useWeather';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm } from 'react-icons/wi';
import { useTranslations } from 'next-intl';

const weatherIcons = {
  0: <WiDaySunny size={32} />,
  1: <WiDaySunny size={32} />,
  2: <WiCloudy size={32} />,
  3: <WiCloudy size={32} />,
  45: <WiCloudy size={32} />,
  48: <WiCloudy size={32} />,
  51: <WiRain size={32} />,
  53: <WiRain size={32} />,
  55: <WiRain size={32} />,
  56: <WiRain size={32} />,
  57: <WiRain size={32} />,
  61: <WiRain size={32} />,
  63: <WiRain size={32} />,
  65: <WiRain size={32} />,
  66: <WiRain size={32} />,
  67: <WiRain size={32} />,
  71: <WiSnow size={32} />,
  73: <WiSnow size={32} />,
  75: <WiSnow size={32} />,
  77: <WiSnow size={32} />,
  80: <WiRain size={32} />,
  81: <WiRain size={32} />,
  82: <WiRain size={32} />,
  85: <WiSnow size={32} />,
  86: <WiSnow size={32} />,
  95: <WiThunderstorm size={32} />,
  96: <WiThunderstorm size={32} />,
  99: <WiThunderstorm size={32} />,
};

const WeatherDashboard = () => {
  const { weather, loading, error } = useWeather();
    const t = useTranslations();
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const { current_weather, hourly, daily } = weather;

  return (
    <>
    <div className="space-y-6 max-w-9xl mx-auto  ">
      
      <Card className="w-full bg-gray-100">
        <CardHeader>
<CardTitle>{t('current')}</CardTitle>

        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center justify-between">
            <div className=" text-4xl font-bold ">{current_weather.temperature}°C</div>
            <div className="text-green-700 text-6xl">{weatherIcons[current_weather.weathercode]}</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className=" text-sm text-muted-foreground">{t('Humidity')}</div>
              <div className='text-green-700'>{hourly.relativehumidity_2m[0]}%</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">{t('WindSpeed')}</div>
              <div className='text-green-700'>{current_weather.windspeed} km/h</div>
            </div>
          </div>
        
        </CardContent>
        
      </Card>

    </div>
 
                            <hr className="h-1 bg-green-700 border-0" /> 

    </>
  );
};

export default WeatherDashboard;
 