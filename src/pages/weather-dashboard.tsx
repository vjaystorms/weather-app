import { Button } from '@/components/ui/button'
import { AlertCircle, AlertTriangle, MapPin, RefreshCw } from 'lucide-react'
import { useGeolocation } from '@/hooks/use-geolocation'
import WeatherSkeleton from '@/components/loading-skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useForecastQuery, useReverseGeocodeQuery, useWeatherQuery } from '@/hooks/use-weather'
import { CurrentWeather } from '@/components/current-weather'
import HourlyTemprature from '@/components/hourly-temprature'
import WeatherDetails from '@/components/weather-details'
import WeatherForcast from '@/components/weather-forecast'
import { FavoriteCities } from '@/components/favorite-cities'
console.log(import.meta.env.VITE_TEST_KEY);


const WeatherDashboard = () => {
  const { coordinates,
    error: locationError,
    getLocation,
    isLoading: locationLoading
  } = useGeolocation()
  console.log(coordinates)

  const locationQuery = useReverseGeocodeQuery(coordinates)
const forcasteQuery = useForecastQuery(coordinates)
const weatherQuery = useWeatherQuery(coordinates)

  const handleRefresh = () => {
    getLocation();
    if (coordinates) {
      weatherQuery.refetch();
      forcasteQuery.refetch();
      locationQuery.refetch();
    }

  }
  if (locationLoading) {
    return <WeatherSkeleton />
  }
  if (locationError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Location Error</AlertTitle>
        <AlertDescription className='flex flex-col gap-4'>
          <p>{locationError}</p>
          <Button onClick={getLocation} variant={"outline"} className='w-fit'>
            <MapPin className="mr-2 h-4 w-4" />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (!coordinates) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Location Error</AlertTitle>
        <AlertDescription className='flex flex-col gap-4'>
          <p>Please enable location access to see your local weather.</p>
          <Button onClick={getLocation} variant={"outline"} className='w-fit'>
            <MapPin className="mr-2 h-4 w-4" />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  const locationName = locationQuery.data?.[0];
  if (weatherQuery.error || forcasteQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle> Error</AlertTitle>
        <AlertDescription className='flex flex-col gap-4'>
          <p>Unable to fetch weather data. Please try again later.</p>
          <Button onClick={handleRefresh} variant={"outline"} className='w-fit'>
            <RefreshCw className="mr-2 h-4 w-4" />
            retry
          </Button>
        </AlertDescription>
      </Alert>
    )
  }
  if (!weatherQuery.data || !forcasteQuery.data) {
    return <WeatherSkeleton />
  }

  return (
    <div className='space-y-4'>
      {/* Favourite cities */}
      <FavoriteCities />
      <div className='flex items-center justify-between'>
        <h1 className='text-xl font-bold tracking-tight'>My Location</h1>
        <Button
          variant="outline"
          size="icon"
        onClick={handleRefresh}
        disabled={weatherQuery.isFetching || forcasteQuery.isFetching}
        >
        <RefreshCw className={`h-4 w-4 ${
          weatherQuery.isFetching ? 'animate-spin' : ''
        }`} 
        />
        </Button>
      </div>

      <div className='grid gap-6'>
        <div className='flex flex-col lg:flex-row gap-4'>
          <CurrentWeather
          data={weatherQuery.data}
          locationName={locationName}/>
          <HourlyTemprature data={forcasteQuery.data}/>
        </div>
        <div className='grid gap-6 md:grid-cols-2 items-start'>
          {/* details */}
          <WeatherDetails data={weatherQuery.data}/>
          {/* forcast */}
          <WeatherForcast data={forcasteQuery.data} />
        </div>
      </div>
    </div>
  )
}

export default WeatherDashboard