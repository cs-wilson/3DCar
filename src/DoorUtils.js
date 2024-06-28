import { useState } from "react";
import TWEEN from "@tweenjs/tween.js";

const useDoorState = (initialState) => {
  const [doorState, setDoorState] = useState(initialState);

  const toggleDoorState = (doorName) => {
    setDoorState((prevState) => {
      const newState = { ...prevState };
      newState[doorName] = !prevState[doorName];
      return newState;
    });
  };

  return [doorState, toggleDoorState];
};

const operateDoor = (door, rotationAxis, initialAngle, rotationAngle) => {
  const initialState = { angle: initialAngle };
  const tween = new TWEEN.Tween(initialState)
    .to({ angle: rotationAngle }, 1000)
    .onUpdate(() => {
      if (rotationAxis === "Y") {
        door.rotation.y = initialState.angle;
      }
      if (rotationAxis === "Z") {
        door.rotation.z = initialState.angle;
      }
    })
    .start();
  return tween;
};

export { useDoorState, operateDoor };
