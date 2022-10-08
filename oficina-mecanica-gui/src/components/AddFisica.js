import React from "react";
import { useState } from "react";

export const AddFisica = (props) =>{
    const initialFisicaState = {
        cpf: "",
        cod_pessoa: null
    }
const [fisica, setFisica] = useState(initialFisicaState)
    const changeHandler = event => {
        const { name, value } = event.target;
        setFisica({ ...fisica, [name]: value });
      };

return (

    <div className="submit-form">
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              id="cpf"
              placeholder = "cpf"
              value = {props.doc}
              onChange={props.changeHandler}
              name="cpf"
            />
          </div>
    </div>
);
}