import React, { useState, useEffect, useMemo, useRef } from "react";
import { DragAndDrop, Drag, Drop } from "./drag-and-drop";
import { reorder } from "./helpers.js";
import { Cartao } from "./cartao";
import moment from "moment-timezone";
import OrdemService from "./Services/OrdemService";
import Ordens from "./components/Ordens";

export const ListComponent = (props) => {
  
  const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez"
];

const mesAtual = moment.tz("America/Sao_Paulo").format("MM");
const anoAtual = moment.tz("America/Sao_Paulo").format("yyy");
const [mes, setMes] = useState(monthNames[new Date().getMonth()])
//  console.log(mes)
const [currentOrdensList, setCurrentOrdensList] = useState([])

const diaAtual = moment.tz("America/Sao_Paulo").format("d"); //dia da semana (1-7) 
const segundaAtual = moment.tz("America/Sao_Paulo").format("DD") - diaAtual + 1; //segunda feira da semana(nº dia do mes)
const [dias, setDias] = useState([segundaAtual, segundaAtual+1, segundaAtual+2, segundaAtual+3, segundaAtual+4]) 

  const [categories, setCategories] = useState([
    {
      id: anoAtual+"-"+mesAtual+"-"+dias[0],
      name: "seg.",
      key: "segunda",
      items: []
    },
    {
      id: anoAtual+"-"+mesAtual+"-"+dias[1],
      name: "ter.",
      key: "terca",
      items: []
    },
    {
      id: anoAtual+"-"+mesAtual+"-"+dias[2],
      name: "qua.",
      key: "quarta",
      items: []
    },
    {
      id: anoAtual+"-"+mesAtual+"-"+dias[3],
      name: "qui.",
      key: "quinta",
      items: []
    },
    {
      id: anoAtual+"-"+mesAtual+"-"+dias[4],
      name: "sex.",
      key: "sexta",
      items: []
    }
  ]);

//carrega todas as ordens do corrente mes 
useEffect(() => {
  console.log("lista carregada do baco")
retrieveOrdens()
}, []); 
//adiciona ordens à current ordens lista
  const retrieveOrdens = () =>{
    OrdemService.findByAnoMes(anoAtual, mesAtual)
    .then(
      response => {
        setCurrentOrdensList(response.data)
       // console.log(response.data)
      }
    ).catch(e => {
      console.log(e);
    });
  }

  //função mapeia cada ordem da lista buscada na Api à sua categoria
  const mapeiaOrdensCategorias = () =>{ 
    currentOrdensList.forEach(ord =>{ //para cada ordem do mes  
    //so executa 1 set
      setCategories(currentCategories => //current = lista pega da api 
          //para cada categoria, atualiza se necessario.
          currentCategories.map(categ => { //para cada categoria(dia semana)
            if (categ.id === ord.dataAbertura) { //se a data da categoria for a mesma da ordem
              categ.items.indexOf(ord)==-1? categ.items.push(ord) : //adiciona ordem à categoria correspondente, se ela ainda nao estiver la
              console.log(categ)
              return categ; //retorna categ com ordem adiconada
            }
            //se nao bater as datas retorna categ old deixando a categoria como esta
            return categ; 
          }),      
      );
    });    
      console.log("normal  ", categories)
  }
  //após carregar a lista de ordens, faz o mapeamento, inserindo-as no drop
  useMemo(()=>{
    mapeiaOrdensCategorias()  
    console.log(currentOrdensList) 
  },[currentOrdensList])
  
  const [updatableOrdem, setUpdatableOrdem] = useState()

  const updateOrdemAfterDrop = () =>{
    //faz o Put
    OrdemService.update(updatableOrdem.id, updatableOrdem) 
    .then(response => {
      setUpdatableOrdem();
  //console.log(response)
  })
    .catch(e => {
      console.log(e);
    });
  }


