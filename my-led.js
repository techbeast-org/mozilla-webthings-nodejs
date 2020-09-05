// -*- mode: js; js-indent-level:2;  -*-
// SPDX-License-Identifier: MPL-2.0

const {
    Property,
    SingleThing,
    Thing,
    Value,
    WebThingServer,
  } = require('webthing');
  const {v4: uuidv4} = require('uuid');
  const Gpio = require('onoff').Gpio;
  const led = new Gpio(4, 'out');

  

  
  function makeThing() {
    const thing = new Thing('urn:dev:ops:my-lamp-1234',
                            'My LED',
                            ['OnOffSwitch', 'Light'],
                            'A web connected LED');
  
    thing.addProperty(
      new Property(thing,
                   'on',
                   new Value(true, (v)=>led.writeSync(v===true ?1:0)),
                   {
                     '@type': 'OnOffProperty',
                     title: 'On/Off',
                     type: 'boolean',
                     description: 'Whether the LED is turned on',
                   }));

 
    return thing;
  }
  
  function runServer() {
    const thing = makeThing();
  
    // If adding more than one thing, use MultipleThings() with a name.
    // In the single thing case, the thing's name will be broadcast.
    const server = new WebThingServer(new SingleThing(thing), 8888);
  
    process.on('SIGINT', () => {
      server.stop().then(() => process.exit()).catch(() => process.exit());
    });
  
    server.start().catch(console.error);
  }
  
  runServer();
