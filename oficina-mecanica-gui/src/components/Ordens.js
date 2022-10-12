import { ListComponent } from "../ListComponent";
import React from "react";
import { useState, useEffect } from "react";
import moment from "moment-timezone";
import 'moment/locale/pt';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
const Ordens = () => {
    
    const mesesNomes = [ 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const diasNomes = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta']
    const [currentDate, setCurrentDate] = useState(moment.tz("America/Sao_Paulo").format("MMMM - YYYY"))

    
    
      return(
        <div style={{textAlign:"center"}}>
            <div>
            <Calendar  
            defaultView='year'
            tileDisabled={({ view, date }) => (date.getDay() != 1 && view=='month')}/>
            </div>
            <br/>
        <div style = {{display: "flex", marginTop: 8}}>
            <ListComponent time={currentDate}/>
        </div>
        </div>
    );
};

export default Ordens;