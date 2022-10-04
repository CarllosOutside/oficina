import React, { useState, useEffect } from "react";
import LocaisService from "../Services/LocaisService";
import { Link } from "react-router-dom";
import {Dropdown,DropdownToggle,DropdownItem,DropdownMenu} from "reactstrap";
import PessoasService from "../Services/PessoasService";
import ClienteService from "../Services/ClienteService";

const LocaisList = (props) => {
  const [estados, setEstados] = useState([]); //Lista de estados
  const [currentEstado, setCurrentEstado] = useState(null); //Estado selecionado
  const [currentIndex, setCurrentIndex] = useState(-1); //Indice selecionado
  const [searchNome, setSearchNome] = useState(""); //Nome do estado buscado
  const [dropDownEstado, setDropDownEstado] = useState(false); //DropDown Ativo
  
  const [cidades, setCidades] = useState([]);
  const [currentCidade, setCurrentCidade] = useState(null);
  const [currentCIndex, setCurrentCIndex] = useState(-1);
  const [dropDownCidade, setDropDownCidade] = useState(false);

  const [pessoa, setPessoa] = useState(null)

  //Expande/abre dorpdown menu
  const toggleEstado = () =>{
    setDropDownEstado(!dropDownEstado)
  }
  const toggleCidade= () =>{
    setDropDownCidade(!dropDownCidade)
  }

  useEffect(() => {
    retrieveEstados();
  }, []);

  useEffect(() => {
    setPessoa(props.pessoa)
  }, [props]);

  //Busca todos os estados no banco
  const retrieveEstados = () => {
    LocaisService.getAllEstados()
      .then(response => {
        setEstados(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  //Busca cidades pertencentes a um estado
  const retrieveCidades = (cod_estado) => {
    LocaisService.getCidadesByEstado(cod_estado)
      .then(response => {
        setCidades(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  //SALVA COM POST E DEPOIS SETA A JSON COM A RESPOSTA VINDA DA API, QUE DEVE CONTER UM ID GERADO
  const saveCliente= () => {
    //pessoa a ser salva
    var data = pessoa

    //faz o Post
    PessoasService.create(data) 
      .then(response => {
        setPessoa({
            cod_pessoa: response.data.cod_pessoa, //salva pessoa no banco e recebe o id gerado
            nome: response.data.nome,
            endereco: response.data.endereco,
            telefone: response.data.telefone,
            cidade:	response.data.cidade
        });
        //depois de salvar pessoa
        ClienteService.create({pessoa: response.data}) //salva a pessoa gerada como cliente
        .then(response2 => { //apos o servico acima, que retorna a resposta2
                console.log(response2);//imprime cliente salvo
                props.changeVoSubmit(); //muda estado do avo AddCliente para submitted
              })
              .catch(e => {
                console.log(e);
              });
      }) 
      .catch(e => {
        console.log(e);
      });
  };

  //faz o Update
  const udpateCliente = () =>{
    var data = pessoa

    PessoasService.update(data.cod_pessoa, data)
    .then(response => {
      setPessoa({
        cod_pessoa: response.data.cod_pessoa, //salva pessoa no banco e recebe o id gerado
        nome: response.data.nome,
        endereco: response.data.endereco,
        telefone: response.data.telefone,
        cidade:	response.data.cidade
    });
      console.log(response);//imprime pessoa atualizada
      props.changeVoSubmit();
    })
    .catch(e => {
      console.log(e);
    });
  };

  //Seta Estado ativo e seu indice na lista
  const setActiveEstado = (estado, index) => {
    setCurrentEstado(estado);
    setCurrentIndex(index);
    //carrega todas as cidades do estado selecionado
    retrieveCidades(estado.id);
    setCurrentCidade(null);
    setCurrentCIndex(-1);
  };

  //cidade selecionada e inserida na pessoa vinda de AddPessoa
  const setActiveCidade = (cidade, cindex) => {
    setCurrentCidade(cidade);
    setCurrentCIndex(cindex);
    props.changeCidade(cidade);
  };

  //Busca um estado por nome no banco
  const findByNome = () => {
    LocaisService.getEstadoByNome(searchNome)
      .then(response => {
        setEstados(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const faznada = () => {}
  return (
  <div className="list row">

    {/**container estado */}
    <div className="col-md-3">
      <Dropdown isOpen={dropDownEstado} toggle={toggleEstado}>
        <DropdownToggle caret>
         {currentEstado? currentEstado.name: (props.pessoa.cidade? props.pessoa.cidade.state_id.name: "Selecione um Estado")}
        </DropdownToggle>
         <DropdownMenu container="body">
            {estados &&
            estados.map((estado, index) => (
              <DropdownItem
                onClick={estado!=currentEstado?() => setActiveEstado(estado, index): ()=>faznada}
                key={index}
              >
                {estado.name}
              </DropdownItem>
            ))}
         </DropdownMenu>
      </Dropdown>
    </div>

    {/**container cidades */}
    <div className="col-md-3">
      <Dropdown isOpen={dropDownCidade} toggle={toggleCidade} disabled={currentEstado? false: true} >
        <DropdownToggle caret>
        {currentCidade? currentCidade.name: (props.pessoa.cidade? props.pessoa.cidade.name: "Selecione uma Cidade")}
        </DropdownToggle>
         <DropdownMenu container="body">
            {cidades &&
            cidades.map((cidade, cindex) => (
              <DropdownItem
                onClick={ () => setActiveCidade(cidade, cindex)}
                key={cindex}
              >
                {cidade.name}
              </DropdownItem>
            ))}
         </DropdownMenu>
      </Dropdown>
    </div>
    <br/>
        <div align= "right">
          <button onClick={props.pessoa.cod_pessoa?udpateCliente :saveCliente} className="btn btn-success">
            {props.pessoa.cod_pessoa? "Editar Cliente" : "Criar Cliente"}
          </button>
        </div>
  </div>
  );
};

export default LocaisList;