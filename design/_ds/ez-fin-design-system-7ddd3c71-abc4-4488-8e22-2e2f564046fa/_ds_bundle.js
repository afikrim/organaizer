/* @ds-bundle: {"format":3,"namespace":"EzFinDesignSystem_7ddd3c","components":[{"name":"Button","sourcePath":"components/buttons/Button.jsx"},{"name":"Badge","sourcePath":"components/data-display/Badge.jsx"},{"name":"Card","sourcePath":"components/data-display/Card.jsx"},{"name":"PricingCard","sourcePath":"components/data-display/PricingCard.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"BalancesOverview","sourcePath":"ui_kits/dashboard/BalancesOverview.jsx"},{"name":"DashSidebar","sourcePath":"ui_kits/dashboard/DashSidebar.jsx"},{"name":"DashTopbar","sourcePath":"ui_kits/dashboard/DashTopbar.jsx"},{"name":"PaymentsOverview","sourcePath":"ui_kits/dashboard/PaymentsOverview.jsx"},{"name":"Features","sourcePath":"ui_kits/marketing/Features.jsx"},{"name":"LogoStrip","sourcePath":"ui_kits/marketing/Features.jsx"},{"name":"Footer","sourcePath":"ui_kits/marketing/Footer.jsx"},{"name":"Hero","sourcePath":"ui_kits/marketing/Hero.jsx"},{"name":"MarketingNav","sourcePath":"ui_kits/marketing/MarketingNav.jsx"},{"name":"Pricing","sourcePath":"ui_kits/marketing/Pricing.jsx"}],"sourceHashes":{"components/buttons/Button.jsx":"5807ef91a880","components/data-display/Badge.jsx":"01285877ecc7","components/data-display/Card.jsx":"af58d99f1a63","components/data-display/PricingCard.jsx":"70eab1388d3c","components/forms/Checkbox.jsx":"d853f301cc62","components/forms/Input.jsx":"229aa4114891","components/forms/Select.jsx":"cc78639e7158","components/forms/Switch.jsx":"d72f01b21828","ui_kits/dashboard/BalancesOverview.jsx":"cf8cf376d236","ui_kits/dashboard/DashSidebar.jsx":"19b2e5f45f59","ui_kits/dashboard/DashTopbar.jsx":"6f4ad587246b","ui_kits/dashboard/PaymentsOverview.jsx":"7962aa7984ce","ui_kits/marketing/Features.jsx":"89546c0d6d4e","ui_kits/marketing/Footer.jsx":"3d9d5edf06ea","ui_kits/marketing/Hero.jsx":"4f7782c64e1d","ui_kits/marketing/MarketingNav.jsx":"f460783d8ecb","ui_kits/marketing/Pricing.jsx":"0c7c01c15c01"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.EzFinDesignSystem_7ddd3c = window.EzFinDesignSystem_7ddd3c || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/buttons/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Ez Fin Button — pill-shaped, tight padding. The filled indigo `primary`
 * is the dominant CTA system-wide; use it sparingly (one per band).
 */
function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  iconLeft = null,
  iconRight = null,
  children,
  style = {},
  ...rest
}) {
  const [pressed, setPressed] = React.useState(false);
  const sizes = {
    md: {
      fontSize: 'var(--type-button-md-size)',
      padding: '8px 16px'
    },
    sm: {
      fontSize: 'var(--type-button-sm-size)',
      padding: '6px 14px'
    }
  };
  const variants = {
    primary: {
      background: pressed ? 'var(--primary-press)' : 'var(--primary)',
      color: 'var(--on-primary)',
      border: '1px solid transparent'
    },
    secondary: {
      background: 'var(--canvas)',
      color: 'var(--primary)',
      border: '1px solid var(--primary)'
    },
    'on-dark': {
      background: 'var(--brand-dark-900)',
      color: 'var(--on-primary)',
      border: '1px solid transparent'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--primary)',
      border: '1px solid transparent'
    }
  };
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: 'var(--font-display)',
    fontWeight: 'var(--weight-regular)',
    lineHeight: 1,
    letterSpacing: 0,
    borderRadius: 'var(--radius-pill)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    transition: 'background 120ms ease, transform 80ms ease, box-shadow 120ms ease',
    transform: pressed ? 'translateY(0.5px)' : 'none',
    whiteSpace: 'nowrap',
    minHeight: size === 'sm' ? '32px' : '38px',
    ...sizes[size],
    ...variants[variant],
    ...style
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    style: base,
    disabled: disabled,
    onMouseDown: () => !disabled && setPressed(true),
    onMouseUp: () => setPressed(false),
    onMouseLeave: () => setPressed(false)
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/buttons/Button.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Ez Fin badge / tag pill. `soft` is the signature subdued-indigo eyebrow.
 * Status tones (success/warn/error/neutral) for product UI.
 */
