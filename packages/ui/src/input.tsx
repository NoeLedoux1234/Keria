import { forwardRef, useId, type InputHTMLAttributes } from "react";
import { cn } from "./utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    const errorId = useId();

    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            "border-keria-forest bg-keria-darker/50 text-keria-cream placeholder:text-keria-muted focus:border-keria-gold focus:ring-keria-gold/20 flex h-10 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-keria-error focus:border-keria-error focus:ring-keria-error/20",
            className
          )}
          ref={ref}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-keria-error-light mt-1 text-xs">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
