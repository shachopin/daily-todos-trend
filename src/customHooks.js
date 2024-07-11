import { useState, useEffect } from 'react';
import { db } from "./firebase_config";

export const useFirebase = (stuff, attributeNames=[]) => {
  const [state, setState] = useState([]);

  
  useEffect(() => {
    getStuff();
  }, []); // blank to run only on first launch
  
  function getStuff() {
     db.collection(stuff).onSnapshot(function (querySnapshot) {
      setState(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...convertAttributeNamesToAttributeObj(attributeNames, doc.data())
        }))
      );
    });
  }
  
  const convertAttributeNamesToAttributeObj = (attributeNames, docData) => {
    return attributeNames.reduce((acc, k) => ({
      ...acc,
      [k]: docData[k]
    }), {})
  }
  
  
  return state;

}

