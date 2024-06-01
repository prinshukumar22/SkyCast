"use client";
import { useQuery } from "@tanstack/react-query";
import Navbar from "./components/Navbar";
import { format, fromUnixTime, parseISO } from "date-fns";
import Container from "./components/Container";
import { convertKelvinToCelsius } from "./utils/kelvintocelcius";
import WeatherIcon from "./components/WeatherIcon";
import WeatherDetails from "./components/WeatherDetails";
import ForecastWeatherDetail from "./components/ForecastWeatherDetail";
import { getDayOrNightIcon } from "./utils/getDayOrNightIcon";
import { metersToKilometers } from "./utils/mtrtokm";
import { convertWindSpeed } from "./utils/convertWindSpeed";
import { loadingCityAtom, placeAtom } from "./atom";
import { useAtom } from "jotai";
import { useEffect } from "react";

// https://api.openweathermap.org/data/2.5/weather?q=delhi&appid=91ef7d3e6d66c5135dfd8520e5d641e9

// api.openweathermap.org/data/2.5/forecast/daily?q=delhi&cnt=7&appid=91ef7d3e6d66c5135dfd8520e5d641e9

// https://api.openweathermap.org/data/2.5/forecast?q=delhi&appid=91ef7d3e6d66c5135dfd8520e5d641e9&cnt=56

interface WeatherDetail {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number;
  sys: {
    pod: string;
  };
  dt_txt: string;
}

