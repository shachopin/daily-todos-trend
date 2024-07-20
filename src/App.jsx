import { useState, useEffect } from "react";
import "./styles/app.css";
import Chart from "./Chart";
import Todo from "./Todo";
import { todos } from "./data";
import { Button } from "@material-ui/core";
import { useFirebase } from "./customHooks";

function App() {
  const [items, addItem] = useFirebase("items", ["name", "score", "timestamp"]);
  const [dones, addDone, undoAll, deleteDone] = useFirebase("dones", ["name"]);

  const onToggle = (isChecked, score, name, id) => {
    if (!isChecked) {
      addItem({ timestamp: Date.now(), score, name });
      addDone({ name });
    } else {
      deleteDone(id);
    }
  };

  return (
    <div className="app">
      <h1>daily todos trend 😃</h1>
      <div style={{marginTop: -20, marginBottom: 20}}>Every day is a gift from god, use it wisely</div>

      {items.length > 0 && <Chart data={items} />}

      <Button variant="contained" color="primary" onClick={undoAll}>
        Undo All
      </Button>
      {todos.map((itemName, index) => (
        <div key={index} style={{ display: "flex", marginTop: 10 }}>
          <span className="myspan">{itemName}</span>
          <Todo
            onToggle={(isChecked, id) =>
              onToggle(isChecked, (todos.length - index) * 10, itemName, id)
            }
            checked={dones.filter((done) => done.name === itemName).length}
            id={dones.find((done) => done.name === itemName)?.id}
          />
        </div>
      ))}
    </div>
  );
}

export default App;
