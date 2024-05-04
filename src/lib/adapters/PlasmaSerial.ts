import { SerialPort } from "serialport"
import { PlasmaAdapter } from "./PlasmaAdapter"
import {hexy} from "hexy"

const { round } = Math

export default class PlasmaSerial extends PlasmaAdapter {
    public static SOF = Buffer.from("LEDS")
    public static EOF = Buffer.from([0x00, 0x00, 0x00, 0xff])
    public serial: SerialPort<any>
    private buffer: Buffer
    constructor(options: string[]);
    constructor(pixelCount: number, port: string, baudRate?: number);
    constructor(param1: string[] | number, param2?: string, param3: number = 115200) {
        if (Array.isArray(param1)) {
            param2 = param1[0] || ""
            if (param1[2]) {
                param3 = parseInt(param1[2])
            }
            param1 = parseInt(param1[1])
        }
        super(param1)
        this.buffer = Buffer.alloc(param1 * 4 + PlasmaSerial.SOF.length + PlasmaSerial.EOF.length)
        PlasmaSerial.SOF.copy(this.buffer, 0)
        PlasmaSerial.EOF.copy(this.buffer, this.pixelCount * 4 + PlasmaSerial.SOF.length)
        this.serial = new SerialPort({
            path: param2 as string,
            baudRate: param3
        })
        process.addListener("SIGINT", () => {
            if (this.clearOnExit) {
                this.set_all(0, 0, 0, 0)
                this.show()
            }
            if(this.serial.isOpen){
                this.serial.close()
            }
            process.exit()
        })
        process.addListener("beforeExit", () => {
            if (this.clearOnExit) {
                this.set_all(0, 0, 0, 0)
                this.show()
            }
            this.serial.close()
        })
    }
    public override get_pixel(pixelId: number): [number, number, number, number] {
        const pixel = this.buffer.readInt32BE(pixelId * 4 + PlasmaSerial.SOF.length)
        const brightness = pixel & 0xff / 255
        return [
            round(pixel >> 24 & 0xff / brightness),
            round(pixel >> 16 & 0xff / brightness),
            round(pixel >> 8 & 0xff / brightness),
            brightness
        ]
    }
    public override set_pixel(pixelId: number, r: number, g: number, b: number, brightness?: number | undefined): void {
        super.set_pixel(pixelId, r, g, b, brightness) // is this necessary?
        brightness = brightness || this.get_pixel(pixelId)[3]
        if(brightness >  1) {
            throw new Error("brightness out of range while setting pixel")
        }
        // lets write directly to the buffer we are going to send
        this.buffer.writeInt32BE(
            round(r * brightness) << 24
            | round(g * brightness) << 16
            | round(b * brightness) << 8
            ,pixelId * 4 + PlasmaSerial.SOF.length
        )
    }
    show() {
        this.serial.write(this.buffer)
    }
}