interface WeatherData {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherDetail[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

type Props = {};

//! function to fetch forecast of 5 days
function getDailyForecasts(weatherData: any) {
  const dailyForecasts = [];
  const seenDays = new Set();

  for (const forecast of weatherData.list) {
    const date = forecast.dt_txt.split(" ")[0]; // Extract the date part (YYYY-MM-DD)

    if (!seenDays.has(date)) {
      seenDays.add(date);
      dailyForecasts.push(forecast);
    }

    if (dailyForecasts.length === 6) {
      break;
    }
  }

  return dailyForecasts;
}

const App = (props: Props) => {
  //!jotai for global state management
  const [place, setPlace] = useAtom(placeAtom);
  const [loadingCity] = useAtom(loadingCityAtom);

  //! useQuery to fetch data from api
  const {
    isPending: isLoading,
    error,
    data: weatherData,
    refetch,
  } = useQuery<WeatherData>({
    queryKey: ["repoData"],
    queryFn: () =>
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=91ef7d3e6d66c5135dfd8520e5d641e9&cnt=56`
      ).then((res) => res.json()),
  });

  useEffect(() => {
    refetch();
  }, [place, refetch]);

  console.log(weatherData);
  // Ensure weatherData is defined before accessing its properties
  const firstData = weatherData?.list?.[0];

  // Filter data to get the first entry after 6 AM for each unique date
  const firstDataForEachDate = weatherData
    ? getDailyForecasts(weatherData)
    : [];

  //!error handling
  if (isLoading)
    return (
      <div className="flex items-center min-h-screen justify-center">
        <p className="animate-bounce font-bold text-3xl">Loading...</p>
      </div>
    );

  if (error) return "An error has occurred: " + error?.message;
  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen">
      <Navbar location={weatherData?.city.name} />
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9 w-full pb-10 pt-4">
        {loadingCity ? (
          <WeatherSkeleton />
        ) : (
          <>
            <section className="space-y-4">
              <div className="space-y-2">
                <h2 className="flex gap-1 text-2xl items-end">
                  <p>{format(parseISO(firstData?.dt_txt ?? ""), "EEEE")}</p>
                  <p className="text-lg">
                    ({format(parseISO(firstData?.dt_txt ?? ""), "dd.MM.yyyy")})
                  </p>
                </h2>
                <Container className="gap-10 px-6 items-center">
                  <div className="flex flex-col px-4">
                    <span className="text-5xl">
                      {convertKelvinToCelsius(firstData?.main.temp ?? 296.37)}°
                    </span>
                    <p className="text-xs space-x-1 whitespace-nowrap">
                      <span> Feels like</span>
                      <span>
                        {convertKelvinToCelsius(
                          firstData?.main.feels_like ?? 0
                        )}
                        °
                      </span>
                    </p>
                    <p className="text-xs space-x-2">
                      <span>
                        {convertKelvinToCelsius(firstData?.main.temp_min ?? 0)}
                        °↓{" "}
                      </span>
                      <span>
                        {" "}
                        {convertKelvinToCelsius(firstData?.main.temp_max ?? 0)}
                        °↑
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
                    {weatherData?.list.map((d: any, i: number) => (
                      <div
                        key={i}
                        className="flex flex-col justify-between gap-2 items-center text-xs font-semibold "
                      >
                        <p className="whitespace-nowrap">
                          {format(parseISO(d.dt_txt), "h:mm a")}
                        </p>
                        <WeatherIcon
                          iconName={getDayOrNightIcon(
                            d.weather[0].icon,
                            d.dt_txt
                          )}
                        />
                        <p>{convertKelvinToCelsius(d?.main.temp ?? 0)}°</p>
                      </div>
                    ))}
                  </div>
                </Container>
              </div>
              <div className="flex gap-4">
                <Container className="w-fit  justify-center flex-col px-4 items-center ">
                  <p className=" capitalize text-center">
                    {firstData?.weather[0].description}{" "}
                  </p>
                  <WeatherIcon
                    iconName={getDayOrNightIcon(
                      firstData?.weather[0].icon ?? "",
                      firstData?.dt_txt ?? ""
                    )}
                  />
                </Container>
                <Container className="bg-yellow-300/80  px-6 gap-4 justify-between overflow-x-auto">
                  <WeatherDetails
                    visability={metersToKilometers(
                      firstData?.visibility ?? 10000
                    )}
                    airPressure={`${firstData?.main.pressure} hPa`}
                    humidity={`${firstData?.main.humidity}%`}
                    sunrise={format(
                      weatherData?.city.sunrise ?? 1702949452,
                      "H:mm"
                    )}
                    // sunrise={}
                    sunset={format(
                      weatherData?.city.sunset ?? 1702517657,
                      "H:mm"
                    )}
                    windSpeed={convertWindSpeed(firstData?.wind.speed ?? 1.64)}
                  />
                </Container>
              </div>
            </section>
            <section className="flex w-full flex-col gap-4">
              <p className="text-2xl">Forecast (5 days)</p>
              {firstDataForEachDate.map((d, i) => (
                <ForecastWeatherDetail
                  key={i}
                  description={d?.weather[0].description ?? ""}
                  weatherIcon={d?.weather[0].icon ?? "01d"}
                  date={d ? format(parseISO(d.dt_txt), "dd.MM") : ""}
                  day={d ? format(parseISO(d.dt_txt), "dd.MM") : "EEEE"}
                  feels_like={d?.main.feels_like ?? 0}
                  temp={d?.main.temp ?? 0}
                  temp_max={d?.main.temp_max ?? 0}
                  temp_min={d?.main.temp_min ?? 0}
                  airPressure={`${d?.main.pressure} hPa `}
                  humidity={`${d?.main.humidity}% `}
                  sunrise={format(
                    fromUnixTime(weatherData?.city.sunrise ?? 1702517657),
                    "H:mm"
                  )}
                  sunset={format(
                    fromUnixTime(weatherData?.city.sunset ?? 1702517657),
                    "H:mm"
                  )}
                  visability={`${metersToKilometers(d?.visibility ?? 10000)} `}
                  windSpeed={`${convertWindSpeed(d?.wind.speed ?? 1.64)} `}
                />
              ))}
            </section>
          </>
        )}
      </main>
    </div>
  );
};

function WeatherSkeleton() {
  return (
    <section className="space-y-8 ">
      {/* Today's data skeleton */}
      <div className="space-y-2 animate-pulse">
        {/* Date skeleton */}
        <div className="flex gap-1 text-2xl items-end ">
          <div className="h-6 w-24 bg-gray-300 rounded"></div>
          <div className="h-6 w-24 bg-gray-300 rounded"></div>
        </div>

        {/* Time wise temperature skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div className="h-6 w-16 bg-gray-300 rounded"></div>
              <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
              <div className="h-6 w-16 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* 7 days forecast skeleton */}
      <div className="flex flex-col gap-4 animate-pulse">
        <p className="text-2xl h-8 w-36 bg-gray-300 rounded"></p>

        {[1, 2, 3, 4, 5, 6, 7].map((index) => (
          <div key={index} className="grid grid-cols-2 md:grid-cols-4 gap-4 ">
            <div className="h-8 w-28 bg-gray-300 rounded"></div>
            <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
            <div className="h-8 w-28 bg-gray-300 rounded"></div>
            <div className="h-8 w-28 bg-gray-300 rounded"></div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default App;
