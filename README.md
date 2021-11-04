# MMM-loldht22
MagicMirror module to read DHT22 sensor via the loldht libraries

# Why is this module different than others?
When MagicMirror is run in a Docker container, everything seems to be the same...HOWEVER, when it comes to Raspberry pi + 64bit OS + GPIO + further privileges, all of them failed (at least to me).

The basis of all approaches is the [wiringpi](http://wiringpi.com/download-and-install/) library.
On top of this, there are several implementations, but most famous (I guess) are the dht22 and [lol_dht22](https://github.com/technion/lol_dht22).
I usually used the latter one as it by default gives celsius degree instead of Fahrenheit.
However, most DHT22 Magicmirror modules, e.g., [Bangee44](https://github.com/Bangee44/MMM-DHT22/),[nebulx29](https://github.com/nebulx29/MMM-dht22),[ryck](https://github.com/ryck/MMM-DHT-Sensor), were using another one.

## MagicMirror in a container
If you run your MagicMirror on the host OS, you probably won't get any issue.
When Magicmirror is in a container, then the story becomes a bit more complicated. 
Even if I added all capabilities to a container (via `CAP_ADD`), or elevating the whole container into `privileged` mode, none of the modules mentioned above were ever able to read the GPIO pins properly.

### Container is almost like a VM
Yes, I know, there further things to pay attention to when running magicmirror in a container, e.g., `'/sys/class/gpio:/sys/class/gpio'` added as volume, `'/dev/mem:/dev/mem'`, `'/dev/gpiomem:/dev/gpiomem'`,`'/dev/ttyAMA0:/dev/ttyAMA0'` added as device, but still, it was not working straight away.

Then, you can still go into the container to manually install the libraries needed inside the container...though, the original magicmirror docker image does not have too much BASH if you get what I mean :)


Anyway, I relied on lol_dht22, compiled it within a magicmirror container, and developed this magicmirror module you are currently looking at, and it works for me finally inside a container.

# Fully prepared MagicMirror container? 
If you want a fully prepared magicmirror in a container for raspberry pi aarch64 (arm64), check out my MagicMirror repository [https://github.com/cslev/docker-MagicMirror](https://github.com/cslev/docker-MagicMirror)

## My Experience
Note, if you already run MagicMirror in a container, even if you have lol_dht22 installed inside, after adding this module, you have to restart the container, otherwise it does not always work. But this is just a one time restart :)

# Requirements
 - Install [wiringpi](http://wiringpi.com/download-and-install/)
 - Install [lol_dht22](https://github.com/technion/lol_dht22)

# MMM-loldht22 configuration
```
{
      module: 'MMM-loldht22',
      position: 'top_right',
      config: {
        sensorLocation: "Living room",
        showLocation: true,
        updateInterval: 10, //in minutes
        animationSpeed: 1000,
        scriptPath: "/tmp/lol_dht22/loldht",
        gpioPin: 7,
        vertical: false, //horizontal vs. vertical layout
        iconTemp: '<i class="fas fa-thermometer-half"></i>', //fontawesome HTML tag
        iconHum: '<i class="fas fa-tint"></i>', //fontawesome HTML tag
        iconHome: '<i class="fas fa-house-user"></i>' //fontawesome HTML tag
      }
   },
```

| Option |  Description | 
|---|---|
|sensorLocation| Indicate where the sensor is deployed. Default: `Living room` |
|showLocation| Indicate if you want the location above to be shown. Default `true`.
|updateInterval|  Indicate the update interval in *minutes*! We don't have to set this to a low value, things don't change to much within seconds. Default: `10` (minutes)|
|animationSpeed| Typical setting :). Default: `1000`|
|scriptPath| Where the loldht binary is located. Default `/tmp/lol_dht22/loldht`|
|gpioPin | GPIO pin the DHT22 sensor is connected to. Default `7`|
|vertical| Horizontal or vertical layout. Default `true`|
|iconTemp| Temp icon. Change default icons if you want by fontawesome. Default `<i class="fas fa-thermometer-half"></i>`|
|iconHum| Humidity icon. Change default icons if you want by fontawesome. Default `<i class="fas fa-tint"></i>`|
|iconHome|: Location icon. Change default icons if you want by fontawesome. Default `<i class="fas fa-house-user"></i>`|


| Layout |  View | 
|---|---|
|horizontal|<img width="325" alt="Horizontal layout" src="https://github.com/cslev/MMM-loldht22/blob/master/horizontal.png"/> |
|vertical| <img width="325" alt="Vertical layout" src="https://github.com/cslev/MMM-loldht22/blob/master/horizontal.png"/>|
