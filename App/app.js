const asyncRequest = require('async-request');
const getWeather = async (location) => {
    const key = 'cdba65f6597c7a965877d2a7794ea707';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${key}&lang=vi`;
    try {
        const res = await asyncRequest(url);
        const data = JSON.parse(res.body);
        const weather = {
            wind: data.wind.speed,
            clouds:data.clouds.all,
            country:data.sys.country,
            name:data.name,
            temp:data.main.temp,
            temp_min:data.main.temp_min,
            temp_max:data.main.temp_max,
            humidity: data.main.humidity,
            desc: data.weather[0].description,
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
// getWeather('tokyo');
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
    console.log(weatherData);
    console.log("oke");
    if (location) {
        res.render("weather", {
            status: true,
            wind: weatherData.wind,
            clouds:weatherData.clouds,
            country:weatherData.country,
            name:weatherData.name,
            temp:(weatherData.temp -273.15).toFixed(1),
            temp_min:(weatherData.temp_min-273.15).toFixed(1),
            temp_max:(weatherData.temp_max-273.15).toFixed(1),
            humidity: weatherData.humidity,
            desc: weatherData.desc,
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
