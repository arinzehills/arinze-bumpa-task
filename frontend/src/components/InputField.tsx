import React, { useState } from 'react'

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  onRightIconClick?: () => void
  obscureText?: boolean
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      onRightIconClick,
      obscureText = false,
      type = 'text',
      className = '',
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false)

    const inputType =
      type === 'password' ? (showPassword ? 'text' : 'password') : type

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-primary mb-2">
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            type={inputType}
            className={`input-field ${leftIcon ? 'pl-10' : ''} ${rightIcon || (type === 'password' && obscureText) ? 'pr-10' : ''} ${error ? 'border-error' : ''} ${className}`}
            {...props}
          />

          {(rightIcon || (type === 'password' && obscureText)) && (
            <button
              type="button"
              onClick={() => {
                if (type === 'password' && obscureText) {
                  setShowPassword(!showPassword)
                } else {
                  onRightIconClick?.()
                }
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
            >
              {rightIcon}
            </button>
          )}
        </div>

        {error && <p className="text-error text-sm mt-1">{error}</p>}
        {helperText && !error && (
          <p className="text-text-muted text-sm mt-1">{helperText}</p>
        )}
      </div>
    )
  }
)

InputField.displayName = 'InputField'