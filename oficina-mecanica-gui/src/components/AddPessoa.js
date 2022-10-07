import React, { useState, useEffect } from "react";
import PessoasService from "../Services/PessoasService";
import LocaisList from "./LocaisList";
import VeiculosList from "./VeiculosList";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { faCar } from '@fortawesome/free-solid-svg-icons'
import Modal from 'react-bootstrap/Modal';

const Addpessoa = (props) => {
  const [lgShow, setLgShow] = useState(false);
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
        {props.funcao == 1?
        <h4>Cadastro de Clientes</h4>
        :<h4>Cadastro de funcionários</h4>
      }
        {pessoa.cod_pessoa? 
        <div className="form-group">
            <label>Código do cliente</label>
            <input disabled="disabled"
            type="text"
            className="form-control"
              value={props.cliente.cod_cliente}
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
        <br/>
        <div>
        {(props.cliente.cod_cliente != null)?
        <div>
          <span onClick={() => setLgShow(true)}>
                  <OverlayTrigger
                  delay={{hide: 5 }}
                      key={"vel"}
                      placement={"top"}
                       overlay={
                          <Tooltip id={`tooltip-${"del"}`}>
                            <strong>{"Adicionar veículos"}</strong>.
                          </Tooltip>
                        }> 
                      <FontAwesomeIcon icon={faCar}/>
                    </OverlayTrigger>
              
              </span>
            
            <Modal
            scrollable={true}
        show={lgShow}
        onHide={() => setLgShow(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Cadastro de veículos
          </Modal.Title>
        </Modal.Header>
        <Modal.Body><VeiculosList codCliente = {props.cliente.cod_cliente}/></Modal.Body>
      </Modal>
          </div> : <></>
        }        
        </div>
        </div>
    </div>
  );
};

export default Addpessoa;