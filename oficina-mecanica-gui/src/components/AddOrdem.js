import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VeiculoService from "../Services/VeiculoService";
import Dropdown from 'react-bootstrap/Dropdown';
import FuncionarioService from "../Services/FuncionarioService";
import "bootstrap/dist/css/bootstrap.min.css";

const AddOrdem = (props) => {
    const {id} = useParams() //id do cliente na path variable
 const initialFunc = {codFuncionario: null}
    const [funcionarios, setFuncionarios] = useState([])
    const [currentFuncionario, setCurrentFuncionario] = useState(initialFunc)

    const [dropDown, setDropDown] = useState(false)
    useEffect(() => {
      retrieveFuncionarios(); //lista de funcionarios disponiveis
    }, []);
 
    useEffect(() => {
      console.log(props)
      if(props.criada)
          getCurrentFuncionario();
    }, [props.ordem.codFuncionario]);

    //quando sleecionar um funcionario
    useEffect(() => {
     //console.log(currentFuncionario.cod_funcionario)
     //chama a funcao handleInputchange do pai(OrdemList)
     props.handleInputChange({ //envia como argumento um evento com campo target.name e target.value
      target:{
        name:"codFuncionario",
        value: currentFuncionario.cod_funcionario
      }
    })
    }, [currentFuncionario]); //executa sempre ao mudar o funcionario

    const getCurrentFuncionario = () =>{
      FuncionarioService.get(props.ordem.codFuncionario)
      .then(response => {
        setCurrentFuncionario(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });

    }
    const retrieveFuncionarios = () => {
      FuncionarioService.getLista()
        .then(response => {
          setFuncionarios(response.data);
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    };
const [currentIndex, setCurrentIndex] = useState(-1)
    const setActiveFuncionario = (funcionario, index) => {
      setCurrentFuncionario(funcionario);
      setCurrentIndex(index);
    };


const faznada = () =>{}

const toggleDrop = () =>{
  setDropDown(!dropDown)
  //console.log(dropDown)
}

const [teste, setTeste] =  useState(true)


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

           {/**container estado */}
           <div style={{display:"flex", gap:"50rem",marginTop:"45px"}}>
           
           <div>
           <label>Selecione um mecânico:</label>
    <Dropdown isOpen={dropDown} toggle={toggleDrop}>
        <Dropdown.Toggle caret>
         {(currentFuncionario.pessoa)? currentFuncionario.pessoa.nome: "Selecione funcionário"}
        </Dropdown.Toggle>
         <Dropdown.Menu container="body">
            {funcionarios &&
            funcionarios.map((func, index) => (
              <Dropdown.Item
                onClick={func!=currentFuncionario?() => setCurrentFuncionario(func): ()=>faznada}
                key={index}
                name="codFuncionario"
              >
                {func.pessoa.nome}
              </Dropdown.Item>
            ))}
         </Dropdown.Menu>
      </Dropdown>
    </div>
          
    <div className="list row">
      <label>Código do mecânico</label>
    <input
              type="number"
              id="codFuncionario"
              required
              disabled
              value={currentFuncionario.cod_funcionario}
              name="codFuncionario"
            />
    </div>  
    
    </div>
    <br/>
          <div className="form-group">
            <label>Placa</label>
            <input
              type="text"
              className="form-control"
              id="placa"
              disabled={props.criada? true:false}
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