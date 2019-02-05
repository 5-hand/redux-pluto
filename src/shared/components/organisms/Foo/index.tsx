import React from "react";
import { connect } from "react-redux";
import { compose, shouldUpdate } from "recompose";
import { sendAnalytics, sendEvent } from "react-redux-analytics";
import {
  siteSections,
  onAsyncLoaderLoaded,
} from "../../../redux/analytics/utils";
import {
  FOO_EVENT_VARIABLE,
  EVENTS,
} from "../../../redux/analytics/variableNames";
import bindActionToPropFunctions from "../../utils/bindActionToPropFunctions";

export default compose(
  connect(
    (state, props) => ({}),
    () => ({
      onClickMe: (fooVal: string) => () => {
        // This is a dummy event handler
        // to show how to send event using react-redux-analytics.
      },
    }),
  ),
  // 例えばここを書き換えて捨てる
  bindActionToPropFunctions({
    onClickMe: ([fooVal]: [string], props: any, state: any) => () =>
      sendEvent(
        {
          [EVENTS]: ["event10"],
          [FOO_EVENT_VARIABLE]: fooVal,
        },
        [],
      ),
  }),
  sendAnalytics({
    ...siteSections("foo", "top"),
    onDataReady: onAsyncLoaderLoaded,
  }),
  shouldUpdate(() => false),
)(function Foo(props: any) {
  const { onClickMe } = props;

  return (
    <div>
      Foo!
      <button type="button" onClick={onClickMe("fooooo")}>
        Click me!
      </button>
    </div>
  );
});
