import React, { useState, useEffect } from "react";
import PessoasService from "../Services/PessoasService";
import LocaisList from "./LocaisList";
const Addpessoa = (props) => {
//JSON CLIENTE
  const initialPessoaState =
    {
        cod_pessoa: null,
        nome: "",
        endereco: "",
        telefone: "",
        cidade:	null
        }
  //Se o pai tiver recebido um cliente na pathvariable, carrega a pessoa desse cliente      
  const [pessoa, setPessoa] = useState(initialPessoaState);
  useEffect(() => {
    if(props.cliente.cod_cliente)
        setPessoa(props.cliente.pessoa); 
  }, [props.cliente.cod_cliente]);

  const changeCidade = (cd) =>{
    setPessoa({...pessoa, cidade:cd})
} 
  //ATRIBUI VALORES À JSON EM TEMPO REAL
  const handleInputChange = event => {
    const { name, value } = event.target;
    setPessoa({ ...pessoa, [name]: value });
  };


  //RESETA JSON
  const newPessoa = () => {
    setPessoa(initialPessoaState);
  };

  //Muda o estado do pai AddCliente para submitted
  const changeParentSubmit = ()=>{
    props.changePaiSubmit();
  }
  return (
    <div className="submit-form">
      <div>
        {pessoa.cod_pessoa? 
        <div className="form-group">
            <label>Id</label>
            <input disabled="disabled"
            type="text"
            className="form-control"
              value={pessoa.cod_pessoa}
            />
        </div>
        : <></>}
          <div className="form-group">
            <label>Nome</label>
            <input
              type="text"
              className="form-control"
              id="nome"
              required
              value={pessoa.nome}
              onChange={handleInputChange}
              name="nome"
            />
          </div>
          <div className="form-group">
            <label>Endereço</label>
            <input
              type="text"
              className="form-control"
              id="endereco"
              value={pessoa.endereco}
              onChange={handleInputChange}
              name="endereco"
            />
          </div>
          <div className="form-group">
            <label>Telefone</label>
            <input
              type="text"
              className="form-control"
              id="telefone"
              value={pessoa.telefone}
              onChange={handleInputChange}
              name="telefone"
            />
          </div>
          <br/>
        <div>
            <LocaisList pessoa ={pessoa} changeCidade = {changeCidade}  changeVoSubmit={changeParentSubmit}/>
        </div>
        </div>
    </div>
  );
};

export default Addpessoa;