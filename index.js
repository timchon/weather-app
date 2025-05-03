import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) =>{
    try{
        const resultWather = await axios.get("https://api.open-meteo.com/v1/forecast?latitude=47.9057&longitude=33.394&daily=sunrise,sunset&hourly=temperature_2m&current=temperature_2m,apparent_temperature,weather_code&timezone=auto")

        let now = new Date()
        let hourNow = now.getHours();

        let temperatureViews = Math.round(resultWather.data.current.temperature_2m );
        let temperatureApparent =  Math.round(resultWather.data.current.apparent_temperature);

        let weatherCode = resultWather.data.current.weather_code;
        let weatherMessage;

        let sunrise = resultWather.data.daily.sunrise[0].split("T")[1].slice(0, 2);
        let sunset = resultWather.data.daily.sunset[0].split("T")[1].slice(0, 2);
        //Схід сонця:
        let sunriseHour = Number(sunrise);
        
        //Захід сонця:
        let sunsetHour = Number(sunset);
        switch(weatherCode){
            case 0:
                weatherMessage = "Ясне небо";
                break;
            case 1:
                weatherMessage = "Часткове хмарне небо";
                break;
            case 3:
                weatherMessage = "Хмарно";
                break;
            case 4:
                weatherMessage = "Дощ";
                break;
            case 5:
                weatherMessage = "Сніг";
                break;
            case 6:
                weatherMessage = "Туман";
                break;
            default:
                weatherMessage = "Невідомо";
                break;
        }

        
        res.render("index.ejs",{
            temperature: temperatureViews, 
            apparent: temperatureApparent,
            weatherMessage, hourNow, sunriseHour, sunsetHour});
    }catch (error){
        console.error("❌ Помилка при запиті погоди:", error.message);
    }
    
})

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
  });