function Badge({
  tone = 'soft',
  children,
  style = {},
  ...rest
}) {
  const tones = {
    soft: {
      background: 'var(--primary-subdued)',
      color: 'var(--primary-deep)'
    },
    indigo: {
      background: 'var(--primary)',
      color: 'var(--on-primary)'
    },
    neutral: {
      background: '#eef2f7',
      color: 'var(--ink-secondary)'
    },
    success: {
      background: 'rgba(31,138,91,0.12)',
      color: '#1f8a5b'
    },
    warn: {
      background: 'rgba(155,104,41,0.14)',
      color: 'var(--lemon)'
    },
    error: {
      background: 'rgba(234,34,97,0.12)',
      color: 'var(--ruby)'
    }
  };
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    fontFamily: 'var(--font-display)',
    fontWeight: 400,
    fontSize: 'var(--type-micro-cap-size)',
    lineHeight: 1.15,
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    padding: '4px 8px',
    borderRadius: 'var(--radius-pill)',
    whiteSpace: 'nowrap',
    ...tones[tone],
    ...style
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: base
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/data-display/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Ez Fin surface card. `light` on white, `cream` warm interlude,
 * `dark` deep-navy. Level-1 shadow optional via `elevated`.
 */
function Card({
  variant = 'light',
  elevated = false,
  padding,
  children,
  style = {},
  ...rest
}) {
  const variants = {
    light: {
      background: 'var(--canvas)',
      color: 'var(--ink)',
      border: '1px solid var(--hairline)'
    },
    cream: {
      background: 'var(--canvas-cream)',
      color: 'var(--ink)',
      border: '1px solid rgba(155,104,41,0.14)'
    },
    soft: {
      background: 'var(--canvas-soft)',
      color: 'var(--ink)',
      border: '1px solid var(--hairline)'
    },
    dark: {
      background: 'var(--brand-dark-900)',
      color: 'var(--on-primary)',
      border: '1px solid rgba(255,255,255,0.08)'
    }
  };
  const base = {
    borderRadius: 'var(--radius-lg)',
    padding: padding || 'var(--card-pad)',
    boxShadow: elevated ? 'rgba(0,55,112,0.08) 0 1px 3px' : 'none',
    fontFamily: 'var(--font-body)',
    ...variants[variant],
    ...style
  };
  return /*#__PURE__*/React.createElement("div", _extends({
    style: base
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/Card.jsx", error: String((e && e.message) || e) }); }

// components/data-display/PricingCard.jsx
try { (() => {
/**
 * Ez Fin pricing tier card. `featured` flips to the deep-navy inverted
 * treatment — the brand's distinctive featured-tier choice.
 */
function PricingCard({
  name,
  price,
  cadence = '/mo',
  description,
  features = [],
  cta = 'Start now',
  featured = false,
  badge,
  onCta,
  style = {}
}) {
  const dark = featured;
  const wrap = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-xl)',
    background: dark ? 'var(--brand-dark-900)' : 'var(--canvas)',
    color: dark ? 'var(--on-primary)' : 'var(--ink)',
    border: dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid var(--hairline)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--card-pad)',
    boxShadow: dark ? 'rgba(0,55,112,0.18) 0 8px 24px' : 'rgba(0,55,112,0.08) 0 1px 3px',
    fontFamily: 'var(--font-body)',
    width: '100%',
    boxSizing: 'border-box',
    ...style
  };
  const muted = dark ? 'rgba(255,255,255,0.62)' : 'var(--ink-mute)';
  return /*#__PURE__*/React.createElement("div", {
    style: wrap
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontWeight: 300,
      fontSize: 'var(--type-heading-lg-size)',
      letterSpacing: 'var(--type-heading-lg-ls)'
    }
  }, name), badge && /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: dark ? 'indigo' : 'soft'
  }, badge)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 6,
      fontVariantNumeric: 'tabular-nums'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 300,
      fontSize: 'var(--type-display-md-size)',
      letterSpacing: 'var(--type-display-md-ls)'
    }
  }, price), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--type-body-md-size)',
      color: muted
    }
  }, cadence)), description && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--type-body-md-size)',
      fontWeight: 300,
      color: muted,
      lineHeight: 1.4
    }
  }, description), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: dark ? 'rgba(255,255,255,0.1)' : 'var(--hairline)'
    }
  }), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      flex: 1
    }
  }, features.map((f, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 8,
      fontSize: 'var(--type-body-md-size)',
      fontWeight: 300
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 16 16",
    fill: "none",
    style: {
      flexShrink: 0,
      marginTop: 3
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3.5 8.4l3 3 6-7",
    stroke: dark ? 'var(--primary-soft)' : 'var(--primary)',
    strokeWidth: "1.6",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })), /*#__PURE__*/React.createElement("span", null, f)))), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: dark ? 'primary' : featured ? 'primary' : 'secondary',
    onClick: onCta,
    style: {
      width: '100%'
    }
  }, cta));
}
Object.assign(__ds_scope, { PricingCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data-display/PricingCard.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
/**
 * Ez Fin checkbox — square 6px box, indigo fill + white check when on.
 */
function Checkbox({
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  label,
  style = {}
}) {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = React.useState(defaultChecked);
  const on = isControlled ? checked : internal;
  const toggle = () => {
    if (disabled) return;
    if (!isControlled) setInternal(!on);
    onChange && onChange(!on);
  };
  const box = {
    width: 18,
    height: 18,
    borderRadius: 'var(--radius-xs)',
    border: `1px solid ${on ? 'var(--primary)' : 'var(--hairline-input)'}`,
    background: on ? 'var(--primary)' : 'var(--canvas)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'background 120ms ease, border-color 120ms ease'
  };
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      fontFamily: 'var(--font-body)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    role: "checkbox",
    "aria-checked": on,
    onClick: toggle,
    style: box
  }, on && /*#__PURE__*/React.createElement("svg", {
    width: "11",
    height: "11",
    viewBox: "0 0 12 12",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2.5 6.2l2.2 2.3 4.8-5",
    stroke: "#fff",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--type-body-md-size)',
      fontWeight: 300,
      color: 'var(--ink)'
    }
  }, label));
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Ez Fin text input — 6px radius, cool hairline border that swaps to
 * indigo on focus. Supports label, helper text and error state.
 */
