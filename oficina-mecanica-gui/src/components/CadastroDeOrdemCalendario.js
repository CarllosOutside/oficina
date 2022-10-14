import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VeiculoService from "../Services/VeiculoService";
import Dropdown from 'react-bootstrap/Dropdown';
import FuncionarioService from "../Services/FuncionarioService";
import "bootstrap/dist/css/bootstrap.min.css";
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import ServicoList from "./ServicoList";
import Button from 'react-bootstrap/Button';
import OrdemService from "../Services/OrdemService";
const CadastroDeOrdemCalendario = (props) => {

  //estado inicial da ordem
  const initialOrdemState = {
    id: null,
    placa: null,
    codFuncionario: null,
    dataAbertura: null,
    valorTotalPecas: 0,
    valorTotalServicos: 0
  }

  //ordem
  const [ordem, setOrdem] = useState(initialOrdemState)

  //ordem criada?
  const [criada, setCriada] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  //OnChange dos Inputs altera estado da ordem
  const handleInputChange = (event) =>{
    const {name, value} = event.target;
    setOrdem({...ordem, [name]:value});
  }
  
  //dropdown de funcionarios
    const initialFunc = {codFuncionario: null}
    const [funcionarios, setFuncionarios] = useState([])
    const [currentFuncionario, setCurrentFuncionario] = useState(initialFunc)
    const [dropDown, setDropDown] = useState(false)

  //verifica se esta editando uma ordem de um cartão
  useEffect(()=>{
    if(props.ordemAberta){
      console.log(props.ordemAberta)
      setCriada(true)
      setOrdem(props.ordemAberta)
    }
  },[props])

    //lista de funcionarios disponiveis
    useEffect(() => {
      retrieveFuncionarios(); 
    }, []);
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
    //busca o funcionario responsavel pela ordem
    useEffect(() => {
      if(criada)
          getCurrentFuncionario();
    }, [ordem.codFuncionario]);

    const getCurrentFuncionario = () =>{
      FuncionarioService.get(ordem.codFuncionario)
      .then(response => {
        setCurrentFuncionario(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });

    }

  //caso o mesmo funcionario seja slecionado
  const faznada = () =>{}

  //abre/fecha dropdown
  const toggleDrop = () =>{
    setDropDown(!dropDown)
  }

  //mostra Toast de placa nao encontrada
  const [nfoundPlaca, setNfoundPlaca] = useState(false)

  //Tenta salvar a ordem preenchida
  const salvaOrdem = () =>{
    //primeiro verifica se a placa esta cadastrada
    VeiculoService.findByPlaca(ordem.placa)
    .then(response =>{
      return response.data.placa
    }) //depois cadastra a ordem usando a placa
    .then( placa =>{
      OrdemService.create(currentFuncionario.cod_funcionario, placa, ordem.dataAbertura)
      .then(response2=>{
        setOrdem({
          id: response2.data.id,
          placa: response2.data.placa,
          codFuncionario: response2.data.coFuncionario,
          dataAbertura: response2.data.dataAbertura,
          valorTotalServicos: response2.data.valorTotalServicos,
          valorTotalPecas: response2.data.valorTotalPecas
          });
          console.log("ordem criada: ",ordem)
          setCriada(true)
          setSubmitted(true)
      })
      .catch(e2 =>{
        console.log(e2)
      })
   }) //se a placa nao estiver cadastrada...
    .catch(e => {
      console.log(e);
      setNfoundPlaca(true)
    });
  }

 //Faz update da ordem preenchida
  const updateOrdem = () =>{
    //faz o Put, a placa ja esta setada
    OrdemService.update(ordem.id, ordem) 
    .then(response => {
      setOrdem({
          id: response.data.id,
          placa: response.data.placa,
          codFuncionario: response.data.coFuncionario,
          dataAbertura: response.data.dataAbertura,
          valorTotalServicos: response.data.valorTotalServicos,
          valorTotalPecas: response.data.valorTotalPecas
          });
          setCriada(true)
          setSubmitted(true)
          console.log(response)
  })
    .catch(e => {
      console.log(e);
    });
  }

  //Renderiza componente
  return (
    <div className="submit-form">
      <div>
      <h3 align="center">Ordem de Serviço</h3>
        {(criada)?  //se o veiculo ja foi criado, desabilita a funcao de escrever placa
        <div className="form-group">
            <label>Código da ordem</label>
            <input disabled="disabled"
            type="text"
            className="form-control"
              value={ordem.id}
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
              disabled={criada? true:false}
              value={ordem.placa}
              onChange={handleInputChange}
              name="placa"
            />
          </div>
          <div className="form-group">
            <label>Data</label>
            <input
              type="date"
              className="form-control"
              id="dataAbertura"
              value={ordem.dataAbertura}
              onChange={handleInputChange}
              name="dataAbertura"
            />
          </div>
          <div className="form-group">
            <label>Valor em peças</label>
            <input
              type="text"
              className="form-control"
              id="valorTotalPecas"
              value={ordem.valorTotalPecas}
              disabled
              name="valorTotalPecas"
            />
          </div>
          <div className="form-group">
            <label>Mão de Obra</label>
            <input
              type="text"
              className="form-control"
              id="valorTotalMaoObra"
              value={ordem.valorTotalServicos}
              disabled
              name="valorTotalMaoObra"
            />
          </div>
          <br/>
          <div style={{position:"absolute",right:"10px"}}>
            <Button onClick={criada?updateOrdem:salvaOrdem}>Salvar ordem</Button>
            </div>
        <br/>
        </div>
        <br/><br/>
        {criada?<ServicoList codOrdem={ordem.id}/>:<></>}
        
        <ToastContainer className="p-3" position={'bottom-center'} style={{zIndex:1050}}>

      <Toast onClose={() => setSubmitted(false)} show={submitted} delay={3000} autohide>
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded me-2"
              alt=""
            />
            <strong className="me-auto">Ordem salva</strong>
            <small>...</small>
          </Toast.Header>
          <Toast.Body>ordem de serviço salva com sucesso</Toast.Body>
        </Toast>
        </ToastContainer>


    <ToastContainer className="p-3" position={'bottom-end'} style={{zIndex:1050}}>
      <Toast onClose={() => setNfoundPlaca(false)} show={nfoundPlaca} delay={3000} autohide>
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded me-2"
              alt=""
            />
            <strong className="me-auto">Veículo não cadastrado</strong>
            <small>...</small>
          </Toast.Header>
          <Toast.Body>A placa do veículo não foi encontrada</Toast.Body>
        </Toast>
        </ToastContainer>
    </div>
  );
};

export default CadastroDeOrdemCalendario;