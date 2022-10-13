import React, { useState, useEffect, useMemo, useRef } from "react";
import ClienteService from "../Services/ClienteService";
import { Link, Route,useNavigate, useParams } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import { useTable } from "react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPenToSquare, faTrashCan, faPlus, faClipboardList } from "@fortawesome/free-solid-svg-icons";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import ServicoService from "../Services/ServicoService";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import AddVeiculo from './AddVeiculo';
import OrdemList from './OrdemList';

library.add(faPenToSquare, faTrashCan, faPlus);

const ServicoList = (props) => {

    const initialServicoState =
        {
        id: null,
        codOrdem: null,
        valorPecas: 0,
        valorServico: 0,
        descricao: ""
        }
      
  const [servico, setServico] = useState(initialServicoState);
  
  const [servicoCriado, setServicoCriado] = useState(false)
  const [show, setShow] = useState(false);

  const handleClose = () => {setShow(false); setServico(initialServicoState);  setServicoCriado(false)
  }
  const handleShow = () => setShow(true);

  const navigate = useNavigate()

  const [servicosList, setServicosList] = useState([])
  const servicosRef = useRef(); //persiste entre renders ao mudar paginacao, caixa de etxto ou qqr
  servicosRef.current = servicosList; //lista inicial de clientes é mantida

  const [page, setPage] = useState(1); //inicia na pagina 1
  const [count, setCount] = useState(0); 
  const [pageSize, setPageSize] = useState(3); //3 itens por pag
  const pageSizes = [3, 6, 9]; //itens por pagina opcoes
  
  const getRequestParams = (page, pageSize) => { //parametros para Api  
    let params = {};

    if (page) {
      params["page"] = page - 1;
    }

    if (pageSize) {
      params["size"] = pageSize;
    }

    return params; 
  };

  
  useEffect(() => {

      retrieveServicos(props.codOrdem)
  }, [page, pageSize, props]); //quando muda a pagina ou pageSize, reexecuta retrieveClientes

  
///BUSCA LISTA DE SERVICOS
  const retrieveServicos = (codOrdem) => {
    
    const params = getRequestParams(page, pageSize); //pega parametros

    ServicoService.findByOrdem(codOrdem, params)
      .then(response => {
        const { servicos, totalPages } = response.data
        setServicosList(servicos);
        setCount(totalPages);
       if(response.status ==204)
            setServicosList([]);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };
  //PAGINACAO
  const handlePageChange = (event, value) => {
    setPage(value);
  };
  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(1);
  };

  const refreshList = () => {
    retrieveServicos();
  };
//DELETA UM SERVICO
  const deleteServico = (index) => {
    const id = servicosRef.current[index].id;
    ServicoService.remove(id)
      .then(response => {
        console.log(response.data);
        refreshList();
      })
      .catch(e => {
        console.log(e);
      });
  };

  //ABRE MODAL DE EDICAO/CRIACAO DE SERVICO
  const openServico = (rowIndex) => { 
    const id = servicosRef.current[rowIndex].id; 
    getServico(id) 
    setServicoCriado(true) 
    handleShow() 
  };

const getServico = (id) =>{
  ServicoService.get(id)
      .then(response => {
        setServico({
          id: response.data.id,
          codOrdem: response.data.codOrdem,
          valorPecas: response.data.valorPecas,
          valorServico: response.data.valorServico,
          descricao: response.data.descricao
      });
      })
      .catch(e => {
        console.log(e);
      });
}
  //DEFINICAO TABELA
  const columns = useMemo(
    () => [
      {
        Header: "Codigo de Serviço",
        accessor: "id",
      },
      {
        Header: "Valor em peças",
        accessor: "valorPecas",
      },
      {
        Header: "Mão de obra",
        accessor: "valorServico",
      },
      {
        Header: "Descricao",
        accessor: "descricao",
      },
      {
        Header: " ",
        accessor: "actions",
        Cell: (props) => {
          const rowIdx = props.row.id; //recebe o props de um elemento -> recebe o indice da linha
          return (
            <div className="row" align="center">
            <div className="col-sm">
              <span onClick={() => openServico(rowIdx)}> {/**rowIdx é o indice do cliente na lista clientes */}
              <OverlayTrigger
                      key={"ed"}
                      delay={{hide: 5 }}
                      placement={"top"}
                       overlay={
                          <Tooltip id={`tooltip-${"ed"}`}>
                            <strong>{"editar serviço"}</strong>.
                          </Tooltip>
                        }>  
                      <FontAwesomeIcon icon="fa-solid fa-pen-to-square" />
                    </OverlayTrigger>
              
              </span>
            </div>
            <div className="col-sm">
              <span onClick={() => deleteServico(rowIdx)}>
                  <OverlayTrigger
                  delay={{hide: 5 }}
                      key={"del"}
                      placement={"top"}
                       overlay={
                          <Tooltip id={`tooltip-${"del"}`}>
                            <strong>{"deletar serviço"}</strong>.
                          </Tooltip>
                        }>  
                      <FontAwesomeIcon icon="fa-solid fa-trash-can" />
                    </OverlayTrigger>
              
              </span>
              </div>  
              <div className="col-sm">
              <span onClick={() => openServico(rowIdx)}>
                  <OverlayTrigger
                  delay={{hide: 5 }}
                      key={"del"}
                      placement={"top"}
                       overlay={
                          <Tooltip id={`tooltip-${"del"}`}>
                            <strong>{"Serviços"}</strong>.
                          </Tooltip>
                        }>  
                      <FontAwesomeIcon icon={faClipboardList} />
                    </OverlayTrigger>
              
              </span>
              </div> 
            </div>
          );
        },
      },
    ],
    []
  );
const [submitted, setSubmitted] = useState(false)
  //Varias funcoes que recebem dados da tabela
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ //tabela usada
    columns, //colunas definidas acima
    data: servicosList, //dados com accessor
  });

  const saveServico= () => {
    //faz o Post
    ServicoService.create(servico) 
      .then(response => {
        setServico({
            id: response.data.id,
            codOrdem: response.data.codOrdem,
            valorPecas: response.data.valorPecas,
            valorServico: response.data.valorServico,
            descricao: response.data.descricao
        });
            retrieveServicos(props.codOrdem);
            setServicoCriado(true)
            console.log(response)
            setSubmitted(true)
    })
      .catch(e => {
        console.log(e);
      });
  };


