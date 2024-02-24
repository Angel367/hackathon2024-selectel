import React from "react";

export default function DonorButton(props) {
  return (
    <button className="donorButton" onClick={props.onClick} type={props.type}>
      {props.text}
    </button>
  );
}
