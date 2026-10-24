"use client";

import { useId } from "react";

interface FieldProps {
  name: string;
  label: string;
  help?: string;
  error?: string;
  value: string;
  unit?: string;
  testId: string;
  onChange: (value: string) => void;
}

/** Label above, the field, then the error and help below (app chapter §8.1). */
export function Field({ name, label, help, error, value, unit, testId, onChange }: FieldProps) {
  const id = useId();
  const describedBy = [error ? `${id}-error` : null, help ? `${id}-help` : null].filter(Boolean).join(" ") || undefined;

  return (
    <div className="field">
      <label htmlFor={id} className="field__label">
        {label}
      </label>
      <div className="field__box">
        <input
          id={id}
          name={name}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          // A browser tool can set the value without an input event; leaving the field still counts as the edit.
          onBlur={(e) => e.target.value !== value && onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          data-testid={testId}
          className={`field__input num${unit ? " has-unit" : ""}`}
        />
        {unit && <span className="field__unit">{unit}</span>}
      </div>
      {error && (
        <p id={`${id}-error`} className="field__error" data-testid={`${testId}-error`}>
          {error}
        </p>
      )}
      {help && (
        <p id={`${id}-help`} className="field__help">
          {help}
        </p>
      )}
    </div>
  );
}

interface SegmentedProps<T extends string> {
  legend: string;
  name: string;
  value: T;
  options: { value: T; label: string }[];
  testId: string;
  onChange: (value: T) => void;
  hideLegend?: boolean;
}

export function Segmented<T extends string>({
  legend,
  name,
  value,
  options,
  testId,
  onChange,
  hideLegend,
}: SegmentedProps<T>) {
  const id = useId();
  return (
    <fieldset className="segmented-field" data-testid={testId}>
      <legend className={hideLegend ? "sr-only" : "field__label"}>{legend}</legend>
      <div className="segmented">
        {options.map((option) => (
          <label
            key={option.value}
            data-testid={`${testId}-${option.value}`}
            className={`segmented__option${option.value === value ? " is-on" : ""}`}
          >
            <input
              type="radio"
              name={`${name}-${id}`}
              value={option.value}
              checked={option.value === value}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
