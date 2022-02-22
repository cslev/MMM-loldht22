/* Magic Mirror
 * Module: MMM-loldht22
 *
 * By cs.lev
 * Apache Licensed.
 * 
 * if using docker, please use my MM docker for raspberry pi aarch64. It is compiled
 * with all necessary tools to have access to the GPIO pins properly
 * https://github.com/cslev/docker-MagicMirror
 * 
 */

var NodeHelper = require("node_helper");
// var async = require('async');
// var sys = require('sys');
var exec = require('child_process').exec;

module.exports = NodeHelper.create(
{
    mylog: function(text)
    {
        console.log("[MMM_loldht22][node_helper]  "+text)
    },
    start: function() 
    {
        this.mylog("node_helper started")
        // this.countDown = 10000000
    },
    socketNotificationReceived: function(notification, config) 
    {
        var path = config.scriptPath;
        var pin = config.gpioPin;
        var debug = config.debug;
        //console.log(path + ' ' + pin)
        var results = "";
        var temp = '';
        var hum = '';

        var retVal = {};
        switch(notification) 
        {
            case "GET_SENSOR_DATA":
                exec(path + " " + pin, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`exec error: ${error}`);
                        console.error(stderr);
                        this.sendSocketNotification("SET_SENSOR_DATA", "ERROR");
                        return;
                    }
                    if(debug)
                    {
                        console.log(`${stdout}`);
                    }
                    results = stdout.toString().split("=");
                    if(debug)
                    {
                        console.log(results);
                    }
                    
                    hum = results[1].split(' ')[1];
                    temp = results[2].split(' ')[1];
                    if(debug)
                    {
                        console.log("Hum:" + hum);
                        console.log("Temp:" + temp);    
                    }
                    retVal["humidity"] = hum;
                    retVal["temp"] = temp;
                    if(debug)
                    {
                        console.log(retVal);
                    }
                    this.sendSocketNotification("SET_SENSOR_DATA", retVal);
                });
                // this.mylog("node_helper is doing its job:" + (this.countDown - payload).toString())
                //console.log("node_helpre is working")
                
            break
        }
    },
});