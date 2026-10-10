
function FormField({ label, name, type = "text", value, onChange, icon: Icon,
                     error, placeholder, autoComplete, labelInside = false,}) 

{
  const borderClass = error
    ? "border-red-400"
    : "border-gray-200 focus-within:border-brand-500";
  const verticalPadding = labelInside ? "py-1.5" : "py-2.5";

  return (
    <div>
      <div
        className={`flex items-center gap-3 rounded-lg border bg-white px-3 ${verticalPadding} ${borderClass}`}
      >
        <Icon size={18} className="shrink-0 text-gray-400" />
        <div className="flex-1">
          {labelInside && (
            <label htmlFor={name} className="block text-[11px] text-gray-400">
              {label}
            </label>
          )}
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            autoComplete={autoComplete}
            aria-label={labelInside ? undefined : label}
            className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400" />
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export default FormField;
