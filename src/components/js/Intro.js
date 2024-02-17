import React from 'react';
function Intro({
  theme
}) {
  return React.createElement("div", {
    className: "flex items-center justify-center flex-col text-center pt-20 pb-6"
  }, React.createElement("h1", {
    className: "text-4xl md:text-7xl dark:text-white mb-1 md:mb-3 font-bold"
  }, "Guilherme R. Alves"), React.createElement("p", {
    className: "text-base md:text-xl mb-3 font-medium"
  }, "Front-End Software Developer"), React.createElement("p", {
    className: "text-sm max-w-xl mb-6 font-bold"
  }, "Bem-vindo ao meu portf\xF3lio! Aqui voc\xEA encontrar\xE1 uma sele\xE7\xE3o cuidadosamente escolhida dos meus trabalhos, habilidades e experi\xEAncias profissionais.", React.createElement("br", null), "Estudante de Engenharia da Computa\xE7\xE3o altamente motivado e entusiasmado com experi\xEAncia em desenvolvimento web e interesse apurado em seguran\xE7a web. ", React.createElement("br", null), "\"A", ' ', React.createElement("a", {
    href: "https://github.com/athena272",
    target: "_blank",
    style: {
      textDecoration: 'underline',
      color: `${theme === 'dark' ? '#38BDF8' : '#4C00FF'}`
    },
    rel: "noreffer noopener"
  }, "programa\xE7\xE3o"), ' ', "iluminou meus dias mais sombrios.\" \u2B50 ", React.createElement("br", null)));
}
export default Intro;