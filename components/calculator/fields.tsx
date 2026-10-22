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

export function Field({ name, label, help, error, value, unit, testId, onChange }: FieldProps) {
  const id = useId();
  const helpId = `${id}-help`;
  const errorId = `${id}-error`;
  const describedBy = [error ? errorId : null, help ? helpId : null].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium leading-5">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          data-testid={testId}
          className={`num h-11 w-full rounded-md border bg-surface px-3 text-[15px] text-ink transition-colors duration-150 outline-none placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-0 ${
            unit ? "pr-14" : ""
          } ${error ? "border-fail focus-visible:outline-fail" : "border-line hover:border-line-strong focus-visible:border-accent"}`}
        />
        {unit && (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[13px] text-muted">
            {unit}
          </span>
        )}
      </div>
      {error && (
        <p id={errorId} className="text-[13px] leading-5 text-fail" data-testid={`${testId}-error`}>
          {error}
        </p>
      )}
      {help && (
        <p id={helpId} className="text-[13px] leading-5 text-muted">
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
    <fieldset className="flex flex-col gap-2" data-testid={testId}>
      <legend className={hideLegend ? "sr-only" : "mb-2 text-sm font-medium leading-5"}>{legend}</legend>
      <div className="grid auto-cols-fr grid-flow-col gap-1 rounded-md bg-raised p-1 sm:inline-grid sm:w-max">
        {options.map((option) => {
          const checked = option.value === value;
          return (
            <label
              key={option.value}
              data-testid={`${testId}-${option.value}`}
              className={`relative flex h-9 cursor-pointer items-center justify-center rounded-md px-4 text-sm font-medium transition-colors duration-150 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent ${
                checked ? "bg-surface text-ink shadow-[inset_0_0_0_1px_var(--line)]" : "text-muted hover:text-ink"
              }`}
            >
              <input
                type="radio"
                name={`${name}-${id}`}
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function Group({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <h2 className="text-[17px] font-semibold leading-6 tracking-tight">{title}</h2>
        {intro && <p className="max-w-[60ch] text-sm leading-6 text-muted">{intro}</p>}
      </div>
      {children}
    </section>
  );
}
