import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VeiculoService from "../Services/VeiculoService";

const AddOrdem = (props) => {
    const {id} = useParams() //id do cliente na path variable

  return (
    <div className="submit-form">
      <div>
        {(props.criada)?  //se o veiculo ja foi criado, desabilita a funcao de escrever placa
        <div className="form-group">
            <label>Código da ordem</label>
            <input disabled="disabled"
            type="text"
            className="form-control"
              value={props.ordem.id}
            />
        </div>
        : <></>}

          <div className="form-group">
            <label>Funcionario</label>
            <input
              type="number"
              className="form-control"
              id="codFuncionario"
              required
              value={props.ordem.codFuncionario}
              onChange={props.handleInputChange}
              name="codFuncionario"
            />
          </div>
          <div className="form-group">
            <label>Placa</label>
            <input
              type="text"
              className="form-control"
              id="placa"
              value={props.ordem.placa}
              onChange={props.handleInputChange}
              name="placa"
            />
          </div>
          <div className="form-group">
            <label>Data</label>
            <input
              type="date"
              className="form-control"
              id="dataAbertura"
              value={props.ordem.dataAbertura}
              onChange={props.handleInputChange}
              name="dataAbertura"
            />
          </div>
          <br/>
        <br/>
        </div>
    </div>
  );
};

export default AddOrdem;