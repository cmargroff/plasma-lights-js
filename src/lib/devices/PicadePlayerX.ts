import { Plasma } from "../Plasma";

export class PicadePlayerX {
  public static BUTTON_1 = 0;
  public static BUTTON_2 = 1;
  public static BUTTON_3 = 2;
  public static BUTTON_4 = 3;
  public static BUTTON_5 = 4;
  public static BUTTON_6 = 5;
  public static BUTTON_7 = 6;
  public static BUTTON_8 = 7;
  public static BUTTON_ENT = 8;
  public static BUTTON_ESC = 9;
  public static BUTTON_1UP = 10;
  public static BUTTON_COIN = 11;
  constructor(private connection: Plasma) { }
  public get buttonCount () {
    return this.connection.get_pixel_count() / 4
  }
  public setButton(button: number, r: number, g: number, b: number, brightness: number) {
    const p = button * 4
    for (let i = 0; i < 4; i++) {
      this.connection.set_pixel(p + i, r, g, b, brightness)
    }
  }
  public spinButton(button: number, r: number, g: number, b: number, rotation: number, brightness: number) {
    const p = button * 4
    const rad = rotation * Math.PI / 180
    const x = Math.sin(rad)
    const y = Math.cos(rad)
    const LUT = [
      Math.max(0, Math.min(1, x)),
      Math.max(0, Math.min(1, y)),
      Math.max(0, Math.min(1, -x)),
      Math.max(0, Math.min(1, -y))
    ]
    const brightnessPercent = brightness / 255
    for (let i = 0; i < 4; i++) {
      this.connection.set_pixel(p + i, r, g, b, Math.round(LUT[i]) * brightnessPercent)
    }
  }
}