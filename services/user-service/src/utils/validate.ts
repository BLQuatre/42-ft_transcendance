// src/utils/validate.ts
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { FastifyRequest, FastifyReply } from 'fastify';

export const validateBody = <T extends object>(dtoClass: new () => T) => {
  return async (req: FastifyRequest, res: FastifyReply) => {
    const instance = plainToInstance(dtoClass, req.body);
    const errors = await validate(instance);

    if (errors.length > 0) {
      res.status(400).send({
        message: 'Validation failed',
        errors: errors.map(err => ({
          property: err.property,
          constraints: err.constraints,
        })),
      });
      return false;
    }

    (req.body as unknown) = instance;
    return true;
  };
};
