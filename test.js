var noble = require('noble');
var parseTemperature = require('./parseTemperature')

var pizzaServiceUuid = 'fff0';

noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    //
    // Once the BLE radio has been powered on, it is possible
    // to begin scanning for services. Pass an empty array to
    // scan for all services (uses more time and power).
    //
    console.log('scanning...');
    noble.startScanning([pizzaServiceUuid], false);
  }
  else {
    noble.stopScanning();
  }
})


noble.on('discover', function(peripheral) {
  // we found a peripheral, stop scanning
  noble.stopScanning();

  //
  // The advertisment data contains a name, power level (if available),
  // certain advertised service uuids, as well as manufacturer data,
  // which could be formatted as an iBeacon.
  //
  console.log('found peripheral:', peripheral.advertisement);
  //
  // Once the peripheral has been discovered, then connect to it.
  // It can also be constructed if the uuid is already known.
  ///

  peripheral.connect(function(err) {
    //
    // Once the peripheral has been connected, then discover the
    // services and characteristics of interest.
    //

    peripheral.discoverServices([pizzaServiceUuid], function(err, services) {
      services.forEach(function(service) {
        //
        // This must be the service we were looking for.
        //
        console.log('found service:', service.uuid);

        //
        // So, discover its characteristics.
        //
        service.discoverCharacteristics([], function(err, characteristics) {

          console.log(characteristics[3].uuid);

          setTimeout(function() {
            console.log('Blink the LED and sleep for 5 seconds');
            var data=new Buffer([-43]);
            characteristics[2].write(data, true, function(error){}); // data is a buffer, withoutResponse is true|false
          }, 5000);

          characteristics[3].once('notify', function(state) {
            console.log('we got notified!')
            characteristics[3].on('read', function(data, isNotification) {
              //console.log('on read, notification: '+isNotification)
              //console.log(data.toString('hex'));
              console.log('Temperature:' + parseTemperature(data.toString('hex'),6));
              console.log('Temperature:' + parseTemperature(data.toString('hex'),10));
              console.log('Temperature:' + parseTemperature(data.toString('hex'),14));
            });
          });

          characteristics[3].subscribe(function(error){
            //console.log(error);

            //characteristics[3].read(function(error,data){
            //  console.log('read characteristic[3] '+error+':'+data);
            //});
            var data=new Buffer([-46]);
            characteristics[2].write(data, true, function(error){}); // data is a buffer, withoutResponse is true|false
            // data is a buffer, withoutResponse is true|false
          });
        })
      })
    })
  })
})
