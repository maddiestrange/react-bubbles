import React, { useState } from "react";
import { axiosWithAuth } from '../utils/axiosWithAuth';

const initialColor = {
  color: "",
  code: { hex: "" }
};

const ColorList = ({ colors, updateColors }) => {
  console.log(colors);
  const id = (colors.length + 1)
  const [editing, setEditing] = useState(false)
  const [colorToEdit, setColorToEdit] = useState(initialColor)
  const [newColor, setNewColor] = useState(initialColor)
 

  const editColor = color => {
    setEditing(true)
    setColorToEdit(color)
  };

  const saveEdit = color => {
    if (editing === true) {
      axiosWithAuth()
        .put(`/colors/${colorToEdit.id}`, colorToEdit)
        .then(res => {
          updateColors(res.data)
        })
        .catch(err => {
          console.log("Error: ", err)
        });
    }
  };

  const deleteColor = color => {
    setEditing(false)
    axiosWithAuth()
      .delete("/colors/" + color.id)
      .then(res => {
        console.log(res.data)
      })
      .catch(err => {
        console.log("Error: ", err)
      })
  }


  const handleSubmit = e => {
    e.preventDefault();
    axiosWithAuth()
      .post("/colors", newColor)
      .then(res => {
        //console.log(newColor)
        //console.log(res.data)
        updateColors(res.data)
      })
      .catch(err => {
        console.log("Error: ", err);
      });
  };

  return (
    <div className="colors-wrap">
      <p>colors</p>
      <ul>
        {colors.map(color => (
          <li key={color.color} onClick={() => editColor(color)}>
            <span>
              <span className="delete" onClick={() => deleteColor(color)}>
                x
              </span>{" "}
              {color.color}
            </span>
            <div
              className="color-box"
              style={{ backgroundColor: color.code.hex }}
            />
          </li>
        ))}
      </ul>
      {editing && (
        <form onSubmit={saveEdit}>
          <legend>edit color</legend>
          <label>
            color name:
            <input
              onChange={e =>
                setColorToEdit({ ...colorToEdit, color: e.target.value })
              }
              value={colorToEdit.color}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={e =>
                setColorToEdit({
                  ...colorToEdit,
                  code: { hex: e.target.value }
                })
              }
              value={colorToEdit.code.hex}
            />
          </label>
          <div className="button-row">
            <button type="submit">save</button>
            <button onClick={() => setEditing(false)}>cancel</button>
          </div>
        </form>
      )}
      <div className="spacer" />
      
      <section>
      <div>
        <h1>Add a new color!</h1>
        <form onSubmit={handleSubmit}>
          <label> Color Name:</label>
          <input
            type="text"
            name="name"
            placeholder="name"
            value={newColor.color}
            onChange={e =>
              setNewColor({ ...newColor, color: e.target.value, id: id })}/>
          <label>Hex:</label>
          <input
            type="text"
            name="hex"
            placeholder="hex"
            value={newColor.code.hex}
            onChange={e =>
              setNewColor({
                ...newColor,
                code: { hex: e.target.value },
                id: id
              })}/>
          <button type="submit">Add Color</button>
        </form>
      </div>
    </section>
    </div>
  );
};

export default ColorList;
