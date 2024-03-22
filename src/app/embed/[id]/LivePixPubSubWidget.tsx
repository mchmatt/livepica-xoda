'use client';

import { useAlertQueueStore } from "@/stores/alertQueueStore";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

export interface LivePixPubSubWidgetParams {
  token: string
};

function getTime() {
  return Math.round(Date.now() / 1000);
}

function getAuthMessage(token: string) {
  var encoder = new TextEncoder();
  return encoder.encode(JSON.stringify({"message":{"type":1,"event":"auth","payload":token,"time":getTime()}}));
}

function getSubscribeMessage(topic: string) {
  var encoder = new TextEncoder();
  return encoder.encode(JSON.stringify({"message":{"type":1,"event":"subscribe","payload":topic,"time":getTime()}}));
}

function getConfirmationMessage(id: string) {
  var encoder = new TextEncoder();
  return encoder.encode(JSON.stringify({"message":{"type":1,"event":"confirmation","payload":id,"time":getTime()}}));
}

function getPongMessage(id: string) {
  var encoder = new TextEncoder();
  return encoder.encode(JSON.stringify({"message":{"type":1,"event":"pong","payload":id,"time":getTime()}}));
}

export default function LivePixPubSubWidget({ token } : LivePixPubSubWidgetParams) {
  const push = useAlertQueueStore((state) => state.push);
  const { sendMessage, lastMessage, readyState } = useWebSocket("wss://pubsub.livepix.gg/ws");
  
  // Parse incoming messages
  useEffect(() => {
    if (lastMessage === null)
      return;

    lastMessage.data
      .text()
      .then((data: any) => {
        const parsed = JSON.parse(data);
        if (parsed.message.event === "ping")
          sendMessage(getPongMessage(parsed.message.payload)); // Reply with a PONG to the PING message
        
        else if (parsed.message.event === "notification:show") {
          sendMessage(getConfirmationMessage(parsed.id)); // Confirm the receival of the event

          console.log("Recebemos um alerta vindo do Livepix:", parsed);
          push({
            author: parsed.message.payload.data.data.author,
            message: parsed.message.payload.data.data.message,
            value: parsed.message.payload.data.data.amount.value,
            valueFormatted: parsed.message.payload.data.data.amount.formatted,
            textToSpeechAudioURL: parsed.message.payload.data.config.textToSpeechUrl
          });
        }
      });
  }, [lastMessage]);

  // Handle initial connection
  useEffect(() => {
    if (readyState !== ReadyState.OPEN)
      return;

    sendMessage(getAuthMessage(token));
    
    const { caps }: any = jwtDecode(token);
    for (const [key, _] of Object.entries(caps)) {
      sendMessage(getSubscribeMessage(key));
    }
  }, [readyState]);

  return <>
    {readyState !== ReadyState.OPEN && <span className="flex items-center justify-center w-screen h-screen text-4xl">Iniciando conexão com LivePix...</span>}
  </>;
}