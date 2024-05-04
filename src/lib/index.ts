import { PlasmaSerial } from "./adapters"

export const auto = (definition: string) => {
  const [outputType, ...options] = definition.split(":")
  if (outputType === "USB" || outputType === "SERIAL") {
    return new PlasmaSerial(options)
  }
}

export * from "./devices"
export * from "./adapters"