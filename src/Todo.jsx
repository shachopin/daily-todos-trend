import { useState } from "react";

const Todo = ({ onToggle, checked, id }) => {
  return (
    <label className={checked ? "toggle on" : "toggle off"}>
      <input
        type="checkbox"
        checked={checked}
        onChange={() => {
          onToggle(checked, id);
        }}
      />
      {checked ? "Done" : "Not Done"}
    </label>
  );
};

export default Todo;
