import { useState, useEffect } from "react";
import "./styles/app.css";
import Chart from "./Chart";
import Todo from "./Todo";
import { todos } from "./data";
import { Button, IconButton } from "@material-ui/core";
import { useFirebase } from "./customHooks";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";

function App() {
  const [items, addItem] = useFirebase("items", ["name", "score", "timestamp"]);
  const [dones, addDone, undoAll, deleteDone] = useFirebase("dones", ["name"]);
  //const [today, setToday] = useState("true");
  const [days, setDays] = useState(null);

  const onToggle = (isChecked, score, name, id) => {
    if (!isChecked) {
      addItem({
        timestamp: Date.now() + days * 24 * 60 * 60 * 1000,
        score,
        name,
      });
      addDone({ name });
    } else {
      deleteDone(id);
    }
  };

  // const onAddMore = (score, name) => {
  //   addItem({ timestamp: Date.now(), score, name });
  // };

  return (
    <div className="app">
      <h1>daily todos trend 😃</h1>
      <div style={{ marginTop: -20, marginBottom: 20 }}>
        Every day is a gift from god, use it wisely. Learn Fast!
      </div>

      {items.length > 0 && <Chart data={items} />}

      <div>
        <Button variant="contained" color="primary" onClick={undoAll}>
          Undo All
        </Button>
        {/*<Button
          variant="contained"
          color="secondary"
          style={{ marginLeft: 10 }}
          onClick={() => setToday(!today)}
        >
          For {today ? "Today" : "Tomorrow"}
        </Button>*/}
        <TextField
          id="days"
          label="days"
          value={days}
          style={{ width: "5vw", marginLeft: 10, marginTop: -15}}
          onChange={(e) => setDays(e.target.value)}
        />
      </div>
      {todos.map((itemName, index) => (
        <div
          key={index}
          style={{ display: "flex", marginTop: 10, alignItems: "center" }}
        >
          <span className="myspan">{itemName}</span>
          <Todo
            onToggle={(isChecked, id) =>
              onToggle(isChecked, (todos.length - index) * 10, itemName, id)
            }
            checked={dones.filter((done) => done.name === itemName).length}
            id={dones.find((done) => done.name === itemName)?.id}
          />
          {/*!!dones.filter((done) => done.name === itemName).length && <IconButton onClick={() => onAddMore((todos.length - index) * 10, itemName)} style={{padding: 0, margin: 0}} aria-label="more">
            <AddIcon />
          </IconButton>*/}
        </div>
      ))}
    </div>
  );
}

export default App;
