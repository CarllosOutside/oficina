import React from "react";
import { useState } from "react";

export const AddJuridica = (props) =>{
    const initialJuridicaState = {
        cnpj: "",
        cod_pessoa: null
    }
const [juridica, setJuridica] = useState(initialJuridicaState)
    const changeHandler = event => {
        const { name, value } = event.target;
        setJuridica({ ...juridica, [name]: value });
      };

return (

    <div className="submit-form">
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              id="cnpj"
              placeholder = "cnpj"
              onChange={props.changeHandler}
              name="cnpj"
            />
          </div>
    </div>
);
}