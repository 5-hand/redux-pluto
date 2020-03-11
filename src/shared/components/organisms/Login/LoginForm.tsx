import React, { memo } from "react";
import useDocumentTitle from "../../utils/useDocumentTitle";
import styled from "styled-components";
import { Field } from "redux-form";

const labels = {
  username: "Username",
  password: "Password",
};

const RenderInput = ({
  input,
  meta: { dirty, error },
}: {
  input: { name: "username" | "password" };
  meta: {
    dirty: boolean;
    error: any;
  };
}): any => (
  <Row key={input.name}>
    <Label htmlFor={input.name}>
      {labels[input.name]}
      <Input
        {...input}
        id={input.name}
        type={input.name === "username" ? "text" : "password"}
        tabIndex={0}
      />
    </Label>
    <Message>{dirty && error}</Message>
  </Row>
);

// prettier-ignore
function LoginForm(props: {
  error: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => any;
  reset:  (e: React.MouseEvent<HTMLElement>) => any;
  submitting: boolean;
  submitFailed: boolean;
  anyTouched: any;
  csrf: string;
  title: string;
}) {
  const {
    error,
    handleSubmit,
    reset,
    submitting,
    submitFailed,
    anyTouched,
    csrf,
    title,
  } = props;
  useDocumentTitle(title);

  return (
    <form onSubmit={handleSubmit} method="POST">
      {error && <div>{error}</div>}
      {!error && submitFailed && anyTouched && (
        <div>ログインできませんでした</div>
      )}
      <div>
        <Field name="username" component={RenderInput as any} />
        <Field name="password" component={RenderInput as any} />
      </div>
      <input type="hidden" name="_csrf" value={csrf} />
      <div>
        <button type="submit" disabled={submitting}>
          Login
        </button>
        <button type="button" disabled={submitting} onClick={reset}>
          Clear
        </button>
      </div>
    </form>
  );
}

LoginForm.displayName = "LoginForm";

export default memo(LoginForm);

const Row = styled.div`
  display: flex;
`;

const Label = styled.label`
  flex: 1;
  text-align: right;
`;

const Input = styled.input`
  width: 300px;
`;

const Message = styled.div`
  flex: 1;
  text-align: left;
`;
