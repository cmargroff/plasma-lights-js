# plasma-lights
A Pimoroni Plasma library for NodeJS

### ⚠️ WIP Warning
I developed this for working with another project and its feature set is fairly limited right now.
Currently the only device supported is the Pimoroni Player X using USB serial connection. If someone comes along and needs a specific device please let me know, I'll try to add it.

### Usage
I tried to replicate some of the structure and method signatures of the python library.

There are two ways to get a device object, auto connect or manual.

#### Auto connect
With this all you need to do is specify a formated connection string to the auto function and it will try to connect for you.

```js
import { auto, PicadePlayerX } from 'plasma-lights';

/**
 * The Player X and I assume other devices are not able to detect how many LEDs are connected.
 * You will need to set them in the connection string.
 * Also note that you can set any number but the Picade Plasma buttons have 4 LEDs per button and would recommend setting a multiple of 4 when using them.
 */
const NUM_PIXELS = 12;

/**
 * Format for connection string
 * [connection type]:[connection address][:...configuration values]
 */

const plasma = auto(`SERIAL:COM7:${NUM_PIXELS}`);

// attempts to hook before process exit to clear pixels
plasma.set_clear_on_exit(true)

// You can start talking to the plasma device as is
plasma.clear()
plasma.set_pixel(0, 255, 255, 255, 1)

// But I also made a helper library for the Player X when using the Plasma buttons

const playerX = new PicadePlayerX(plasma)

// This will set the first 4 addressed pixels to the same color
playerX.setButton(0, 255, 255, 255, 1)
```

#### Manual connection
Similar to before but instead of providing a connection string you simply call the constructor for the type of connection you are creating.

```js
import { PlasmaSerial } from 'plasma-lights'

const plasma = new PlasmaSerial("COM7")

...
```

## Todo
- Support on linux
- Support for other devices