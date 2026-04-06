import { RuleRender } from "antd/es/form";
import { ZodEffects, ZodObject, ZodRawShape } from "zod";

export type AntdFormZodSchema<T extends ZodRawShape> =
  | ZodObject<T>
  | ZodEffects<ZodObject<T>>;

export const createZodSync =
  <T extends ZodRawShape>(schema: AntdFormZodSchema<T>): RuleRender =>
  ({ getFieldsValue }) => ({
    validator: (rule) =>
      // eslint-disable-next-line no-async-promise-executor
      new Promise(async (resolve, reject) => {
        // AsyncValidator adds field - rc-field-form type isn't correct
        // https://github.com/search?q=repo%3Ayiminghe%2Fasync-validator%20fullField&type=code
        const { field } = rule as { field: string };

        const values = getFieldsValue();
        const data = await schema.safeParseAsync(values);

        if (!data.success) {
          const error = data.error.issues.find(
            (err) => err.path.join(".") === field,
          );
          if (error) reject(error);
        }

        resolve(undefined);
      }),
  });
