import { ListComponent } from "../ListComponent";
import React from "react";
import { useState, useEffect } from "react";
import moment from "moment-timezone";
import 'moment/locale/pt';

const Ordens = () => {
    
    const mesesNomes = [ 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const diasNomes = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta']
    const [currentDate, setCurrentDate] = useState(moment.tz("America/Sao_Paulo").format("MMMM - YYYY"))

    
    
      return(
        <div style={{textAlign:"center"}}>
            <div align="center" style={{ fontSize: "2vw"}}>{currentDate}</div>
            <br/>
        <div style = {{display: "flex", marginTop: 8}}>
            <ListComponent time={currentDate}/>
        </div>
        </div>
    );
};

export default Ordens;