function Input({
  label,
  helper,
  error,
  prefix = null,
  type = 'text',
  disabled = false,
  style = {},
  id,
  ...rest
}) {
  const [focused, setFocused] = React.useState(false);
  const inputId = id || React.useId();
  const wrap = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    fontFamily: 'var(--font-body)',
    width: '100%'
  };
  const field = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'var(--canvas)',
    border: `1px solid ${error ? 'var(--ruby)' : focused ? 'var(--primary)' : 'var(--hairline-input)'}`,
    borderRadius: 'var(--radius-sm)',
    padding: '8px 12px',
    boxShadow: focused && !error ? '0 0 0 3px rgba(83,58,253,0.14)' : 'none',
    transition: 'border-color 120ms ease, box-shadow 120ms ease',
    opacity: disabled ? 0.55 : 1
  };
  const input = {
    border: 'none',
    outline: 'none',
    background: 'transparent',
    flex: 1,
    minWidth: 0,
    color: 'var(--ink)',
    fontFamily: 'var(--font-body)',
    fontWeight: 300,
    fontSize: 'var(--type-body-md-size)',
    lineHeight: 1.4
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontSize: 'var(--type-caption-size)',
      fontWeight: 400,
      color: 'var(--ink-secondary)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: field
  }, prefix && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--ink-mute)',
      fontSize: 14
    }
  }, prefix), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    type: type,
    disabled: disabled,
    style: input,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false)
  }, rest))), (helper || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--type-caption-size)',
      color: error ? 'var(--ruby)' : 'var(--ink-mute)'
    }
  }, error || helper));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Ez Fin select — styled native dropdown matching the text input.
 */
function Select({
  label,
  helper,
  options = [],
  disabled = false,
  style = {},
  id,
  ...rest
}) {
  const [focused, setFocused] = React.useState(false);
  const selectId = id || React.useId();
  const field = {
    appearance: 'none',
    WebkitAppearance: 'none',
    width: '100%',
    background: 'var(--canvas)',
    border: `1px solid ${focused ? 'var(--primary)' : 'var(--hairline-input)'}`,
    borderRadius: 'var(--radius-sm)',
    padding: '8px 36px 8px 12px',
    color: 'var(--ink)',
    fontFamily: 'var(--font-body)',
    fontWeight: 300,
    fontSize: 'var(--type-body-md-size)',
    lineHeight: 1.4,
    cursor: disabled ? 'not-allowed' : 'pointer',
    outline: 'none',
    boxShadow: focused ? '0 0 0 3px rgba(83,58,253,0.14)' : 'none',
    opacity: disabled ? 0.55 : 1,
    transition: 'border-color 120ms ease, box-shadow 120ms ease'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      fontFamily: 'var(--font-body)',
      width: '100%',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: selectId,
    style: {
      fontSize: 'var(--type-caption-size)',
      fontWeight: 400,
      color: 'var(--ink-secondary)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: selectId,
    disabled: disabled,
    style: field,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false)
  }, rest), options.map(o => {
    const value = typeof o === 'string' ? o : o.value;
    const text = typeof o === 'string' ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: value,
      value: value
    }, text);
  })), /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    fill: "none",
    style: {
      position: 'absolute',
      right: 12,
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M2.5 4.5L6 8l3.5-3.5",
    stroke: "var(--ink-mute)",
    strokeWidth: "1.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), helper && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--type-caption-size)',
      color: 'var(--ink-mute)'
    }
  }, helper));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
/**
 * Ez Fin toggle switch — indigo when on, pill track, smooth knob slide.
 */
function Switch({
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  label,
  style = {}
}) {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = React.useState(defaultChecked);
  const on = isControlled ? checked : internal;
  const toggle = () => {
    if (disabled) return;
    if (!isControlled) setInternal(!on);
    onChange && onChange(!on);
  };
  const track = {
    width: 38,
    height: 22,
    borderRadius: 'var(--radius-pill)',
    background: on ? 'var(--primary)' : '#cdd6e3',
    position: 'relative',
    transition: 'background 140ms ease',
    flexShrink: 0,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1
  };
  const knob = {
    position: 'absolute',
    top: 2,
    left: on ? 18 : 2,
    width: 18,
    height: 18,
    borderRadius: '50%',
    background: '#fff',
    boxShadow: '0 1px 2px rgba(0,55,112,0.3)',
    transition: 'left 140ms cubic-bezier(0.4,0,0.2,1)'
  };
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      fontFamily: 'var(--font-body)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    role: "switch",
    "aria-checked": on,
    onClick: toggle,
    style: track
  }, /*#__PURE__*/React.createElement("span", {
    style: knob
  })), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--type-body-md-size)',
      fontWeight: 300,
      color: 'var(--ink)'
    }
  }, label));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/BalancesOverview.jsx
