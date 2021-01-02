//npm run dev

const https = require('https');
require('dotenv').config();

//console.log(process.env.DISCORDJS_BOT_TOKEN);

const { Client } = require('discord.js');
const client = new Client();

const PREFIX = '!';

const apiKey = process.env.API_KEY;
const unit = 'metric';

client.on('ready', () =>{
    console.log(`${client.user.username} has logged in.`);
});

client.on('message', (message) =>{

    if (message.author.bot === true) return;
    //console.log(`[${message.author.tag}]: ${message.content}`)

    if (message.content.startsWith(PREFIX+'weather')){

        console.log(`[${message.author.tag}]: ${message.content}`)
        const query = message.content.trim().substring(PREFIX.length).replace('weather','').trim();
        console.log(query);

        if (query === undefined){
            message.reply('Invalid query. Send the command along with a space between the query location.')

        }else{
            const url = 'https://api.openweathermap.org/data/2.5/weather?q='+query+'&appid='+apiKey+'&units='+unit;
            //console.log(url);

            https.get(url, function(res){

                if (res.statusCode != 200){
                    message.reply('Invalid query. Re-check spelling or try again later.')

                }else{
                    //This allows to get all the data which was in json format.
                res.on('data', function(data){

                    const weatherData = JSON.parse(data);
                    console.log(weatherData);
                    const temp = weatherData.main.temp;
                    const iconID = weatherData.weather[0].icon;
                    let weatherDesc = weatherData.weather[0].description.toLowerCase().split(' ');

                    for (var i = 0; i < weatherDesc.length; i++) { 
                        weatherDesc[i] = weatherDesc[i].charAt(0).toUpperCase() + weatherDesc[i].slice(1);  
                    } 

                    const imageURL = 'http://openweathermap.org/img/wn/'+iconID+'@2x.png'
                    let areaLoc = weatherData.name.toLowerCase().split(' ');
                    for (var i = 0; i < areaLoc.length; i++) { 
                        areaLoc[i] = areaLoc[i].charAt(0).toUpperCase() + areaLoc[i].slice(1);  
                    } 
                    console.log(areaLoc)
                    const country = weatherData.sys.country

                    message.channel.send(`Query: ${areaLoc+', '+country} \nTemperature: ${temp}°C, \nWeather Description: ${weatherDesc.join(' ')}
                                    \n`,{files: [imageURL]});
                    });
                }
            });
        }
    }
});

client.login(process.env.DISCORDJS_BOT_TOKEN);
