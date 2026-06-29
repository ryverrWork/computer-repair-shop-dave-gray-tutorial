"use client";

import { useFormContext, FieldValues, Path } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { TextareaHTMLAttributes } from "react";

type Props<T extends FieldValues> = {
  fieldTitle: string;
  nameInSchema: Path<T>;
  className?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextAreaWithLabel<T extends FieldValues>({
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
      <Label htmlFor={nameInSchema} className="text-base mb-2">
        {fieldTitle}
      </Label>

      <Textarea
        id={nameInSchema}
        className={`disabled:text-blue-500 dark:disabled:text-yellow-300 disabled:opacity-75 ${className}`}
        {...register(nameInSchema)}
        {...props}
      ></Textarea>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
