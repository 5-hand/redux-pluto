import { compose } from "redux";
import { connect } from "react-redux";
import { asyncLoader } from "redux-async-loader";
import { reduxForm } from "redux-form";
import { changeChecked, getTodos, postTodo } from "../../../redux/modules/todo";
import { RootState } from "../../../redux/modules/reducer";
import Todo from "./Todo";

export default compose(
  reduxForm({
    form: "todo",
    onSubmit(values: { content: string }, dispatch: any) {
      dispatch(postTodo(values));
    },
  }),
  connect(
    (state: RootState) => ({
      todos: state.app.todo.todos,
    }),
    dispatch => ({
      onChangeChecked: (index: number, checked: boolean) =>
        dispatch(changeChecked(index, checked)),
    }),
  ),
  asyncLoader((props, store) => store.dispatch(getTodos())),
)(Todo);
