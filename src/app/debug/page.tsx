'use client';

import { useAlertQueueStore } from "@/stores/alertQueueStore";
import MessageQueueProcessor from "../embed/[id]/MessageQueueProcessor";
import { useState } from "react";
 
export default function Page() {
  const [value, setValue] = useState(0.0);
  const push = useAlertQueueStore((state) => state.push);
  
  return <div>
    <MessageQueueProcessor/>
    <input className="text-black" onChange={(e) => setValue(parseFloat(e.target.value))}/>
    <button className="ml-5 bg-white text-black" onClick={() => push({
      id: null,
      alertID: null,
      receiptToken: null,
      author: "mchmatt",
      message: "Xoda sua puta manca do caralho, te odeio S2! Você alegra as nossas vidas com suas lives diárias e emocionantes",
      textToSpeechAudioURL: null,
      value: value,
      valueFormatted: new Intl.NumberFormat("pt-BR", { style: 'currency', currency: "BRL" }).format(value)
    })}>Enviar</button>
  </div>
}