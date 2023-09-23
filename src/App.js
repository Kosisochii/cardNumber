import "./styles.css";
import { useState } from "react";

function CardNumberInput({ inputId, label, state, setState }) {
  // TODO: Add paste event handler to allow:
  //        - validation of attempted paste (only numbers, under max length etc.)
  //        - formatting of unspaced card pastes

  function handleChange(e) {
    const { value } = e.target;
    const currentCharCount = state.length;

    // Check if the new update adding or removing characters
    const isUpdateAddition = value.length > currentCharCount;

    // If adding new characters, validate & apply number block logic where needed
    if (isUpdateAddition) {
      const newValue = value.substring(value.length - 1);

      // Reject changes if the value contains anything not a number
      const isValueOnlyNumbers = new RegExp("^[0-9]*$").test(newValue);
      if (!isValueOnlyNumbers) return;

      // Reject changes if the current state is at maximum length
      if (currentCharCount === 19) return;

      // If a new char addition occurs after 3rd number to complete a block, add a space after that new number
      const preCompletedBlocks = [3, 8, 13];
      if (preCompletedBlocks.includes(currentCharCount)) {
        setState((prevValue) => `${prevValue}${newValue} `);
        return;
      }
      // If a new char addition occurs after 4th number at the end of completed block, add a space before that new number
      const postCompletedBlocks = [4, 9, 14];
      if (postCompletedBlocks.includes(currentCharCount)) {
        setState((prevValue) => `${prevValue} ${newValue}`);
        return;
      }
    }

    // Else if removing characters, apply number block deletion logic where needed
    if (!isUpdateAddition) {
      // If a new char deletion occurs and input value is at a block spacer, remove that spacer
      const blockDeletionLocs = [6, 11, 16];
      if (blockDeletionLocs.includes(currentCharCount) && !isUpdateAddition) {
        setState((prevValue) => prevValue.substring(0, currentCharCount - 2));
        return;
      }
    }

    // Else update state with new change
    setState(value);
  }

  return (
    <div className="form__input-group">
      <label className="form__label" htmlFor={inputId}>
        {label}
      </label>
      <input
        className="form__input"
        type="text"
        inputMode="numeric"
        id={inputId}
        value={state}
        onChange={handleChange}
      />
    </div>
  );
}

export default function App() {
  const [cardNumber, setCardNumber] = useState("");

  return (
    <>
      <h1 className="display">
        {cardNumber ? cardNumber : "0000 0000 0000 0000"}
      </h1>
      <form className="form">
        <CardNumberInput
          id="card-number"
          label="Card Number"
          state={cardNumber}
          setState={setCardNumber}
        />
      </form>
    </>
  );
}
