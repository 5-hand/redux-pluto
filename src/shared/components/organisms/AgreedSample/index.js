/* @flow */
import { connect } from "react-redux";
import { asyncLoader } from "redux-async-loader";
import { compose } from "recompose";
import { sendAnalytics } from "react-redux-analytics";
import { getText } from "shared/redux/modules/agreedSample";
import {
  siteSections,
  onAsyncLoaderLoaded,
} from "shared/redux/analytics/utils";
import AgreedSample from "./AgreedSample";

const enhancer = compose(
  asyncLoader(({ location }, { dispatch }) => {
    const { query: locationQuery } = location;
    if (!locationQuery) {
      return dispatch(getText());
    }
    const { status } = locationQuery;
    return dispatch(getText(status));
  }),
  connect(state => ({
    text: state.page.agreedSample.text,
  })),
  sendAnalytics({
    ...siteSections("agreedsample", "top"),
    onDataReady: onAsyncLoaderLoaded,
  }),
);

export default enhancer(AgreedSample);