try { (() => {
function BalancesOverview() {
  const payouts = [['po_8821', '$842,019.20', 'In transit', 'warn', 'Jun 18, 2026', 'Bank •••• 6789'], ['po_8820', '$1,204,894.00', 'Paid', 'success', 'Jun 11, 2026', 'Bank •••• 6789'], ['po_8819', '$988,210.55', 'Paid', 'success', 'Jun 04, 2026', 'Bank •••• 6789'], ['po_8818', '$1,102,440.10', 'Paid', 'success', 'May 28, 2026', 'Bank •••• 6789']];
  const th = {
    textAlign: 'left',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: 'var(--ink-mute)',
    fontWeight: 500,
    padding: '0 0 12px'
  };
  const td = {
    padding: '13px 0',
    borderTop: '1px solid var(--hairline)',
    fontSize: 14,
    fontWeight: 300,
    color: 'var(--ink)'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 28,
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.3fr 1fr',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--brand-dark-900)',
      borderRadius: 'var(--radius-lg)',
      padding: 28,
      color: '#fff',
      boxShadow: 'rgba(0,55,112,0.18) 0 8px 24px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'rgba(255,255,255,0.62)'
    }
  }, "Available balance"), /*#__PURE__*/React.createElement("div", {
    className: "tnum",
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 300,
      fontSize: 40,
      letterSpacing: '-1px',
      marginTop: 6
    }
  }, "$842,019.20"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 28,
      marginTop: 22
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'rgba(255,255,255,0.55)'
    }
  }, "Pending"), /*#__PURE__*/React.createElement("div", {
    className: "tnum",
    style: {
      fontSize: 18,
      fontWeight: 300,
      marginTop: 2
    }
  }, "$214,880.00")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'rgba(255,255,255,0.55)'
    }
  }, "In transit"), /*#__PURE__*/React.createElement("div", {
    className: "tnum",
    style: {
      fontSize: 18,
      fontWeight: 300,
      marginTop: 2
    }
  }, "$842,019.20"))), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "primary",
    size: "sm",
    style: {
      marginTop: 24
    }
  }, "Pay out now")), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--canvas)',
      border: '1px solid var(--hairline)',
      borderRadius: 'var(--radius-lg)',
      padding: 24,
      boxShadow: 'rgba(0,55,112,0.05) 0 1px 3px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--ink-mute)',
      marginBottom: 14
    }
  }, "Payout schedule"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Row, {
    k: "Cadence",
    v: "Weekly \xB7 Fridays"
  }), /*#__PURE__*/React.createElement(Row, {
    k: "Destination",
    v: "Bank \u2022\u2022\u2022\u2022 6789"
  }), /*#__PURE__*/React.createElement(Row, {
    k: "Currency",
    v: "USD"
  }), /*#__PURE__*/React.createElement(Row, {
    k: "Next payout",
    v: "Jun 18, 2026"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--canvas)',
      border: '1px solid var(--hairline)',
      borderRadius: 'var(--radius-lg)',
      padding: 24,
      boxShadow: 'rgba(0,55,112,0.05) 0 1px 3px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontWeight: 300,
      fontSize: 'var(--type-heading-md-size)',
      letterSpacing: 'var(--type-heading-md-ls)',
      color: 'var(--ink)'
    }
  }, "Payouts"), /*#__PURE__*/React.createElement("a", {
    style: {
      fontSize: 13,
      color: 'var(--primary)',
      textDecoration: 'none',
      cursor: 'pointer'
    }
  }, "Export \u2192")), /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Amount"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Status"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Destination"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      textAlign: 'right'
    }
  }, "Arrival date"))), /*#__PURE__*/React.createElement("tbody", null, payouts.map(p => /*#__PURE__*/React.createElement("tr", {
    key: p[0]
  }, /*#__PURE__*/React.createElement("td", {
    className: "tnum",
    style: {
      ...td,
      fontWeight: 400
    }
  }, p[1]), /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: p[3]
  }, p[2])), /*#__PURE__*/React.createElement("td", {
    className: "tnum",
    style: {
      ...td,
      color: 'var(--ink-secondary)'
    }
  }, p[5]), /*#__PURE__*/React.createElement("td", {
    className: "tnum",
    style: {
      ...td,
      textAlign: 'right',
      color: 'var(--ink-mute)'
    }
  }, p[4])))))));
}
function Row({
  k,
  v
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--ink-mute)'
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    className: "tnum",
    style: {
      fontSize: 14,
      fontWeight: 300,
      color: 'var(--ink)'
    }
  }, v));
}
Object.assign(__ds_scope, { BalancesOverview });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/BalancesOverview.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/DashSidebar.jsx
try { (() => {
const NAV = [['home', 'Home', 'M3 8.5L10 3l7 5.5V17a1 1 0 01-1 1h-4v-5H8v5H4a1 1 0 01-1-1V8.5z'], ['payments', 'Payments', 'M2 6.5h16M4 4.5h12a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2v-7a2 2 0 012-2zM5 11.5h3'], ['balances', 'Balances', 'M3 5h14a1 1 0 011 1v8a1 1 0 01-1 1H3a1 1 0 01-1-1V6a1 1 0 011-1zM14 10h0.01M2 8h16'], ['customers', 'Customers', 'M7 9a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM2.5 16c0-2.5 2-4 4.5-4s4.5 1.5 4.5 4M13 9.5a2 2 0 100-4M14 16c0-2-1-3.2-2.5-3.8'], ['reports', 'Reports', 'M4 16V8M9 16V4M14 16v-6M2 16.5h16'], ['connect', 'Connect', 'M7 10a3 3 0 013-3h1a3 3 0 010 6M13 10a3 3 0 01-3 3H9a3 3 0 010-6']];
function DashSidebar({
  active = 'payments',
  onNavigate
}) {
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 224,
      flexShrink: 0,
      background: 'var(--brand-dark-900)',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      padding: '20px 12px',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      fontFamily: 'var(--font-body)',
      minHeight: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      padding: '6px 10px 18px'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-mark-white.png",
    alt: "Ez Fin",
    style: {
      height: 22
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 300,
      fontSize: 18,
      letterSpacing: '-0.4px',
      color: '#fff'
    }
  }, "Ez Fin")), NAV.map(([id, label, path]) => {
    const on = id === active;
    return /*#__PURE__*/React.createElement("button", {
      key: id,
      onClick: () => onNavigate && onNavigate(id),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        padding: '9px 11px',
        background: on ? 'rgba(102,94,253,0.18)' : 'transparent',
        border: 'none',
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        color: on ? '#fff' : 'rgba(255,255,255,0.62)',
        textAlign: 'left',
        width: '100%',
        fontFamily: 'var(--font-body)',
        fontSize: 14,
        fontWeight: 300,
        transition: 'background 120ms ease, color 120ms ease'
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "19",
      height: "19",
      viewBox: "0 0 20 20",
      fill: "none"
    }, /*#__PURE__*/React.createElement("path", {
      d: path,
      stroke: on ? 'var(--primary-soft)' : 'rgba(255,255,255,0.55)',
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    })), label);
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto',
      padding: '10px',
      display: 'flex',
      alignItems: 'center',
      gap: 9,
      borderTop: '1px solid rgba(255,255,255,0.06)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 28,
      height: 28,
      borderRadius: '50%',
      background: 'var(--primary)',
      color: '#fff',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 12,
      fontWeight: 500
    }
  }, "AC"), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: '#fff',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, "Acme Inc."), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'rgba(255,255,255,0.5)'
    }
  }, "Live mode"))));
}
Object.assign(__ds_scope, { DashSidebar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/DashSidebar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/DashTopbar.jsx
try { (() => {
function DashTopbar({
  title,
  testMode,
  onTestMode
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 28px',
      borderBottom: '1px solid var(--hairline)',
      background: 'var(--canvas)',
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontWeight: 300,
      fontSize: 'var(--type-heading-lg-size)',
      letterSpacing: 'var(--type-heading-lg-ls)',
      color: 'var(--ink)'
    }
  }, title)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("input", {
    placeholder: "Search\u2026",
    style: {
      border: '1px solid var(--hairline-input)',
      borderRadius: 'var(--radius-sm)',
      padding: '7px 12px 7px 32px',
      fontFamily: 'var(--font-body)',
      fontWeight: 300,
      fontSize: 14,
      color: 'var(--ink)',
      width: 200,
      outline: 'none',
      background: 'var(--canvas)'
    }
  }), /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 16 16",
    fill: "none",
    style: {
      position: 'absolute',
      left: 10,
      top: '50%',
      transform: 'translateY(-50%)'
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "7",
    r: "4.5",
    stroke: "var(--ink-mute)",
    strokeWidth: "1.4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M11 11l3 3",
    stroke: "var(--ink-mute)",
    strokeWidth: "1.4",
    strokeLinecap: "round"
  }))), /*#__PURE__*/React.createElement(__ds_scope.Switch, {
    checked: testMode,
    onChange: onTestMode,
    label: "Test mode"
  }), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "primary",
    size: "sm",
    iconLeft: /*#__PURE__*/React.createElement("svg", {
      width: "13",
      height: "13",
      viewBox: "0 0 14 14",
      fill: "none"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M7 3v8M3 7h8",
      stroke: "#fff",
      strokeWidth: "1.5",
      strokeLinecap: "round"
    }))
  }, "New payment")));
}
Object.assign(__ds_scope, { DashTopbar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/DashTopbar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/dashboard/PaymentsOverview.jsx
try { (() => {
function Stat({
  label,
  value,
  delta,
  positive = true
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--canvas)',
      border: '1px solid var(--hairline)',
      borderRadius: 'var(--radius-lg)',
      padding: 20,
      flex: 1,
      boxShadow: 'rgba(0,55,112,0.05) 0 1px 3px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--ink-mute)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "tnum",
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 300,
      fontSize: 28,
      letterSpacing: '-0.6px',
      color: 'var(--ink)',
      marginTop: 6
    }
  }, value), delta && /*#__PURE__*/React.createElement("div", {
    className: "tnum",
    style: {
      fontSize: 12,
      color: positive ? '#1f8a5b' : 'var(--ruby)',
      marginTop: 4
    }
  }, positive ? '▲' : '▼', " ", delta));
}
function Chart() {
  const bars = [42, 38, 52, 48, 60, 55, 70, 64, 78, 72, 88, 95];
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const max = 100;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--canvas)',
      border: '1px solid var(--hairline)',
      borderRadius: 'var(--radius-lg)',
      padding: 24,
      boxShadow: 'rgba(0,55,112,0.05) 0 1px 3px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--ink-mute)'
    }
  }, "Gross volume"), /*#__PURE__*/React.createElement("div", {
    className: "tnum",
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 300,
      fontSize: 30,
      letterSpacing: '-0.7px',
      color: 'var(--ink)',
      marginTop: 2
    }
  }, "$1,284,019.40")), /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "success"
  }, "\u25B2 12.4%")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: 10,
      height: 150
    }
  }, bars.map((b, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: `${b / max * 130}px`,
      background: i === bars.length - 1 ? 'var(--primary)' : 'var(--primary-subdued)',
      borderRadius: '4px 4px 0 0',
      transition: 'height 200ms ease'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: 'var(--ink-mute)'
    }
  }, labels[i])))));
}
function TransactionsTable() {
  const rows = [['ch_3PJ1', 'Acme Inc.', 'Visa •••• 4242', '$4,200.00', 'success', 'Succeeded', 'Today, 14:32'], ['ch_3PIz', 'Globex LLC', 'Mastercard •••• 8851', '$1,894.50', 'success', 'Succeeded', 'Today, 13:08'], ['ch_3PIx', 'Initech', 'ACH transfer', '$12,400.00', 'warn', 'Pending', 'Today, 11:54'], ['ch_3PIv', 'Umbrella Corp', 'Visa •••• 7781', '$820.00', 'success', 'Succeeded', 'Today, 10:21'], ['ch_3PIt', 'Soylent Co.', 'Visa •••• 0199', '$640.00', 'error', 'Failed', 'Yesterday, 18:40'], ['ch_3PIr', 'Hooli', 'Amex •••• 0005', '$3,150.00', 'success', 'Succeeded', 'Yesterday, 16:12']];
  const th = {
    textAlign: 'left',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: 'var(--ink-mute)',
    fontWeight: 500,
    padding: '0 0 12px'
  };
  const td = {
    padding: '13px 0',
    borderTop: '1px solid var(--hairline)',
    fontSize: 14,
    fontWeight: 300,
    color: 'var(--ink)'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--canvas)',
      border: '1px solid var(--hairline)',
      borderRadius: 'var(--radius-lg)',
      padding: 24,
      boxShadow: 'rgba(0,55,112,0.05) 0 1px 3px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontWeight: 300,
      fontSize: 'var(--type-heading-md-size)',
      letterSpacing: 'var(--type-heading-md-ls)',
      color: 'var(--ink)'
    }
  }, "Payments"), /*#__PURE__*/React.createElement("a", {
    style: {
      fontSize: 13,
      color: 'var(--primary)',
      textDecoration: 'none',
      cursor: 'pointer'
    }
  }, "View all \u2192")), /*#__PURE__*/React.createElement("table", {
    style: {
      width: '100%',
      borderCollapse: 'collapse'
    }
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Amount"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Customer"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Method"), /*#__PURE__*/React.createElement("th", {
    style: th
  }, "Status"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...th,
      textAlign: 'right'
    }
  }, "Date"))), /*#__PURE__*/React.createElement("tbody", null, rows.map(r => /*#__PURE__*/React.createElement("tr", {
    key: r[0]
  }, /*#__PURE__*/React.createElement("td", {
    className: "tnum",
    style: {
      ...td,
      fontWeight: 400
    }
  }, r[3]), /*#__PURE__*/React.createElement("td", {
    style: td
  }, r[1]), /*#__PURE__*/React.createElement("td", {
    className: "tnum",
    style: {
      ...td,
      color: 'var(--ink-secondary)'
    }
  }, r[2]), /*#__PURE__*/React.createElement("td", {
    style: td
  }, /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: r[4]
  }, r[5])), /*#__PURE__*/React.createElement("td", {
    className: "tnum",
    style: {
      ...td,
      textAlign: 'right',
      color: 'var(--ink-mute)'
    }
  }, r[6]))))));
}
function PaymentsOverview() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 28,
      display: 'flex',
      flexDirection: 'column',
      gap: 18,
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement(Stat, {
    label: "Net volume",
    value: "$1.28M",
    delta: "12.4% MoM"
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "Successful payments",
    value: "1,204",
    delta: "8.1% MoM"
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "Available balance",
    value: "$842,019.20"
  }), /*#__PURE__*/React.createElement(Stat, {
    label: "Failed payments",
    value: "38",
    delta: "2.3% MoM",
    positive: false
  })), /*#__PURE__*/React.createElement(Chart, null), /*#__PURE__*/React.createElement(TransactionsTable, null));
}
Object.assign(__ds_scope, { PaymentsOverview });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/dashboard/PaymentsOverview.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Features.jsx
try { (() => {
const ICONS = {
  payments: 'M2 6.5h16M2 6.5a2 2 0 012-2h12a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2v-7zM5 11.5h3',
  payouts: 'M10 3v10M10 13l-3.5-3.5M10 13l3.5-3.5M3.5 16.5h13',
  fraud: 'M10 2.5l6 2.5v4c0 4-2.7 6.7-6 8-3.3-1.3-6-4-6-8v-4l6-2.5z',
  global: 'M10 2.5a7.5 7.5 0 100 15 7.5 7.5 0 000-15zM2.5 10h15M10 2.5c2 2 3 5 3 7.5s-1 5.5-3 7.5c-2-2-3-5-3-7.5s1-5.5 3-7.5z'
};
function FeatureIcon({
  path
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 10,
      background: 'var(--primary-subdued)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "20",
    height: "20",
    viewBox: "0 0 20 20",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: path,
    stroke: "var(--primary-deep)",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })));
}
function Features() {
  const feats = [['payments', 'Accept payments', 'Take cards, wallets, and bank transfers in 135+ currencies with one integration.'], ['payouts', 'Instant payouts', 'Move money to your bank account in seconds, around the clock — including weekends.'], ['fraud', 'Fraud protection', 'Machine-learning fraud tools trained on billions of transactions, built in by default.'], ['global', 'Global scale', 'A single platform that grows from your first dollar to your billionth, worldwide.']];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--canvas)',
      padding: '88px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '0 40px',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "soft"
  }, "Platform"), /*#__PURE__*/React.createElement("h2", {
    className: "type-display-xl",
    style: {
      margin: '18px 0 0',
      color: 'var(--ink)',
      maxWidth: 640
    }
  }, "Everything you need to move money"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '16px 0 0',
      maxWidth: 540,
      fontSize: 16,
      fontWeight: 300,
      color: 'var(--ink-mute)',
      lineHeight: 1.5
    }
  }, "A complete, unified platform \u2014 so you can spend less time stitching tools together and more time building."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 20,
      marginTop: 44
    }
  }, feats.map(([icon, title, body]) => /*#__PURE__*/React.createElement(__ds_scope.Card, {
    key: title,
    variant: "light",
    elevated: true,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(FeatureIcon, {
    path: ICONS[icon]
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontWeight: 300,
      fontSize: 'var(--type-heading-lg-size)',
      letterSpacing: 'var(--type-heading-lg-ls)',
      color: 'var(--ink)'
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 15,
      fontWeight: 300,
      color: 'var(--ink-mute)',
      lineHeight: 1.5
    }
  }, body)))), /*#__PURE__*/React.createElement(__ds_scope.Card, {
    variant: "cream",
    style: {
      marginTop: 20,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 32,
      padding: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 560
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontWeight: 300,
      fontSize: 'var(--type-display-lg-size)',
      letterSpacing: 'var(--type-display-lg-ls)',
      color: 'var(--ink)'
    }
  }, "One transparent rate. No hidden fees."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '12px 0 0',
      fontSize: 15,
      fontWeight: 300,
      color: 'var(--ink-secondary)',
      lineHeight: 1.5
    }
  }, "Pay only when you get paid. No setup fees, no monthly fees, no surprises.")), /*#__PURE__*/React.createElement("div", {
    className: "tnum",
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 300,
      fontSize: 52,
      letterSpacing: '-1.2px',
      color: 'var(--ink)',
      whiteSpace: 'nowrap'
    }
  }, "2.9%", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 22,
      color: 'var(--ink-mute)'
    }
  }, " + 30\xA2")))));
}
function LogoStrip() {
  const names = ['Acme', 'Globex', 'Initech', 'Umbrella', 'Soylent', 'Hooli'];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--canvas-soft)',
      padding: '40px 0',
      borderTop: '1px solid var(--hairline)',
      borderBottom: '1px solid var(--hairline)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '0 40px',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      color: 'var(--ink-mute)',
      textAlign: 'center',
      marginBottom: 24
    }
  }, "Trusted by ambitious companies of every size"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 24
    }
  }, names.map(n => /*#__PURE__*/React.createElement("span", {
    key: n,
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 300,
      fontSize: 24,
      letterSpacing: '-0.5px',
      color: 'var(--ink-mute)',
      opacity: 0.7
    }
  }, n)))));
}
Object.assign(__ds_scope, { Features, LogoStrip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Features.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Footer.jsx
try { (() => {
function Footer() {
  const cols = [['Products', ['Payments', 'Billing', 'Connect', 'Payouts', 'Radar']], ['Developers', ['Documentation', 'API reference', 'Status', 'Changelog']], ['Company', ['About', 'Customers', 'Careers', 'Blog']], ['Resources', ['Support', 'Pricing', 'Guides', 'Contact']]];
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--canvas)',
      borderTop: '1px solid var(--hairline)',
      padding: '64px 0 40px',
      fontFamily: 'var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '0 40px',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.4fr repeat(4, 1fr)',
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-mark-trim.png",
    alt: "Ez Fin",
    style: {
      height: 24
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 300,
      fontSize: 19,
      letterSpacing: '-0.5px',
      color: 'var(--ink)'
    }
  }, "Ez Fin")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 13,
      color: 'var(--ink-mute)',
      maxWidth: 220,
      lineHeight: 1.5
    }
  }, "Financial infrastructure for the internet.")), cols.map(([title, links]) => /*#__PURE__*/React.createElement("div", {
    key: title
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      color: 'var(--ink-secondary)',
      fontWeight: 500,
      marginBottom: 14
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    style: {
      fontSize: 13,
      color: 'var(--ink-mute)',
      textDecoration: 'none',
      cursor: 'pointer'
    }
  }, l)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 48,
      paddingTop: 24,
      borderTop: '1px solid var(--hairline)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--ink-mute)'
    }
  }, "\xA9 2026 Ez Fin, Inc. All rights reserved."), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--ink-mute)'
    }
  }, "Terms \xB7 Privacy \xB7 Cookies"))));
}
Object.assign(__ds_scope, { Footer });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Hero.jsx
try { (() => {
/**
 * Marketing hero on the signature gradient mesh, with a floating
 * dashboard-mockup composite.
 */
function Hero({
  onStart
}) {
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'relative',
      backgroundImage: "url('../../assets/gradient-mesh.png')",
      backgroundSize: '100% 620px',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center top',
      paddingBottom: 80
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '0 40px',
      boxSizing: 'border-box'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 72,
      maxWidth: 720
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "soft",
    style: {
      marginBottom: 20
    }
  }, "Financial infrastructure"), /*#__PURE__*/React.createElement("h1", {
    className: "type-display-xxl",
    style: {
      margin: 0,
      color: 'var(--ink)',
      fontSize: 'clamp(40px, 6vw, 64px)',
      letterSpacing: '-1.6px',
      lineHeight: 1.02
    }
  }, "Payments infrastructure for the internet"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '24px 0 0',
      maxWidth: 540,
      fontSize: 18,
      fontWeight: 300,
      color: 'var(--ink-secondary)',
      lineHeight: 1.5
    }
  }, "Millions of businesses of all sizes use Ez Fin to accept payments, send payouts, and manage their finances online."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14,
      marginTop: 32
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "primary",
    onClick: onStart,
    iconRight: /*#__PURE__*/React.createElement("svg", {
      width: "13",
      height: "13",
      viewBox: "0 0 14 14",
      fill: "none"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M3 7h8M7.5 3.5L11 7l-3.5 3.5",
      stroke: "#fff",
      strokeWidth: "1.5",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }))
  }, "Start now"), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "secondary"
  }, "Contact sales"))), /*#__PURE__*/React.createElement(DashboardComposite, null)));
}
function DashboardComposite() {
  const rows = [['Acme Inc.', 'Visa •••• 4242', '$4,200.00', 'success', 'Paid'], ['Globex LLC', 'Mastercard •••• 8851', '$1,894.50', 'success', 'Paid'], ['Initech', 'ACH transfer', '$12,400.00', 'warn', 'Pending'], ['Soylent Co.', 'Visa •••• 0199', '$640.00', 'error', 'Failed']];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 56,
      background: 'var(--canvas)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'rgba(0,55,112,0.08) 0 8px 24px, rgba(0,55,112,0.04) 0 2px 6px',
      border: '1px solid var(--hairline)',
      overflow: 'hidden',
      display: 'grid',
      gridTemplateColumns: '1.5fr 1fr'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 28,
      borderRight: '1px solid var(--hairline)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--ink-mute)'
    }
  }, "Net volume"), /*#__PURE__*/React.createElement("div", {
    className: "tnum",
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 300,
      fontSize: 36,
      letterSpacing: '-0.8px',
      color: 'var(--ink)',
      marginTop: 4
    }
  }, "$1,284,019.40"), /*#__PURE__*/React.createElement("div", {
    className: "tnum",
    style: {
      fontSize: 13,
      color: '#1f8a5b',
      marginTop: 4
    }
  }, "\u25B2 12.4% vs last month"), /*#__PURE__*/React.createElement(Sparkline, null)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      color: 'var(--ink-mute)',
      marginBottom: 12
    }
  }, "Recent payments"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, rows.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 400,
      color: 'var(--ink)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }
  }, r[0]), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: 'var(--ink-mute)'
    }
  }, r[1])), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "tnum",
    style: {
      fontSize: 13,
      color: 'var(--ink)'
    }
  }, r[2]), /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: r[3]
  }, r[4])))))));
}
function Sparkline() {
  const pts = [28, 24, 30, 22, 34, 30, 40, 36, 48, 44, 56, 60];
  const w = 320,
    h = 90,
    max = 64;
  const step = w / (pts.length - 1);
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${i * step} ${h - p / max * h}`).join(' ');
  const area = `${d} L ${w} ${h} L 0 ${h} Z`;
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${w} ${h}`,
    style: {
      width: '100%',
      height: 90,
      marginTop: 18,
      display: 'block'
    },
    preserveAspectRatio: "none"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "spark",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "rgba(83,58,253,0.18)"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "rgba(83,58,253,0)"
  }))), /*#__PURE__*/React.createElement("path", {
    d: area,
    fill: "url(#spark)"
  }), /*#__PURE__*/React.createElement("path", {
    d: d,
    fill: "none",
    stroke: "var(--primary)",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }));
}
Object.assign(__ds_scope, { Hero });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/MarketingNav.jsx
try { (() => {
const navStyle = {
  bar: {
    position: 'relative',
    zIndex: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 40px',
    maxWidth: 'var(--container-max)',
    margin: '0 auto',
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: 'var(--font-body)'
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 10
  },
  word: {
    fontFamily: 'var(--font-display)',
    fontWeight: 300,
    fontSize: 21,
    letterSpacing: '-0.6px',
    color: 'var(--ink)'
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: 28
  },
  link: {
    fontSize: 15,
    fontWeight: 300,
    color: 'var(--ink-secondary)',
    cursor: 'pointer',
    textDecoration: 'none'
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: 18
  }
};
function MarketingNav({
  onStart,
  onSignIn
}) {
  const items = ['Payments', 'Billing', 'Connect', 'Pricing', 'Docs'];
  return /*#__PURE__*/React.createElement("nav", {
    style: navStyle.bar
  }, /*#__PURE__*/React.createElement("div", {
    style: navStyle.brand
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-mark-trim.png",
    alt: "Ez Fin",
    style: {
      height: 26
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: navStyle.word
  }, "Ez Fin")), /*#__PURE__*/React.createElement("div", {
    style: navStyle.links
  }, items.map(i => /*#__PURE__*/React.createElement("a", {
    key: i,
    style: navStyle.link
  }, i))), /*#__PURE__*/React.createElement("div", {
    style: navStyle.right
  }, /*#__PURE__*/React.createElement("a", {
    style: {
      ...navStyle.link,
      color: 'var(--ink)'
    },
    onClick: onSignIn
  }, "Sign in"), /*#__PURE__*/React.createElement("button", {
    onClick: onStart,
    style: {
      background: 'var(--primary)',
      color: '#fff',
      border: 'none',
      borderRadius: 'var(--radius-pill)',
      padding: '8px 16px',
      fontFamily: 'var(--font-display)',
      fontSize: 15,
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6
    }
  }, "Start now", /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 14 14",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 7h8M7.5 3.5L11 7l-3.5 3.5",
    stroke: "#fff",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })))));
}
Object.assign(__ds_scope, { MarketingNav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/MarketingNav.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing/Pricing.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Pricing({
  onStart
}) {
  const tiers = [{
    name: 'Starter',
    price: '2.9%',
    cadence: '+ 30¢ per transaction',
    description: 'For new businesses getting off the ground.',
    features: ['Accept all major cards', 'Hosted checkout', 'Fraud protection', 'Email support'],
    cta: 'Start now'
  }, {
    name: 'Scale',
    price: 'Custom',
    cadence: 'volume pricing',
    description: 'For growing platforms processing at scale.',
    features: ['Everything in Starter', 'Volume discounts', 'Dedicated support', '99.99% uptime SLA', 'Custom payout schedules'],
    cta: 'Contact sales',
    featured: true,
    badge: 'Popular'
  }, {
    name: 'Enterprise',
    price: 'Custom',
    cadence: 'annual contract',
    description: 'For the largest, most complex businesses.',
    features: ['Everything in Scale', 'Interchange+ pricing', 'Solutions engineering', 'Audit & compliance tooling'],
    cta: 'Contact sales'
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--canvas)',
      padding: '88px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '0 40px',
      boxSizing: 'border-box',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-block'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Badge, {
    tone: "soft"
  }, "Pricing")), /*#__PURE__*/React.createElement("h2", {
    className: "type-display-xl",
    style: {
      margin: '18px auto 0',
      color: 'var(--ink)',
      maxWidth: 560
    }
  }, "Pricing that scales with you"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '16px auto 0',
      maxWidth: 480,
      fontSize: 16,
      fontWeight: 300,
      color: 'var(--ink-mute)',
      lineHeight: 1.5
    }
  }, "Start free and only pay when you get paid. Move to volume pricing as you grow."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 20,
      marginTop: 44,
      textAlign: 'left',
      alignItems: 'stretch'
    }
  }, tiers.map(t => /*#__PURE__*/React.createElement(__ds_scope.PricingCard, _extends({
    key: t.name
  }, t, {
    onCta: onStart
  }))))));
}
Object.assign(__ds_scope, { Pricing });
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing/Pricing.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.PricingCard = __ds_scope.PricingCard;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.BalancesOverview = __ds_scope.BalancesOverview;

__ds_ns.DashSidebar = __ds_scope.DashSidebar;

__ds_ns.DashTopbar = __ds_scope.DashTopbar;

__ds_ns.PaymentsOverview = __ds_scope.PaymentsOverview;

__ds_ns.Features = __ds_scope.Features;

__ds_ns.LogoStrip = __ds_scope.LogoStrip;

__ds_ns.Footer = __ds_scope.Footer;

__ds_ns.Hero = __ds_scope.Hero;

__ds_ns.MarketingNav = __ds_scope.MarketingNav;

__ds_ns.Pricing = __ds_scope.Pricing;

})();
