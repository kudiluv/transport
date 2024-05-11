import { z } from 'zod';
import { ParsedVehiclePositionSchema } from '../validation-schemas/parsed-vehicle-position.schema';

export type ParsedVehiclePositionDto = z.infer<
  typeof ParsedVehiclePositionSchema
>;
