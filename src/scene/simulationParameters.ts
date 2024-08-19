import { z } from "zod";

export const SimulationParameters = z.object({
  numberOfBoids: z.coerce.number().int().gte(0),

  separationRadius: z.coerce.number().gte(0),
  separationForce: z.coerce.number(),

  alignmentRadius: z.coerce.number().gte(0),
  alignmentForce: z.coerce.number(),

  cohesionRadius: z.coerce.number().gte(0),
  cohesionForce: z.coerce.number(),
});

export type SimulationParameters = z.infer<typeof SimulationParameters>;

export const defaultSimulationParameters: Readonly<SimulationParameters> = {
  numberOfBoids: 200,
  separationRadius: 0.5,
  separationForce: 5,
  alignmentRadius: 2,
  alignmentForce: 2,
  cohesionRadius: 6,
  cohesionForce: 0.1,
};

let currentSimulationParameters: SimulationParameters =
  defaultSimulationParameters;

export function getSimulationParameters() {
  return { ...currentSimulationParameters };
}

export function setSimulationParameters(
  parameters: Partial<SimulationParameters>,
) {
  const newParameters = { ...currentSimulationParameters };
  Object.assign(newParameters, parameters);

  currentSimulationParameters = SimulationParameters.parse(newParameters);
}
