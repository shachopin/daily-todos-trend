import { useState, useEffect } from "react";
import { db } from "./firebase_config";

export const useFirebase = (stuff, attributeNames = []) => {
  const [state, setState] = useState([]);

  useEffect(() => {
    getStuff();
  }, []); // blank to run only on first launch

  function getStuff() {
    db.collection(stuff).onSnapshot(function (querySnapshot) {
      setState(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...convertAttributeNamesToAttributeObj(attributeNames, doc.data()),
        }))
      );
    });
  }

  function addStuff(newDocData) {
    db.collection(stuff).add(
      convertAttributeNamesToAttributeObj(attributeNames, newDocData)
    );
  }

  const convertAttributeNamesToAttributeObj = (attributeNames, docData) => {
    return attributeNames.reduce(
      (acc, k) => ({
        ...acc,
        [k]: docData[k],
      }),
      {}
    );
  };

  const undoAll = () => {
    db.collection(stuff)
      .get()
      .then((querySnapshot) => {
        querySnapshot.docs.forEach((snapshot) => {
          snapshot.ref.delete();
        });
      });
  };

  const deleteDone = (id) => {
    db.collection(stuff).doc(id).delete();
  };
  
  const deleteLatestItem = async () => {  
    const snapshot = await db.collection(stuff).get();
    const latestItemId = snapshot.docs.map((doc) => ({
      id: doc.id,
      timestamp: doc.data().timestamp
    })).sort((a, b) => b.timestamp - a.timestamp)[0].id;
    db.collection(stuff).doc(latestItemId).delete();
  };

  return [state, addStuff, undoAll, deleteDone, deleteLatestItem];
};
