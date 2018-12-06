import React, { ReactNode } from "react";
import { compose, pure } from "recompose";
import { showOnScroll } from "../utils/scrollComponents";

type Props = {
  children?: ReactNode | string,
  onShow?: any,
};

export default compose(
  pure,
  showOnScroll,
)(function SearchMore(props: Props) {
  const { children, onShow } = props;
  return (
    <div onClick={onShow} onKeyDown={onShow}>
      {children}
    </div>
  );
}) as any;
