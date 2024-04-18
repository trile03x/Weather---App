const asyncRequest = require('async-request');
const getWeather = async (location) => {
    const key = '23ac9025b13c432e054fde606c95ee23';
    const url = `http://api.weatherstack.com/current?access_key=${key}&query=${location}`;
    try {
        const res = await asyncRequest(url);
        const data = JSON.parse(res.body);
        const weather = {
            region: data.location.region,
            country: data.location.country,
            temperature: data.current.temperature,
            wind_speed: data.current.wind_speed,
            precip: data.current.precip,
            cloudcover: data.current.cloudcover,
        };
        // console.log(data);
        // console.log(weather);
        return weather;
    }
    catch (error) {
        console.log("Fail Call API");
        console.log({
            isSuccess: false,
            error,
        });
    }

}
const express = require('express');
const app = express();
// cau hinh toi file public
const path = require('path');
const pathPublic = path.join(__dirname, "./public")
app.use(express.static(pathPublic));
// http://localhost:7000/ se run ham duoi
app.get("/", async (req, res) => { // thong thuong se co 2 tham so request va respon
    const params = req.query;
    const location = params.address;
    const weatherData = await getWeather(location);
    if (location) {
        res.render("weather", {
            status: true,
            region: weatherData.region,
            country: weatherData.country,
            temperature: weatherData.temperature,
            wind_speed: weatherData.wind_speed,
            precip: weatherData.precip,
            cloudcover: weatherData.cloudcover,
        });
    }
    else{
        res.render("weather",{
            status: false,
        })
    }
});
app.set("view engine", "hbs");
const port = 1001;
app.listen(port, () => {
    console.log(`App run on port ${port}`);
});
