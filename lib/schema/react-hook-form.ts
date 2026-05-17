import type {
  FieldErrors,
  FieldValues,
  Path,
  Resolver,
} from "react-hook-form";
import type { ZodType } from "zod";

function mapZodIssuesToFieldErrors<TFieldValues extends FieldValues>(
  issues: Array<{ path: PropertyKey[]; message: string; code: string }>,
): FieldErrors<TFieldValues> {
  const fieldErrors = {} as FieldErrors<TFieldValues>;

  for (const issue of issues) {
    const [firstPathSegment] = issue.path;

    if (typeof firstPathSegment !== "string") {
      continue;
    }

    const fieldName = firstPathSegment as Path<TFieldValues>;

    if (fieldErrors[fieldName]) {
      continue;
    }

    (
      fieldErrors as Record<
        string,
        {
          type: string;
          message: string;
        }
      >
    )[fieldName] = {
      type: issue.code,
      message: issue.message,
    };
  }

  return fieldErrors;
}

export function createZodResolver<TFieldValues extends FieldValues>(
  schema: ZodType,
): Resolver<TFieldValues> {
  return async (values) => {
    const result = await schema.safeParseAsync(values);

    if (result.success) {
      return {
        values: values as TFieldValues,
        errors: {},
      };
    }

    return {
      values: {} as never,
      errors: mapZodIssuesToFieldErrors<TFieldValues>(result.error.issues),
    };
  };
}
