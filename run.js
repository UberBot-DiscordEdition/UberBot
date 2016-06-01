var Discord = require("discord.js");
var Uber = require('node-uber');
var config = require("./config.json");
var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter);

var uber = new Uber({
  client_id: config.uberclientid,
  client_secret: config.uberclientsecret,
  server_token: config.uberclientservertoken,
  redirect_uri: config.uberredirecturl,
  name: config.ubername
});

var geocoderProvider = 'google';
var httpAdapter = 'http';
var bot = new Discord.Client({autoRecconect: true});

bot.on("ready", function(msg){
  console.log("Woop! Bot logged in under the name of " + bot.user.name + " and the user ID of " + bot.user.id)
})

bot.on("message", function(message) {
if(message.content.indexOf("<@" + bot.user.id + ">" + "Uber") == 0) {
          console.log("Called -> Uber");
        bot.reply(message, "Yes mate");
          console.log("Replied");
    }
});

bot.on("message", function(message) {
if(message.content.indexOf("<@" + bot.user.id + ">" + "products ") == 0) {
          console.log("Called -> products");
        bot.reply(message, "Insert an address mate pls");
          console.log("Replied");
    }
});

bot.on("message", function(message) {
    if(message.content.indexOf("<@" + bot.user.id + ">" + " " + "products ") == 0) {
        console.log("Called -> products");
        var address = message.content.substring(12 + bot.user.id.length);
        bot.reply(message,"You are at: " + address + " " + "Getting products for You");
        console.log("Replied -> products address")
        geocoder.geocode(address, function(err, res) {
    console.log(res);
    var latitude = res[0]["latitude"]
    var longitude = res[0]["longitude"]
    uber.products.getAllForLocation(latitude,longitude, function (err, res) {
      if (err){
        console.error(err);
        bot.reply(message,err);
      }
      else {
        console.log(res)

        for (var i = 0; i < res.length; i++) {
          bot.reply(message, i + "." + res['products'][i][' display_name'] + " " + res['products'][i]['description'] + " " + "Capacity: " + " " + res['products'][i]['capacity']);
        }
      };

        });
        });

      }
});

bot.loginWithToken(config.token);
