"use client";

import { useFormContext, FieldValues, Path } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputHTMLAttributes } from "react";

type Props<T extends FieldValues> = {
  fieldTitle: string;
  nameInSchema: Path<T>;
  className?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function InputWithLabel<T extends FieldValues>({
  fieldTitle,
  nameInSchema,
  className,
  ...props
}: Props<T>) {
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();

  const error = errors?.[nameInSchema]?.message as string | undefined;

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor={nameInSchema} className="text-base">
        {fieldTitle}
      </Label>

      <Input
        id={nameInSchema}
        className={`w-full max-w-xs disabled:text-blue-500 dark:disabled:text-yellow-300 disabled:opacity-75 ${className ?? ""}`}
        {...register(nameInSchema)}
        {...props}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
