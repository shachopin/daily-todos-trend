import { useState, useEffect } from "react";
import "./styles/app.css";
import Chart from "./Chart";
import Todo from "./Todo";
import { todos } from "./data";
import { Button, IconButton, TextareaAutosize } from "@material-ui/core";
import { useFirebase } from "./customHooks";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";
import firebase from "firebase";

function App() {
  const [items, addItem, , , deleteLatestItem] = useFirebase("items", ["name", "score", "timestamp","systemtimestamp"]);
  const [dones, addDone, undoAll, deleteDone] = useFirebase("dones", ["name"]);
  const [notes, , , , , updateNoteContent] = useFirebase("notes", ["noteContent"]);
  const [showNotes, setShowNotes] = useState(false);
  //const [today, setToday] = useState("true");
  const [days, setDays] = useState(null);
  const [localNoteData, setLocalNoteData] = useState("");

  useEffect(() => {
    const timeId = setTimeout(() => {
      updateNoteContent(notes[0].id, "noteContent", localNoteData);
    }, 1500);
    return () => clearTimeout(timeId);
  }, [localNoteData]);

  useEffect(() => {
    if (notes.length) {
      setLocalNoteData(notes[0].noteContent)
    }
  }, [notes]);
  //这里两个useEffect是让local state to be updated quickly, but send data to firebase in 1500ms in debounce way
  //but notice after that, it was still very slow
  //Chart was always updating whenever rerender
  //so had to use React.memo on chart
  
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') {
        setShowNotes(true);
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const onToggle = (isChecked, score, name, id) => {
    if (!isChecked) {
      addItem({
        timestamp: Date.now() + days * 24 * 60 * 60 * 1000,
        score,
        name,
        systemtimestamp: firebase.firestore.FieldValue.serverTimestamp()
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
        <Button variant="contained" color="secondary" onClick={deleteLatestItem} style={{marginLeft: 10}}>
          Delete Latest
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
      {showNotes && <TextareaAutosize aria-label="empty textarea" placeholder="Notes" value={localNoteData} onChange={e => setLocalNoteData(e.target.value)} style={{width: "80vw", marginTop: 10}}/>}
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