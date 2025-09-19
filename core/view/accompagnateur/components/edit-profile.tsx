"use client";

import React, { useState, KeyboardEvent } from "react";
import { Check, X, Edit2 } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import { Input } from "@/core/components/ui/input";
import { Label } from "@/core/components/ui/label";
 

// Types pour le composant EditableField
interface EditableFieldProps<T = any> {
  value: T;
  onSave: (value: T) => void;
  label: string;
  icon?: React.ReactNode;
  type?: "text" | "email" | "tel" | "date";
  placeholder?: string;
  validator?: (value: T) => true | string;
  formatter?: (value: T) => string;
  className?: string;
}

export function EditableField<T = any>({
  value,
  onSave,
  label,
  icon,
  type = "text",
  placeholder,
  validator,
  formatter,
  className = "",
}: EditableFieldProps<T>) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState<string>("");
  const [error, setError] = useState<string>("");

  const startEditing = () => {
    setIsEditing(true);
    const inputValue =
      type === "date" && value instanceof Date
        ? value.toISOString().split("T")[0]
        : String(value ?? "");
    setTempValue(inputValue);
    setError("");
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setTempValue("");
    setError("");
  };

  const saveValue = () => {
    try {
      let valueToSave: any = tempValue;

      if (type === "date") {
        valueToSave = new Date(tempValue);
      }

      if (validator) {
        const validationResult = validator(valueToSave);
        if (validationResult !== true) {
          setError(validationResult);
          return;
        }
      }

      onSave(valueToSave);
      setIsEditing(false);
      setTempValue("");
      setError("");
    } catch (err: any) {
      setError(err.message || "Erreur de validation");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      saveValue();
    } else if (e.key === "Escape") {
      cancelEditing();
    }
  };

  const displayValue = formatter ? formatter(value) : String(value ?? "");

  return (
    <div className={`space-y-2 ${className}`}>
      <Label className="flex items-center gap-2 text-gray-600">
        {icon}
        {label}
      </Label>

      {isEditing ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Input
              type={type}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              onBlur={saveValue}
              onKeyDown={handleKeyDown}
              placeholder={placeholder || `Entrez ${label.toLowerCase()}`}
              autoFocus
              className={error ? "border-red-500" : ""}
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={saveValue}
              className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={cancelEditing}
              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      ) : (
        <div
          className="group flex items-center justify-between p-2 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
          onClick={startEditing}
        >
          <p className="text-gray-900 font-medium">{displayValue}</p>
          <Edit2 className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )}
    </div>
  );
}

 