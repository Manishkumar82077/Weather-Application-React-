# Weather Dashboard Application

Welcome to the Weather Dashboard Application! This project is built using React, Tailwind CSS, and the OpenWeather API. The application allows users to search for the current weather in various locations and get weather updates based on their current location.

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [API Keys](#api-keys)
  - [Running the Application](#running-the-application)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- Search weather by city name.
- Get weather updates for the current location.
- Dynamic background color changes based on the temperature.
- Responsive design using Tailwind CSS.

## Demo

A live demo of the application can be found [here](https://weather-application-react-bv7k.vercel.app/).

## Screenshot

![Screenshot](assets/Screenshot.png)  <!-- Update this path to where you placed the screenshot in your repo -->

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher) or yarn (v1.22 or higher)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/Manishkumar82077/weather-dashboard.git
    ```

2. Navigate to the project directory:

    ```bash
    cd weather-dashboard
    ```

3. Install the dependencies:

    ```bash
    npm install
    ```

    or

    ```bash
    yarn install
    ```

### API Keys

1. Sign up on [OpenWeatherMap](https://openweathermap.org/api) to get your API key.
2. Sign up on [Geoapify](https://www.geoapify.com/) to get your API key.

### Running the Application

1. Create a `.env` file in the root directory of the project and add your API keys:

    ```env
    REACT_APP_OPENWEATHERMAP_API_KEY=your_openweathermap_api_key
    REACT_APP_GEOAPIFY_API_KEY=your_geoapify_api_key
    ```

2. Start the development server:

    ```bash
    npm start
    ```

    or

    ```bash
    yarn start
    ```

3. Open your browser and go to `http://localhost:3000`.

## Usage

- Enter a city name in the search bar to get the current weather.
- Click the "Current Location" button to get the weather for your current location.
- Observe the dynamic background color change based on the temperature.

## Technologies Used

- **React**: JavaScript library for building user interfaces
- **Tailwind CSS**: Utility-first CSS framework
- **OpenWeather API**: Weather data provider
- **Geoapify API**: Geolocation and mapping services

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

- **Manish Kumar**
  - Email: [manishkumar7543811190@gmail.com](mailto:manishkumar7543811190@gmail.com)
  - LinkedIn: [Manish Kumar](https://www.linkedin.com/in/manish-kumar-5781bb1b8/)
  - GitHub: [Manishkumar82077](https://github.com/Manishkumar82077)

Thank you for using the Weather Dashboard Application! If you have any questions or feedback, feel free to reach out.
