export function MeasureExecutionTime(
  target: Object,
  propertyKey: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    const start = process.hrtime.bigint();
    const result = await originalMethod.apply(this, args);
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1_000_000;

    console.log(`[Timing] ${propertyKey} ejecutado en ${durationMs.toFixed(2)}ms`);

    return result;
  };

  return descriptor;
}
