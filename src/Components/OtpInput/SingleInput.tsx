import { memo, useLayoutEffect, useRef } from "react";
import { SingleOTPInputProps } from "../../Types";
import { usePrevious } from "./UsePrevious";

const disableTextSelectionStyles: React.CSSProperties = {
  MozUserSelect: "none" /* Firefox */,
  WebkitUserSelect: "none" /* Safari */,
  msUserSelect: "none" /* IE */,
  userSelect: "none" /* Standard syntax */,
};

export function SingleOTPInputComponent({
  focus,
  autoFocus,
  ...props
}: SingleOTPInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const prevFocus = usePrevious(!!focus);

  useLayoutEffect(() => {
    if (inputRef.current) {
      if (focus && autoFocus) {
        inputRef.current.focus();
      }

      if (focus && autoFocus && focus !== prevFocus) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }
  }, [autoFocus, focus, prevFocus]);

  return <input style={disableTextSelectionStyles} ref={inputRef} {...props} />;
}

const SingleOTPInput = memo(SingleOTPInputComponent);
export default SingleOTPInput;
