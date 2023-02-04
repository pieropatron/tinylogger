# tinylogger
tiny logger for node js
Well, this is the one of my "bicycles" projects, tiny logger, which writes logs to console in log4js like format: `[${datetime}] [${level}] ${name} - ${msg0} ${msg1} ... ${msgN}`.

Additionally to standard methods, like "info", "warn", "error", "fatal", "debug" also appended methods to create child logger and to log durations.
Idea of this project is to have simple to use, extendable Logger, which will have only functionalities to get colorizeds log in console. I was very liked log4js logger (https://github.com/log4js-node/log4js-node), but it's really big, relatively complex and has too much redundant functionality for me.

## Install
`npm install https://github.com/pieropatron/tinylogger`


## Create new logger
As logger in really tiny, no configuration required, only the name of Logger
``` javascript
const {Logger} = require('tinylogger');
const logger = new Logger('Example logger');
```

## Set level
In fact Logger supports only 2 levels: "info" and "debug" and following realization looks like not best choice, but it allows to be compatible with log4js
``` javascript
// to enable debug level messages
logger.level = "debug"; 
// to disable debug level messages
logger.level = "info"; 
```

## Standard methods
``` javascript
logger.info('Information', 'messages', 'of', 'any', 'types');
logger.debug('Warning', 'messages', 'of', 'any', 'types');
logger.warn('Warning', 'messages', 'of', 'any', 'types');
logger.error('Error', 'messages', 'of', 'any', 'types', 'usually', new Error("Sample error"));
logger.fatal('Fatal', 'messages', 'of', 'any', 'types', 'usually', new Error("Sample error"));
```
Result in console:
![image](https://user-images.githubusercontent.com/18335478/216759872-18de5bd5-047b-4ece-92cd-9c4ef8571839.png)

## dashline
prints dashline in console of required length (default length is 100)

``` javascript
logger.dashline(250); // prints 250 dash symbols ("-") in console
```

## Create "child" Logger
Sometimes usefull to create another Logger, which are inside of "parent" Logger and has same level. For instance, if you have Logger for script, called "Update db" and you wants to have another Logger for one part of it's processing, such as "Update table".
``` javascript
const logger_db = new Logger('Update db');
logger_db.level = "debug";

function update_child(){
	const logger_table = logger_db.child('Update table');
	logger_table.debug("Starting...");
}

update_child(); // write in console: [2023-02-04T12:39:11.272] [DEBUG] Update db.Update table - Starting...
```
Note: "child" Logger will not depend on "parent" Logger somehow after creation. Thus, if you change level for parent Logger, it will not changes for "children".

## Log durations
For console in nodejs we have time and timeEnd methods for this goals. But it's not comfortable to use for me, as it displays duration in millis and requires to remember names of labels for correct results of timeEnd. Also, it is not configurable to set level of logging of durations, which is often required. Thus, method "time" of Logger will require 2 arguments: 
name : string, name of time label, mandatory
level: "debug" or "info", level of logging, optional, default is "debug".
And it returns a function to call in required moment.

``` javascript
logger.level = 'debug';
const time = logger.time("Example duration");
setTimeout(()=>{
	time();
}, 1000);
```
Results in console:
```
[2023-02-04T13:03:38.594] [DEBUG] Example logger - Example duration started
[2023-02-04T13:03:39.604] [DEBUG] Example logger - Example duration finished 00:00:01.010
```

Thus, as you can see, Logger is really tiny, not configurable and so on, but...  As it is extendable, you can always write your own Logger on its base.
