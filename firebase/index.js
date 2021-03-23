import React, { createContext } from "react";
import app from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/functions";
import "firebase/performance";
import "firebase/storage";
import dayjs from "dayjs";
let dayOfYear = require("dayjs/plugin/dayOfYear");
dayjs.extend(dayOfYear);
const firebase = require("firebase");

const checkRequired = (required, data) =>
  required.forEach((r) => {
    if (!data?.[r]) throw new Error(`Missing argument ${data[r]} ${data}`);
  });
const config = {
  apiKey: "AIzaSyBa7eR0l-NiIijqMiwNbT_uEEeZMUVwDIY",
  authDomain: "overgrowth-a87a1.firebaseapp.com",
  databaseURL: "https://overgrowth-a87a1.firebaseio.com",
  projectId: "overgrowth-a87a1",
  storageBucket: "overgrowth-a87a1.appspot.com",
  messagingSenderId: "806123076657",
  appId: "1:806123076657:web:8e80e5d554951f949ce910",
  measurementId: "G-ZQ2DY5ETYM",
};
export const FirebaseContext = createContext(null);
export function firebaseInit() {
  try {
    firebase.initializeApp(config);
  } catch (err) {
    // we skip the "already exists" message which is
    // not an actual error when we're hot-reloading
    if (!/already exists/.test(err.message)) {
      console.error("Firebase initialization error", err.stack);
    }
  }
console.log('firebase')
  return firebase;
}
export const FirebaseProvider = ({ children }) => {
console.log('firebase provider')
  if (!app.apps.length) {
    app.initializeApp(config);

    app.firestore().settings({
      cacheSizeBytes: app.firestore.CACHE_SIZE_UNLIMITED,
    });

    app
      .firestore()
      .enablePersistence()
      .catch((err) => {
        if (err.code === "failed-precondition") {
          console.log(err.code, "failed-precondition");
        } else if (err.code === "unimplemented") {
          console.log(err.code, "current browser unsuppoerted");
        }
      });
  }

  return (
    <FirebaseContext.Provider value={app}>{children}</FirebaseContext.Provider>
  );
};

export const subscribe = async (collection, setData, setLoading) => {
  setLoading(true);

  firebase
    .firestore()
    .collection(collection)
    .onSnapshot(
      async (querySnapshot) => {
        let data = [];

        querySnapshot.forEach((doc) => {
          data.push(doc.data());
        });
        setData(data);
        setLoading(false);
      },
      (error) => console.log(error)
    );
};

export const setPlantData = async (plants, storedData) => {
  if (!plants?.length) return;

  plants.forEach((plant) => {
    const shouldUpdate = storedData.some((storedPlant) => {
      return storedPlant?.id === plant?.id;
    });

    if (!!shouldUpdate) return;

    firebase
      .firestore()
      .collection("plant-data")
      .doc(`${plant.id}`)
      .set(plant);
  });
};

export const addUserToFirestore = async (uid, email, username, geolocation) => {
  const created = firebase.firestore.FieldValue.serverTimestamp();

  const user = { username, uid, email, geolocation, created };

  await firebase
    .firestore()
    .collection("users")
    .add(user);
};

export const addUserPlantData = async (
  {
    common_name,
    family,
    family_common_name,
    genus,
    genus_id,
    id,
    image_url,
    scientific_name,
    slug,
  },
  uid,
  pid
) => {
  const owners = [uid];
  const plant = {
    name: common_name,
    id,
    common_name,
    family,
    family_common_name,
    genus,
    genus_id,
    image_url,
    scientific_name,
    slug,
    uid,
    pid,
    owners,
  };

  if (!plant || !plant?.id) return;
  const created = firebase.firestore.FieldValue.serverTimestamp();

  const plants = firebase.firestore().collection("user-plant-data");

  plants.add({ ...plant, created }).then((docRef) => {
    plants.doc(docRef.id).update({ pid: docRef.id });
  });
};

export const updateUserPlantData = async (plant, update) => {
  if (!plant || !plant?.id) return;
  const updated = firebase.firestore.FieldValue.serverTimestamp();

  firebase
    .firestore()
    .collection("user-plant-data")
    .doc(plant.pid)
    .update({ ...plant, updated, ...update });
};

export const addEvent = async (
  { date, type, uid, key, status, state, location, image, pid, slug },
  setEventId = () => null,
  username
) => {
  const created = firebase.firestore.FieldValue.serverTimestamp();
  const today = dayjs().dayOfYear();
  const future = dayjs(date) > edayjs();

  const event = {
    date,
    type,
    uid,
    status: status ?? null,
    state: state ?? null,
    location: location ?? null,
    image: image ?? null,
    owner: username,
    pid,
    slug,
    created,
    key: !!key ? key : today,
    backlog: key !== today,
    plan: future ?? null,
  };

  const required = [
    "date",
    "uid",
    "pid",
    "owner",
    "type",
    "uid",
    "slug",
    "created",
  ];

  checkRequired(required, event);
  const events = firebase.firestore().collection("event-data");

  events.add(event).then((docRef) => {
    setEventId(docRef.id);
    events.doc(docRef.id).update({ eid: docRef.id });
  });
};

export const deleteEvent = async (eid) => {
  if (!eid) return;

  firebase
    .firestore()
    .collection("event-data")
    .doc(eid)
    .delete()
    .catch(() => (err) => console.error("Error removing document: ", err));
};

export const deletePlant = async (pid) => {
  firebase
    .firestore()
    .collection("user-plant-data")
    .doc(pid)
    .delete()
    .catch(() => (err) => console.error("Error removing plant: ", err));
};

export const deleteNote = async (pid, type, notes) => {
  firebase
    .firestore()
    .collection("user-plant-data")
    .doc(pid)
    .update({ notes: { ...notes, [type]: "" } })
    .catch(() => (err) => console.error("Error removing note: ", err));
};

export const deleteImage = async (url, eid) => {
  const storage = firebase.storage();
  const storageRef = storage.ref(url);

  storageRef
    .listAll()
    .then((result) => {
      result.items.forEach((imageRef) => {
        imageRef
          .delete()
          .then((url) => {
            console.log("images deleted", url);
            firebase
              .firestore()
              .collection("event-data")
              .doc(eid)
              .update({ image: false });
          })
          .catch((error) => {
            console.log(error);
          });
      });
    })
    .catch(function(error) {
      console.log(error);
    });
};
