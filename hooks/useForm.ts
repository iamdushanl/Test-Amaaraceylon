import { useState, useCallback } from "react";

type FormErrors = Record<string, string>;
type ValidationFunction<T> = (values: T) => Promise<FormErrors | null> | FormErrors | null;

interface UseFormReturn<T extends Record<string, any>> {
  values: T;
  errors: FormErrors;
  isLoading: boolean;
  isSubmitted: boolean;
  touched: Record<string, boolean>;
  setValues: (values: T | ((prev: T) => T)) => void;
  setErrors: (errors: FormErrors | ((prev: FormErrors) => FormErrors)) => void;
  setFieldError: (fieldName: string, error: string) => void;
  clearFieldError: (fieldName: string) => void;
  setFieldValue: (fieldName: string, value: any) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
}

export function useForm<T extends Record<string, any>>(
  initialValues: T,
  onSubmit: (values: T) => Promise<void> | void,
  validate?: ValidationFunction<T>,
): UseFormReturn<T> {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      const finalValue =
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

      setValues((prev) => ({
        ...prev,
        [name]: finalValue,
      }));

      // Clear error for this field on change if it was previously touched
      if (errors[name] && touched[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    },
    [errors, touched],
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name } = e.target;
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));
    },
    [],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setIsSubmitted(true);

      try {
        // Run custom validation if provided
        let validationErrors: FormErrors | null = null;
        if (validate) {
          validationErrors = await validate(values);
        }

        if (validationErrors && Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
          setIsLoading(false);
          return;
        }

        // Mark all fields as touched when submitting
        const allTouched = Object.keys(values).reduce(
          (acc, key) => {
            acc[key] = true;
            return acc;
          },
          {} as Record<string, boolean>
        );
        setTouched(allTouched);

        await onSubmit(values);
        setErrors({});
      } catch (error) {
        console.error("Form submission error:", error);
        setErrors({
          _form: error instanceof Error ? error.message : "An error occurred while submitting the form",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [values, validate, onSubmit],
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitted(false);
    setTouched({});
  }, [initialValues]);

  const setFieldError = useCallback((fieldName: string, error: string) => {
    setErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));
  }, []);

  const clearFieldError = useCallback((fieldName: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  const setFieldValue = useCallback((fieldName: string, value: any) => {
    setValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  }, []);

  return {
    values,
    errors,
    isLoading,
    isSubmitted,
    touched,
    setValues,
    setErrors,
    setFieldError,
    clearFieldError,
    setFieldValue,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
  };
}
