"use client";

import { useEffect, useState } from "react";

export default function Artifact() {
  const [pointX, setPointX] = useState(-10);
  const [pointY, setPointY] = useState(-10);

  useEffect(() => {
    const run = async () => {
      // Coloca o ponto em algum lugar da janela
      setPointX(Math.random() * window.innerWidth);
      setPointY(Math.random() * window.innerHeight);

      // Espera um tempo aleatório entre 10 segundos e 70 segundos
      await new Promise((resolve) => setTimeout(resolve, 10000 + Math.random() * 60000));

      // Esconde o ponto
      setPointX(-10);
      setPointY(-10);

      // Roda denovo depois de no mínimo meia hora, no máximo uma hora
      setTimeout(run, 1800 * 1000 + Math.random() * 1800);
    };

    // Espera um mínimo de uma hora, máximo de duas horas p/ começar o loop
    setTimeout(run, 3600 * 1000 + Math.random() * 3600);
  }, []);

  return (
    <div style={
      { 
        position: "absolute", 
        width: 1, 
        height: 1,
        top: pointY,
        left: pointX,
        backgroundColor: "red" 
      }}
    />
  );
}