//ATRIBUI VALORES À JSON 
const handleInputChange = event => {
  const { name, value } = event.target;
  setServico({ ...servico, [name]: value });
};

const faznada = ()=>{}

  return (
    <div className="list row" style={{paddingLeft: "0rem"}}>
      <h3 align="center">Serviços</h3>
      <div className="col-md-12 list">
        {/**Itens p/ pg */}
      {"Itens por página: "} {/**handlePageSize atualiza pageSize que dispara nova busca na api pelo useEffect */}
          <select onChange={handlePageSizeChange} value={pageSize}> 
            {pageSizes.map((size) => ( //opcao dos tamanhos que podem ser escolhidos
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          {/**Paginacao -> indice das paginas*/}
          <Pagination
            className="my-3"
            count={count} //contem a qtd total de paginas
            page={page} //ao mudar este valor, o indice muda
            siblingCount={1}
            boundaryCount={1}
            variant="outlined"
            shape="rounded"
            onChange={handlePageChange} //altera a pagina(indice) e dispara nova busca na api
          />
          <Button variant="primary" onClick={handleShow}>
        Cadastrar Servico
      </Button>
        <table
          className="table table-striped table-bordered"
          {...getTableProps()}
        >
          <thead>
            {headerGroups.map((headerGroup) => ( //mapeia as colunas/headers extraidas
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}> {/**pega props do corpo gerado */}
            {rows.map((row, i) => { //cada row recebe indice(a lista clientes tem indices)
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Cadastro de Servicos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
         Aqui vai a componente de cadastro de servicos
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Voltar
          </Button>
          <Button variant="primary" onClick={servicoCriado?faznada: saveServico}>
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ServicoList;