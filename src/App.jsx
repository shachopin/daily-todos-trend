import { useState, useEffect } from "react";
// Import and apply CSS stylesheet
import "./styles/app.css";
import Chart from "./Chart";
import Todo from "./Todo";
import { todos } from "./data";
import { Button } from "@material-ui/core";
import { useFirebase } from "./customHooks";
import { db } from "./firebase_config";

function App() {
  const items = useFirebase("items", ["name", "score", "timestamp"]);
  const dones = useFirebase("dones", ["name"]);

  function addItem(score, name) {
    db.collection("items").add({
      timestamp: Date.now(),
      name,
      score,
    });
  }

  function addDone(name) {
    db.collection("dones").add({
      name,
    });
  }

  const deleteDone = (id) => {
    db.collection("dones").doc(id).delete();
  };

  const onToggle = (isChecked, score, name, id) => {
    if (!isChecked) {
      addItem(score, name);
      addDone(name);
    } else {
      deleteDone(id);
    }
  };

  const onUndoAll = () => {
    db.collection("dones")
      .get()
      .then((querySnapshot) => {
        querySnapshot.docs.forEach((snapshot) => {
          snapshot.ref.delete();
        });
      });
  };
  return (
    <div className="app">
      <h1>daily todos trend 😃</h1>

      {items.length > 0 && <Chart data={items} />}

      <Button variant="contained" color="primary" onClick={onUndoAll}>
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
