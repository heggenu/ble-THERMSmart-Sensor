var myArgs = process.argv.slice(2);

var THERMSMART_CHAR_GETTIME=new Buffer([-47,1]); // Gets the current time from the unit
var THERMSMART_CHAR_GETTEMP=new Buffer([-46]);   // Gets the current temperature and humidity (incl min/max)
var THERMSMART_CHAR_GETHIST=new Buffer([-45,0]); // Gets the current min/max and from yesterday
var THERMSMART_CHAR_GETH24H=new Buffer([-44,0]); // Gets the last 24 hours? temp

var THERMSMART_CHAR_SETTIME=new Buffer([-47, 0]); // Set time
var THERMSMART_CHAR_RESTIME=new Buffer([-47,-1]); // Reset time

console.log(parseTemperature(myArgs[0],6));
console.log(parseTemperature(myArgs[0],10));
console.log(parseTemperature(myArgs[0],14));
console.log(parseTemperature(myArgs[0],24));
console.log(parseTemperature(myArgs[0],28));
console.log(parseTemperature(myArgs[0],32));

function parseTemperature(data,position){
	data=data.substr(position,4).toString();
	x=new Buffer(['0x' + data.substr(0,2), '0x' + data.substr(2,4)]);
	temp=(((x[1]-48)<<8) + (x[0] & 0xFF))/20;
	return temp;
};

