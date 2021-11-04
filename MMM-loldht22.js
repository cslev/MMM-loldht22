Module.register("MMM-loldht22", 
{
    app_name:"MMM-loldht22",
    defaults: 
    {
        header:"DHT22 sensor data",
        sensorLocation: 'Living room',
        showLocation: true,
        updateInterval: 30, //in minutes -> every 30 minutes
        animationSpeed: 1000,
        scriptPath: "./loldht22",
        gpioPin: 7,
        vertical: false, 
        iconTemp: '<i class="fas fa-thermometer-half"></i>', //fontawesome HTML tag
        iconHum: '<i class="fas fa-tint"></i>', //fontawesome HTML tag
        iconHome: '<i class="fas fa-house-user"></i>' //fontawesome HTML tag
    },
    mylog: function(text)
    {
        Log.info("["+this.app_name+"]  "+text);
    },
    //This function will be executed when your module is loaded successfully.
    start: function () 
    {
        this.mylog("Starting (layout vertical: " + this.config.vertical + ")");
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
        name.innerHTML =    "<tr><td class='header_icon'>" + this.config.iconHome + "</td>" +
                            "<td class='header_text'>" + this.config.sensorLocation + "</td></tr>"
        //append header to wrapper
        header.appendChild(name);
        wrapper.appendChild(header);
        //create table for the elements
        var table = document.createElement('table');
        table.classList.add("small", "table");
        if(this.config.vertical)
        {
            table.innerHTML = '<tr>' +
							'<td class="icon">' + this.config.iconTemp + '</td>' +
							'<td class="text">' + this.temp + '</td></tr></tr>' + 
                            '<td class="icon">' + this.config.iconHum +'</td>' +
                            '<td class="text">' + this.humidity + '</td>' +
                            '</tr>';
        }
        else
        {
            table.innerHTML = '<tr>' +
							'<td class="icon">' + this.config.iconTemp + '</td>' +
							'<td class="text">' + this.temp + '</td>' + 
                            '<td class="icon">' + this.config.iconHum +'</td>' +
                            '<td class="text">' + this.humidity + '</td>' +
                            '</tr>';
        }
        

        this.mylog(table)
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
                this.mylog("mock node_helper sent back notif SET_SENSOR_DATA");
                if (payload == "ERROR")
                {
                    //temporary reading error - nothing to do, leave sensor data as it is
                    return;
                }
                this.mylog("payload:" + payload);
                // for(var key in payload) 
                // {
                //     var value = payload[key];
                //     console.log(key + ":" + value)
                // }
                // this.mylog("retval: " + payload)
                this.temp = payload["temp"];
                this.temp += ' &#176;C'; //add celsius symbol

                this.humidity = payload["humidity"];
                // this.humidity = payload
                this.humidity += ' %'; //add percent symbol

                // this.mylog(this.temp)
                // this.mylog(this.humidity)

                this.updateDom();
            break;
        }
      },

  })

 