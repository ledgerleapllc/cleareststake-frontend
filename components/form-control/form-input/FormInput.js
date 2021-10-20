import React from "react";
import "./form-input.scss";

export default function FormInput({
  type,
  required,
  value,
  placeholder,
  onChange,
  align,
  name,
  height,
  width,
}) {
  const onChangeHandler = onChange || (() => {});
  let className =
    align && align == "center"
      ? "custom-form-control text-center"
      : "custom-form-control";

  const heightValue = height || "2rem";
  const widthValue = width || "100%";

  if (name) {
    return (
      <input
        type={type || "text"}
        required={required || false}
        value={value || ""}
        name={name}
        className={className}
        placeholder={placeholder || ""}
        autoComplete="off"
        autoSave="off"
        onChange={onChangeHandler}
        style={{ height: heightValue, width: widthValue }}
      />
    );
  }

  return (
    <input
      type={type || "text"}
      required={required || false}
      value={value || ""}
      className={className}
      placeholder={placeholder || ""}
      autoComplete="off"
      autoSave="off"
      onChange={onChangeHandler}
      style={{ height: heightValue, width: widthValue }}
    />
  );
}
