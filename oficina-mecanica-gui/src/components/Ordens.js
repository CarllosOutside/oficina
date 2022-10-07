import { ListComponent } from "../ListComponent";
import React from "react";
import { useState } from "react";

const Ordens = () => {
    const mesesNomes = [ 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const diasNomes = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta']
    const [currentDate, setCurrentDate] = useState(diasNomes[new Date().getDay()]+"-feira,  "+mesesNomes[new Date().getMonth()]+ "  " + new Date().getFullYear())
    
    return(
        <div style={{textAlign:"center"}}>
            <div align="center" style={{ fontSize: "2vw"}}>{currentDate}</div>
            <br/>
        <div style = {{display: "flex", marginTop: 8}}>
            <ListComponent/>
        </div>
        </div>
    );
};

export default Ordens;