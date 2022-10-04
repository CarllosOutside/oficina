import React, { useState, useEffect } from "react";
import ClienteService from "../Services/ClienteService";
import Addpessoa  from "./AddPessoa";
import {Navigate, useParams, Link} from "react-router-dom";

const AddCliente = () => {
    //JSON CLIENTE
  const initialClienteState = {
    cod_cliente: null,
    pessoa: null
    }
//cliente começa sendo nulo
  const [cliente, setCliente] = useState(initialClienteState);

//path variable
const { id }= useParams();

 //se houver path variable
  useEffect(() => {
    if (id)
      getCliente(id);
  }, [id]);
//Le cliente passada como pathVariable
const getCliente = id => {
    ClienteService.get(id)
      .then(response => {
        setCliente(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const [submitted, setSubmitted] = useState(false);

  //RESETA JSON
  const newCliente = () => {
    setCliente(initialClienteState);
    setSubmitted(false);
  };

  const changeSubmitted = () =>{
    setSubmitted(!submitted);
  }
  return (
    <div className="submit-form" style={{paddingLeft: "10rem"}}>
      {submitted ? (
        <div>
          <h4>Cliente salvo!</h4>
          <button className="btn btn-success" onClick={newCliente}>
            Continuar
          </button>
        </div>
      ) : (
        <div>
            <Addpessoa cliente = {cliente} changePaiSubmit ={changeSubmitted}/>
        </div>
      )}
      <a href="/clientes">
              Voltar
            </a>
    </div>
  );
};

export default AddCliente;