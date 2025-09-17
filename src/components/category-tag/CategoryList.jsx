import { useState } from "react";
import CategoryTag from "./CategoryTag";
import React from "react";

export default function CategoryList() {
  const categories = [
    "All",
    "Resistor",
    "Diode",
    "LED",
    "Transistor",
    "Battery",
    "Fuse",
    "Potentiometer",
    "Speaker",
    "Microphone",
    "Crystal Oscillator",
    "Connector",
    "Sensor",
    "Microcontroller",
  ];

  const [active, setActive] = useState("All");
  return (
    <>
      <div className="p-4 flex gap-3 flex-wrap ">
        {categories.map((category) => (
          <CategoryTag
            key={category}
            label={category}
            selected={active === category}
            onClick={() =>  setActive(category)}
          />
        ))}
      </div>
    </>
  );
}