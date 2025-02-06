import { useState } from 'react';

const FloatLabel = (props: any) => {
  const [focus, setFocus] = useState(false);
  const { children, label, value, classNameLable } = props;

  const labelClass = focus || (value && value.length !== 0) ? 'top-[6px]' : '';

  return (
    <div className="relative" onBlur={() => setFocus(false)} onFocus={() => setFocus(true)}>
      {children}
      <label
        className={`text-xs absolute left-[12px] block top-[6px] transition-all text-[#217ca3] ${labelClass} ${classNameLable} `}
      >
        {label}
      </label>
    </div>
  );
};

export default FloatLabel;
