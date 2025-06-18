import React from 'react';

function Intro({ theme }) {

   return (
      <div className="flex items-center justify-center flex-col text-center pt-20 pb-6">
         <h1 className="text-4xl md:text-7xl dark:text-white mb-1 md:mb-3 font-bold">Guilherme R. Alves</h1>
         <p className="text-base md:text-xl mb-3 font-medium">Front-End Software Developer</p>
         <p className="text-sm max-w-xl mb-6 font-bold">
            Desenvolvedor de software com especialidade em Node.js e JavaScript moderno. Construo APIs e microserviços escaláveis com Express,
            NestJS e TypeScript, aplicando autenticação JWT, testes com Jest e Supertest, segurança de aplicações e práticas de integração contínua.
            Exploro arquiteturas serverless na AWS usando Serverless Framework e integro filas SQS, S3 e outras soluções cloud para alta disponibilidade. <br /> <br />

            No front-end atuo com React, Next.js e Angular, otimizando performance, SEO e acessibilidade de produtos como o portal BNE Banco Nacional
            de Empregos. Tenho familiaridade com microsserviços em C# e .NET, o que amplia minha visão full stack e facilita a colaboração entre equipes
            híbridas. <br /> <br />

            Cursando Engenharia de Computação na Universidade Federal de Sergipe e Análise e Desenvolvimento de Sistemas na Unicesumar, busco
            aprendizado contínuo, colaboração e entrega de soluções que gerem impacto positivo e sustentável.
            <br /> <br />
            "A{' '}
            <a href="https://github.com/athena272" target="_blank" style={{ textDecoration: 'underline', color: `${theme === 'dark' ? '#38BDF8' : '#4C00FF'}` }} rel="noreffer noopener">
               programação
            </a>
            {' '}iluminou meus dias mais sombrios." ⭐ <br />
         </p>
      </div>
   )
}

export default Intro;