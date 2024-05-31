# Weather App

Welcome to the Weather App! This application allows users to enter a location and view the current weather conditions along with a 5-day weather forecast. Built using Next.js, TypeScript, and Tailwind CSS, this app provides a responsive and accessible user experience. Below is a comprehensive overview of the functionalities and the steps involved in building this application.

## Description

The Weather App provides the following features:
- **User Input for Location:** A form where users can input the desired location.
- **Current Weather Conditions:** Display the current weather conditions including temperature, humidity, wind speed, and more for the entered location.
- **5-Day Weather Forecast:** Display a 5-day weather forecast including daily high and low temperatures, weather descriptions, and icons.
- **Server-side API Integration:** Securely fetch weather data from a free weather API using Next.js API routes.
- **Responsive and Accessible UI:** Implement responsive design and accessibility features using Tailwind CSS.
- **Error Handling:** Gracefully handle errors related to API requests and display user-friendly messages.

## Features and Implementation

### Frontend

#### Next.js and TypeScript
- **Project Setup:** Created a new Next.js project with TypeScript support.
- **Type Definitions:** Defined TypeScript interfaces for weather data to ensure type safety and improve code maintainability.

#### Tailwind CSS
- **Styling:** Utilized Tailwind CSS for styling the application. Ensured a clean and modern design that is both responsive and accessible.

#### User Input Form
- **Form Implementation:** Implemented a form for users to enter the location they want to check the weather for. The form includes validation to ensure valid input.

### Backend/API

#### Server-side API Integration
- **API Routes:** Implemented server-side API routes in Next.js to securely fetch weather data from OpenWeatherMap API.
- **Data Fetching:** Used `fetch` to call the weather API and handle responses. Ensured that sensitive API keys are not exposed in the client-side code.

### Deployment

#### Hosting Platform
- **Deployment:** Deployed the application to Vercel, ensuring it is accessible online.

### Bonus Points (Optional)

#### Error Handling
- **API Request Handling:** Implemented error handling for API requests to manage network errors, invalid responses, and other issues.
- **User Feedback:** Provided user-friendly error messages when something goes wrong.

#### Responsive and Accessible UI
- **Responsiveness:** Ensured the application is responsive and works well on different screen sizes.
- **Accessibility:** Followed accessibility best practices to make the app usable for all users, including those using assistive technologies.

## Project Structure

- **Components:**
  - `Navbar`: The navigation bar.
  - `Container`: A reusable container component for layout consistency.
  - `WeatherIcon`: A component to display weather icons.
  - `WeatherDetails`: Displays detailed weather information.
  - `ForecastWeatherDetail`: Displays weather forecast details for each day.
  
- **Utilities:**
  - `convertKelvinToCelsius`: Utility function to convert temperatures from Kelvin to Celsius.
  - `getDayOrNightIcon`: Function to determine whether to show day or night icons based on the time.
  - `metersToKilometers`: Converts visibility from meters to kilometers.
  - `convertWindSpeed`: Converts wind speed to the desired units.

- **API Integration:**
  - Utilized OpenWeatherMap API for fetching weather data.

## How to Run the Project

1. **Clone the Repository:**
   ```bash
   git clone <repository_url>
   cd weather-app
