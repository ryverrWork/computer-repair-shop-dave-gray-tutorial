"use client";

import { useFormContext, Controller, FieldValues, Path } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

type Props<T extends FieldValues> = {
  fieldTitle: string;
  nameInSchema: Path<T>;
  message: string;
  disabled?: boolean;
};

export function CheckboxWithLabel<T extends FieldValues>({
  fieldTitle,
  nameInSchema,
  message,
  disabled = false,
}: Props<T>) {
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();

  const error = errors?.[nameInSchema]?.message as string | undefined;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-3">
        <Label htmlFor={nameInSchema} className="text-base w-1/3 mt-2">
          {fieldTitle}
        </Label>

        <Controller
          name={nameInSchema}
          control={control}
          render={({ field }) => (
            <Checkbox
              id={nameInSchema}
              className="mt-2"
              checked={Boolean(field.value)}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          )}
        />

        <span className="mt-2">{message}</span>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
