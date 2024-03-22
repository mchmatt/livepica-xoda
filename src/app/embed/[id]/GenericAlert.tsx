import Image from 'next/image';
import { useEffect } from "react";
import { QueuedMessage } from "@/stores/alertQueueStore";
import { useCurrentAlertStore } from "@/stores/currentAlertStore";

export interface GenericAlertProps {
  data: QueuedMessage,
  alert: {
    audio: string
    image: string
  }
};

export default function GenericAlert({ data, alert } : GenericAlertProps) {
  const setCurrentAlert = useCurrentAlertStore((state) => state.setCurrentAlert);

  useEffect(() => {
    // Iniciamos o áudio do alerta primeiro
    var alertAudio = new Audio(alert.audio);
    alertAudio.play();
    alertAudio.onended = async () => { 
      // O áudio do alerta acabou, esperamos 250ms p/ começar o áudio da IA
      await new Promise(resolve => setTimeout(resolve, 250));
      
      if (data.textToSpeechAudioURL) {
        var textToSpeechAudio = new Audio(data.textToSpeechAudioURL);
        textToSpeechAudio.play();
        textToSpeechAudio.onended = () => {
          // Ambos áudio do alerta e da IA acabaram, reseta a tela p/ esperar por novos alertas
          setTimeout(() => setCurrentAlert(null), 1000);
        }
      }
      else
        setTimeout(() => setCurrentAlert(null), 5000);
    };
  }, []);

  return (
    <div className="absolute flex flex-col items-center w-screen h-screen">
      <Image 
        src={alert.image}
        width={0}
        height={0}
        alt=""
        style={{ flex: 1, width: "auto", height: "0vh", maxHeight: "70vh", objectFit: "contain" }}
      />
      <div className="text-5xl shadow-md mt-8">
        <span className="text-green-500">{data.author}</span>
        <span> mandou </span>
        <span className="text-green-500">{data.valueFormatted}</span>
      </div>
      <div className="text-3xl text-center text-wrap break-normal max-w-full mt-5">
        <span>{data.message}</span>
      </div>
    </div>
  );
};