import { useState, useEffect } from "react";
// Import and apply CSS stylesheet
import "./styles/app.css";
import { db } from "./firebase_config";
import Chart from "./Chart";
import Todo from "./Todo";
import { todos } from "./data";
import { Button } from "@material-ui/core";

function App() {
  const [items, setItems] = useState([]);
  const [dones, setDones] = useState([]);

  useEffect(() => {
    getItems();
    getDones();
  }, []); // blank to run only on first launch

  function getItems() {
    db.collection("items").onSnapshot(function (querySnapshot) {
      setItems(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          score: doc.data().score,
          timestamp: doc.data().timestamp,
        }))
      );
    });
  }

  function getDones() {
    db.collection("dones").onSnapshot(function (querySnapshot) {
      setDones(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }))
      );
    });
  }

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
    <div className="App">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          marginBottom: 10,
        }}
      >
        <h1>daily todos trend 😃</h1>

        {items.length > 0 && <Chart data={items} />}

        <Button variant="contained" color="primary" onClick={onUndoAll}>
          Undo All
        </Button>
        {[...todos.entries()].map(([itemName, score], index) => (
          <div key={index} style={{ display: "flex", marginTop: 10 }}>
            <span className="myspan">{itemName}</span>
            <Todo
              onToggle={(isChecked, id) =>
                onToggle(isChecked, score, itemName, id)
              }
              checked={dones.filter((done) => done.name === itemName).length}
              id={dones.find((done) => done.name === itemName)?.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
