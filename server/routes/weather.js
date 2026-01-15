const express = require('express');
const router = express.Router();
const https = require('https');

// Global Simulation State (In-Memory for MVP)
let simulationMode = false;
let simulatedWeather = {
    windSpeed_mph: 0,
    condition: 'CALM'
};

// Helper: Fetch Live Weather from OpenMeteo
const fetchLiveWeather = () => {
    return new Promise((resolve, reject) => {
        // Liverpool/Chester Coordinates (approx for arbtech demo)
        const url = 'https://api.open-meteo.com/v1/forecast?latitude=53.19&longitude=-2.89&current=temperature_2m,wind_speed_10m,wind_direction_10m,weathercode&wind_speed_unit=mph';

        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve({
                        windSpeed_mph: json.current.wind_speed_10m,
                        windDirection: json.current.wind_direction_10m,
                        weatherCode: json.current.weathercode,
                        condition: 'LIVE',
                        temp: json.current.temperature_2m
                    });
                } catch (e) {
                    resolve(null); // Fallback on error
                }
            });
        }).on('error', (e) => {
            console.error(e);
            resolve(null);
        });
    });
};

// GET /api/weather
router.get('/', async (req, res) => {
    if (simulationMode) {
        return res.json({
            ...simulatedWeather,
            isSimulation: true
        });
    }

    // Fetch Live
    const live = await fetchLiveWeather();
    if (live) {
        res.json({
            ...live,
            isSimulation: false
        });
    } else {
        // Fallback if API fails
        res.json({
            windSpeed_mph: 12,
            condition: 'LIVE (Fallback)',
            isSimulation: false
        });
    }
});

// POST /api/weather (Process inputs for simulation)
router.post('/', (req, res) => {
    const { windSpeed, condition } = req.body;
    simulationMode = true;
    simulatedWeather = {
        windSpeed_mph: windSpeed,
        condition: condition
    };
    res.json({ success: true, mode: 'SIMULATION', data: simulatedWeather });
});

// POST /api/weather/reset (Return to live)
router.post('/reset', (req, res) => {
    simulationMode = false;
    res.json({ success: true, mode: 'LIVE' });
});

module.exports = router;
