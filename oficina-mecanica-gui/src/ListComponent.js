import React, { useState, useEffect } from "react";
import { DragAndDrop, Drag, Drop } from "./drag-and-drop";
import { reorder } from "./helpers.js";
import { Cartao } from "./cartao";

export const ListComponent = (props) => {
  const [categories, setCategories] = useState([
    {
      id: "seg",
      name: "Seg",
      items: [
        {
          id: "abc",
          placa: "teste",
          modelo: "model test",
          vpeca: 20,
          vmobra: 10,
          relatorio: "txt",
          plac: "rgba(71, 114, 250, 0.53)",
          bcolor: "rgba(104, 229, 26, 0.53)"
        },
        {
          id: "def",
          placa: "teste",
          modelo: "model test",
          vpeca: 20,
          vmobra: 20,
          relatorio: "txt",
          plac: "rgba(71, 114, 250, 0.53)",
          bcolor: "rgba(104, 229, 26, 0.53)"
        }
      ]
    },
    {
      id: "ter",
      name: "Ter",
      items: [
        {
          id: "ghi",
          placa: "teste",
          modelo: "model test",
          vpeca: 20,
          vmobra: 10,
          relatorio: "txt",
          plac: "rgba(72, 73, 73, 0.53)",
          bcolor: "rgba(104, 229, 26, 0.53)"
        },
        {
          id: "jkl",
          placa: "teste",
          modelo: "model test",
          vpeca: 20,
          vmobra: 10,
          relatorio: "txt",
          plac: "rgba(72, 73, 73, 0.53)",
          bcolor: "rgba(72, 73, 73, 0.53)"
        }
      ]
    },
    {
      id: "qua",
      name: "Qua",
      items: [
        {
          id: "abd",
          placa: "teste",
          modelo: "model test",
          vpeca: 20,
          vmobra: 10,
          relatorio: "txt",
          plac: "rgba(71, 114, 250, 0.53)",
          bcolor: "rgba(104, 229, 26, 0.53)"
        }
      ]
    },
    {
      id: "qui",
      name: "Qui",
      items: [
        {
          id: "sss",
          placa: "teste",
          modelo: "model test",
          vpeca: 20,
          vmobra: 10,
          relatorio: "txt",
          plac: "rgba(72, 73, 73, 0.53)",
          bcolor: "rgba(104, 229, 26, 0.53)"
        }
      ]
    },
    {
      id: "sex",
      name: "Sex",
      items: [
        {
          id: "aca",
          placa: "teste",
          modelo: "model test",
          vpeca: 20,
          vmobra: 10,
          relatorio: "txt",
          plac: "rgba(71, 114, 250, 0.53)",
          bcolor: "rgba(104, 229, 26, 0.53)"
        }
      ]
    }
  ]);

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
        const [removed] = sourceOrder.splice(source.index, 1);
        //insere no destino
        destinationOrder.splice(destination.index, 0, removed);

        destinationOrder[removed] = sourceOrder[removed];
        delete sourceOrder[removed];

        //função que atualiza as categorias
        const updatedCategories = categories.map((category) =>
          //para cada categoria, se for origem, recebe a lista sem elemento
          category.id === sourceCategoryId
            ? { ...category, items: sourceOrder }
            : //se for destino, recebe a lista de itens com novo elemento
            category.id === destinationCategoryId
            ? { ...category, items: destinationOrder }
            : category
        );
        //executa funcao de update
        setCategories(updatedCategories);
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
            <h2 className="titulo" align="center">
              {category.name}
            </h2>
            {/**Cria um elemento dropable */}
            <Drop key={category.id} id={category.id} type="droppable-for-item">
              {/**Mapeia cada item */}
              {category.items.map((item, index) => {
                return (
                  //Cria elementos draggables
                  <Drag key={item.id} id={item.id} index={index}>
                    <Cartao item={item} />
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
