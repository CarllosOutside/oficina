import {
  Button,
  Collapse,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardText
} from "reactstrap";
import React, { useState, useEffect } from "react";

import { BiChevronDown, BiChevronUp } from "react-icons/bi";

export const Cartao = (props) => {
  const [collapse, setCollapse] = useState(false);
  const toggle = () => setCollapse(!collapse);

  const item = props.item;
  //console.log(item);
  return (
    <Card
      className="my-2"
      color="primary"
      inverse
      style={{
        width: "100%",
        textAlign: "left",
        padding: 0,
        margin: 0,
        border: 0
      }}
    >
      <CardHeader style={{ fontSize: "1.4vw", backgroundColor: item.plac }}>
        Placa: {item.placa}
      </CardHeader>
      <CardBody style={{ backgroundColor: item.bcolor }}>
        <Collapse isOpen={collapse}>
          <CardText style={{ fontSize: "1.2vw" }}>
            <div>Modelo: {item.veiculo.marca+" - "+item.veiculo.modelo}</div>
            <div>Valor em peças: R$ {item.valorTotalPecas}</div>
            <div>Valor em mão de obra: R$ {item.valorTotalServicos}</div>
    <div>Total: R$ {item.valorTotalPecas + item.valorTotalServicos}</div>
          </CardText>
        </Collapse>

        <div style={{ textAlign: "center" }}>
          <Button
            onClick={toggle}
            style={{
              marginBottom: "0.1vw",
              width: "50%",
              fontSize: "1.2vw",
              backgroundColor: "rgba(223, 236, 243, 0.01)",
              border: 0,
              marginTop: "0.2vw"
            }}
          >
            {collapse ? <BiChevronUp /> : <BiChevronDown />}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};
