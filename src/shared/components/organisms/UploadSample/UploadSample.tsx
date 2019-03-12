import DocumentTitle from "react-document-title";
import React from "react";

type Props = {
  loading: boolean;
  path: string;
  onInputFile: Function;
  onSubmitFile: Function;
  onCancel: Function;
  title: string;
};

export default React.memo(function UploadSample(props: Props) {
  const { loading, path, onInputFile, onSubmitFile, onCancel, title } = props;

  return (
    <DocumentTitle title={title}>
      <div>
        <div>{path && <img src={path} alt="" />}</div>
        <div>
          <input type="file" onChange={onInputFile as any} />
        </div>
        <div>
          <button
            type="button"
            onClick={onSubmitFile as any}
            disabled={loading}>
            submit
          </button>
          <button type="button" onClick={onCancel as any}>
            cancel
          </button>
        </div>
      </div>
    </DocumentTitle>
  );
});
