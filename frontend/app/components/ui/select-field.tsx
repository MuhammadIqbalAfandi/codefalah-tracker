import { Check, ChevronDown } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";

import { useTranslations } from "~/lib/localization";
import { cn } from "~/lib/utils";

export type SelectFieldOption = {
  value: string;
  label: string;
  description?: string;
};

type SelectFieldProps = {
  name?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  options: SelectFieldOption[];
  placeholder?: string;
  helperText?: ReactNode;
  disabled?: boolean;
  className?: string;
  compact?: boolean;
};

export function SelectField({
  name,
  value,
  defaultValue,
  onValueChange,
  options,
  placeholder,
  helperText,
  disabled,
  className,
  compact = false,
}: SelectFieldProps) {
  const t = useTranslations();
  const containerRef = useRef<HTMLDivElement>(null);
  const isControlled = value !== undefined;
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");

  useEffect(() => {
    if (!isControlled) {
      setInternalValue(defaultValue ?? "");
    }
  }, [defaultValue, isControlled]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const currentValue = isControlled ? value ?? "" : internalValue;
  const selectedOption = options.find((option) => option.value === currentValue);
  const resolvedPlaceholder = placeholder ?? t.common.selectOption;
  const selectedDescription =
    selectedOption?.description ?? helperText ?? resolvedPlaceholder;

  function commitValue(nextValue: string) {
    if (!isControlled) {
      setInternalValue(nextValue);
    }

    onValueChange?.(nextValue);
    setOpen(false);
  }

  function handleTriggerKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen(true);
    }
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {name ? <input type="hidden" name={name} value={currentValue} /> : null}

      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => {
          if (!disabled) {
            setOpen((current) => !current);
          }
        }}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          "flex min-h-11 w-full items-center gap-3 rounded-xl border border-input bg-background px-3 py-2 text-left shadow-sm transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
          compact && "min-h-10 gap-2 px-3 py-2",
          disabled && "cursor-not-allowed bg-muted text-muted-foreground",
        )}
      >
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "truncate text-sm font-medium text-foreground",
              compact && "text-sm",
              !selectedOption && "text-muted-foreground",
              disabled && "text-muted-foreground",
            )}
          >
            {selectedOption?.label ?? resolvedPlaceholder}
          </p>
          {!compact ? (
            <p className="truncate text-xs text-muted-foreground">
              {selectedDescription}
            </p>
          ) : null}
        </div>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div
          role="listbox"
          className="absolute left-0 right-0 z-30 mt-2 overflow-hidden rounded-2xl border border-border bg-popover shadow-xl"
        >
          <div className="grid gap-1 p-2">
            {options.map((option) => {
              const isSelected = option.value === currentValue;
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => commitValue(option.value)}
                  className={cn(
                    "flex w-full items-start justify-between gap-3 rounded-xl px-3 py-2 text-left transition-colors",
                    isSelected ? "bg-muted text-foreground" : "hover:bg-muted/70",
                  )}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{option.label}</p>
                    {!compact && option.description ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {option.description}
                      </p>
                    ) : null}
                  </div>
                  {isSelected ? (
                    <Check className="mt-0.5 size-4 shrink-0 text-foreground" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
