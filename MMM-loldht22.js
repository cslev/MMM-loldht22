Module.register("MMM-loldht22", 
{
    app_name:"MMM-loldht22",
    defaults: 
    {
        sensorLocation: 'Living room',
        showLocation: true,
        updateInterval: 10, //in minutes -> every 30 minutes
        animationSpeed: 1000,
        scriptPath: "./loldht22",
        gpioPin: 7,
        vertical: false, 
        highTempIcon: '<i class="fas fa-thermometer-three-quarters"></i>',
        mediumTempIcon: '<i class="fas fa-thermometer-half"></i>',
        lowTempIcon: '<i class="fas fa-thermometer-quarter"></i>',
        freezeTempIcon: '<i class="fas fa-thermometer-empty"></i>',
        iconHum: '<i class="fas fa-tint"></i>', //fontawesome HTML tag
        humColor: '#365fbf',
        iconHome: '<i class="fas fa-house-user"></i>', //fontawesome HTML tag
        colored: false,
        highTempStartsAt: 28,
        highColor: '#ec1515', //only if colored is true
        mediumTempStartsAt: 24,
        mediumColor: '#e8b928', //only if colored is true
        lowTempStartsAt: 16,
        lowColor: '#0fd257', //only if colored is true
        freezeTempStartsAt: 0,
        freezeColor: '#0f99d2', //only if colored is true
        fontSize: '20px',
        iconSize: '20px',
        headerFontSize: '18px',
        headerIconSize: '18px',
        rowPadding: '10px', //only makes sense if vertical is true
        debug: true
    },
    


    mylog: function(text)
    {
        Log.info("["+this.app_name+"]  "+text);
    },

    //This function will be executed when your module is loaded successfully.
    start: function () 
    {
        if(this.config.debug)
        {
            this.mylog("Starting (layout vertical: " + this.config.vertical + ")");
        }
        
        this.loaded = false;
        this.humidity = "reading...";
        this.temp = "reading...";
        this.adjustedUpdateInterval=this.config.updateInterval*60*1000;        
    },

    //to get font-awesome icons
    getStyles: function() 
    {
        fontawesome='https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css'
        css="MMM-loldht22.css"
        return [fontawesome,css];

    },

    getDom: function() 
    {
        //main div
        var wrapper = document.createElement("div");
        //create header data
        var header = document.createElement("header");
        var name = document.createElement("table");
        name.classList.add("tiny", "table");
        name.innerHTML =    "<tr><td class='header_icon' style='font-size: "+this.config.headerIconSize+";'>" + this.config.iconHome + "</td>" +
                            "<td class='header_text' style='font-size: "+this.config.headerFontSize+";'>" + this.config.sensorLocation + "</td></tr>"
        //append header to wrapper
        header.appendChild(name);
        wrapper.appendChild(header);
        //create table for the elements
        var table = document.createElement('table');
        table.classList.add("small", "table");
        
        //check temperature and colors
        //@TODO: make this better, too many if statements...dictionary would be nicer or something more efficient. At least for the colors...
        //set humidity icon to non colored one
        var iconHum = this.config.iconHum ;//change the color later if colorized is true
        var iconTemp = this.config.freezeTempIcon;
        var temp = parseInt(this.temp); //create a variable for this.temp to convert it to int only once
        var tempColor = "#abbabb";
        var humColor = "#abbabb";
        if(this.temp != "reading...") //initially, the value is NaN, so don't do the lot of checks below
        {
            if(temp > parseInt(this.config.freezeTempStartsAt))
            {
                iconTemp = this.config.freezeTempIcon;
                if(this.config.debug)
                {
                    this.mylog("temperature is Freezing -->" + temp);
                }
                if(this.config.colored)
                {
                    // iconTemp = this.freezeTempIconColored
                    tempColor = this.config.freezeColor;
                    humColor = this.config.humColor;
                    //we use this if statement to colorize humidity icon to spare one more if :D
                    // iconHum = '<span style="color: '+this.config.humColor+'">'+this.config.iconHum+"</span>"
                    
                }
                if(temp > parseInt(this.config.lowTempStartsAt))
                {
                    iconTemp = this.config.lowTempIcon;
                    if(this.config.debug)
                    {
                        this.mylog("temperature is Low -->" + temp);
                    }
                    if(this.config.colored)
                    {
                        // iconTemp = this.lowTempIconColored
                        tempColor=this.config.lowColor;
                    }

                    if(temp > parseInt(this.config.mediumTempStartsAt))
                    {
                        iconTemp = this.config.mediumTempIcon;
                        if(this.config.debug)
                        {
                            this.mylog("temperature is Medium -->" + temp);
                        }
                        if(this.config.colored)
                        {
                            // iconTemp = this.mediumTempIconColored
                            tempColor = this.config.mediumColor;
                        }

                        if(temp > parseInt(this.config.highTempStartsAt))
                        {
                            iconTemp = this.config.highTempIcon;
                            if(this.config.debug)
                            {
                                this.mylog("temperature is HIGH -->" + temp);
                            }
                            if(this.config.colored)
                            {
                             //   iconTemp = this.highTempIconColored
                             tempColor=this.config.highColor;
                            }
                        }
                    }
                }
            }
        }

        // this.mylog("high color" + this.config.highColor)
        // this.mylog("medium color" + this.config.mediumColor)
        // this.mylog("low color" + this.config.lowColor)
        // this.mylog("freeze color" + this.config.freezeColor)

        // this.mylog("iconTemp" + iconTemp)

        // this.mylog("iconHum" + iconHum)


        if(this.config.vertical)
        {
            
            table.innerHTML = "<tr style='color:"+tempColor+"'>" +
            "<td class='icon' style='font-size: "+this.config.iconSize+";text-align:left;padding-bottom:"+this.config.rowPadding+"'>" + iconTemp + "</td>" +
            "<td class='text' style='font-size: "+this.config.fontSize+";text-align:right;padding-bottom:"+this.config.rowPadding+"'>" + this.temp + "</td></tr>" + 
            "<tr style='color:"+humColor+"'><td class='icon' style='font-size: "+this.config.iconSize+";text-align:left;padding-bottom:"+this.config.rowPadding+"'>" + iconHum +"</td>" +
            "<td class='text' style='font-size: "+this.config.fontSize+";text-align:right;padding-bottom:"+this.config.rowPadding+"'>" + this.humidity + "</td>" +
            "</tr>";           
        }
        else
        {
            table.innerHTML = "<tr>" +
							"<td class='icon' style='font-size: "+this.config.iconSize+";color:"+tempColor+";'>" + iconTemp + "</td>" +
							"<td class='text' style='font-size: "+this.config.fontSize+";color:"+tempColor+";'>" + this.temp + "</td>" + 
                            "<td class='icon' style='font-size: "+this.config.iconSize+";color:"+humColor+";'>" + iconHum +"</td>" +
                            "<td class='text' style='font-size: "+this.config.fontSize+";color:"+humColor+";'>" + this.humidity + "</td>" +
                            "</tr>";
        }
        

        // this.mylog(table)
	    wrapper.appendChild(table);
        return wrapper;
    },
  
    //3rd approach via node_helper.js
    notificationReceived: function(notification, payload, sender) 
    {
        switch(notification) {
            case "DOM_OBJECTS_CREATED":
                this.loaded=true;
                //update when page loaded no matter the timer
                this.sendSocketNotification("GET_SENSOR_DATA", this.config);

                var timer = setInterval(()=>{
                // this.mylog("sending notification GET_SENSOR_DATA")
                this.sendSocketNotification("GET_SENSOR_DATA", this.config)
                }, this.adjustedUpdateInterval);
            break;
        }
    },
    socketNotificationReceived: function(notification, payload) 
    {
        switch(notification) {
            case "SET_SENSOR_DATA":
                // this.mylog("mock node_helper sent back notif SET_SENSOR_DATA");
                if (payload == "ERROR")
                {
                    //temporary reading error - nothing to do, leave sensor data as it is
                    return;
                }

                this.temp = payload["temp"];
                this.temp += ' &#176;C'; //add celsius symbol

                this.humidity = payload["humidity"];
                this.humidity += ' %'; //add percent symbol

                this.updateDom();
            break;
        }
      },

  })

 