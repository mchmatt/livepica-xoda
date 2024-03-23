"use client";

/* Hooks */
import { useCallback, useEffect, useRef } from "react";
import { useAlertQueueStore } from "@/stores/alertQueueStore";
import { useCurrentAlertStore } from "@/stores/currentAlertStore";

/* Components */
import GenericAlert from "./GenericAlert";

//5, 6, 10, 15
/* Configuração */
const alerts = [
  { // Nivelzin brigado aí meu homem
    audio: "/sounds/alert1.mp3",
    image: "/images/alert1.gif",
    condition: (valor: number) => valor === 5
  },
  { // Carlão DELICIA
    audio: "/sounds/alert2.mp3",
    image: "/images/alert2.gif",
    condition: (valor: number) => valor === 6
  },
  { // Maquita
    audio: "/sounds/alert4.mp3",
    image: "/images/alert4.gif",
    condition: (valor: number) => valor === 15
  },
  { // Nivelzinho sendo muito safado do nada
    audio: "/sounds/alert5.mp3",
    image: "/images/alert5.gif",
    condition: (valor: number) => valor === 24
  },
  { // Carlão NAAAAO, SAAAAI
    audio: "/sounds/alert7.mp3",
    image: "/images/alert7.gif",
    condition: (valor: number) => valor === 30
  },
  { // Nivelzinho espirrando super estourado e assustador
    audio: "/sounds/alert8.mp3",
    image: "/images/alert8.gif",
    condition: (valor: number) => valor === 40
  },
  { // Bluezão te amo XodaRap
    audio: "/sounds/alert10.mp3",
    image: "/images/alert10.gif",
    condition: (valor: number) => valor === 60
  },
  { // NivelzinAAAAAAAAAAAAAAAAAAAAAA
    audio: "/sounds/alert11.mp3",
    image: "/images/alert11.gif",
    condition: (valor: number) => valor === 66.66
  },
  { // NivelzinALOOOOOOOOOOOOOOOOOOOO
    audio: "/sounds/alert12.mp3",
    image: "/images/alert12.gif",
    condition: (valor: number) => valor === 66.67
  },
  { // Áudio secreto
    audio: "/sounds/alert14.m4a",
    image: "/images/alert14.gif",
    condition: (valor: number) => valor > 3600
  },
  { // Ayayaya estourado invertido podre horrível 
    audio: "/sounds/alert13.wav",
    image: "/images/alert13.gif",
    condition: (valor: number) => valor >= 200
  },
  { // Ayayaya estourado
    audio: "/sounds/alert9.wav",
    image: "/images/alert9.gif",
    condition: (valor: number) => valor >= 50
  },
  { // Jumpscare do Jack
    audio: "/sounds/alert6.mp3",
    image: "/images/alert6.gif",
    condition: (valor: number) => valor >= 25
  },
  { // Ayayayaya
    audio: "/sounds/alert3.mp3",
    image: "/images/alert3.gif",
    condition: (valor: number) => valor >= 10
  },
];

// Alerta padrão, roda caso nenhum outro passe
const defaultAlert = {
  audio: "/sounds/default.wav",
  image: "/images/default.gif"
};

const alreadyProcessed = new Set();

/* Lógica / processamento das mensagens */
export default function MessageQueueProcessor() {
  const currentAlertRef = useRef<any[]>();
  const pop = useAlertQueueStore((state) => state.pop);
  const currentAlert = useCurrentAlertStore((state) => state.currentAlert);
  const setCurrentAlert = useCurrentAlertStore((state) => state.setCurrentAlert);

  useEffect(() => {
    currentAlertRef.current = currentAlert;
  }, [currentAlert]);

  const processMessage = useCallback(() => {
    if (currentAlertRef.current) { // já estamos mostrando um alerta
      setTimeout(processMessage, 250);
      return;
    }

    const data = pop();
    if (!data || alreadyProcessed.has(data.id)) { // não temos nenhuma mensagem p/ processar
      setTimeout(processMessage, 250);
      return;
    }

    if (data.id)
      alreadyProcessed.add(data.id);

    /* Condições */
    var chosenAlert = defaultAlert;
    for (const alert of alerts) {
      if (!alert.condition(data.value))
        continue;
      
      chosenAlert = alert;
      break;
    }

    setCurrentAlert(<GenericAlert data={data} alert={chosenAlert}/>);
    setTimeout(processMessage, 250);
  }, []);
  
  useEffect(() => {
    processMessage();
  }, []);

  return currentAlert;
}