useEffect(() => {
 if(updatableOrdem) 
  updateOrdemAfterDrop()
  }, [updatableOrdem? updatableOrdem:0]); 
  //ao soltar um draggable
  const handleDragEnd = (result) => {
    //recebe informacoes (source dropable, destination dropable e dropable type) 
    const { type, source, destination } = result;
    //console.log(type);
    if (!destination) return;

    //recebe id da origem e destino
    const sourceCategoryId = source.droppableId;
    const destinationCategoryId = destination.droppableId;

    //verifica se o tipo do drop é dropable
    if (type === "droppable-for-item") {
      //console.log("dropable");
      // Se o dropable de origem for o mesmo de destino
      if (sourceCategoryId === destinationCategoryId) {
        //função reordena a lista items na origem
        const updatedOrder = reorder(
          categories.find((category) => category.id === sourceCategoryId).items,
          source.index,
          destination.index
        );
        //função atualiza estado das categorias
        const updatedCategories = categories.map((category) =>
          category.id !== sourceCategoryId
            ? category
            : { ...category, items: updatedOrder }
        ); //o atributo itens recebe a lista ordenada
        //seta novo estado da lista de itens
        setCategories(updatedCategories);
        //se for um dropable diferente
      } else {
        // recebe as listas de itens da origem e destino
        const sourceOrder = categories.find(
          (category) => category.id === sourceCategoryId
        ).items;
        const destinationOrder = categories.find(
          (category) => category.id === destinationCategoryId
        ).items;

        //remove item da origem
        const [removed] = sourceOrder.splice(source.index, 1); //pega um item da lista, o item em source.index
        setUpdatableOrdem({...removed, dataAbertura: destinationCategoryId}) //ordem que sera atualziada
        removed.dataAbertura = destinationCategoryId; //atualiza id, a ordem antiga foi completamente removida
        //insere no destino
        destinationOrder.splice(destination.index, 0, removed);//insere na categoria destino com id novo
        //atualiza na lista de ordens
        //setCurrentOrdensList({})
        destinationOrder[removed] = sourceOrder[removed];
        delete sourceOrder[removed];

        //atualiza lista de ordens, e o useMemo chama mapeamento. Como a ordem de id destination ja esta na categoria de destino, o mapeamento nao vai inserir a ordem no destino duplicada
        setCurrentOrdensList(current =>
          current.map(orde => {//outros itens com mesma dataAbertura nao foram removidos do source
            if (orde.dataAbertura === sourceCategoryId && orde.id === removed.id) {
              //atualiza apenas item dropado, que foi removido do dropsource, e sera inserido em dest
              return {...orde, dataAbertura: destinationCategoryId}; //remove da lista curr a ordem antiga, e sobrescreve com id novo
            }
            return orde;
          }),
        );

        //função que atualiza as categorias
        const updatedCategories = categories.map((category) =>
          //para cada categoria, se for origem, recebe a lista sem elemento removido
          category.id === sourceCategoryId
            ? { ...category, items: sourceOrder }
            : //se for destino, recebe a lista de itens com novo elemento
            category.id === destinationCategoryId
            ? { ...category, items: destinationOrder }
            : category
        );
        //executa funcao de update 
        //setCategories(updatedCategories);
      }
    }
  }; 

  return (
    //DragAndDrop executa OnDragEnd função
    <DragAndDrop onDragEnd={handleDragEnd}>
      {/**mapeia cada categoria do estado */}
      {categories.map((category, categoryIndex) => {
        return (
          <div className="category-container">
            <h4 className="titulo" align="center">
              {category.name + "/"+mes}
            </h4>
            {/**Cria um elemento dropable */}
            <Drop key={category.id} id={category.id} type="droppable-for-item">
              {/**Mapeia cada item */}
              {category.items.map((item, index) => {
                return (
                  //Cria elementos draggables 
                  <Drag key={item.id} id={``+item.id} index={index}>
                    <Cartao item={item} key={item.id}/>
                  </Drag>
                );
              })}
            </Drop>
          </div>   
        );
      })} 
    </DragAndDrop>
  );
};
