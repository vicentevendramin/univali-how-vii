const express = require('express');
const { Client } = require('pg');
const app = express();
const fs = require('fs');
const path = require('path');

// Configuração da conexão com o banco de dados
const client = new Client({
  user: 'user',
  host: 'localhost',
  database: 'how',
  password: 'password',
  port: 5432,
});

client.connect();

// Função para verificar se as tabelas existem
async function verificarTabelas() {
  try {
    const res = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'pagamento' OR table_name = 'imovel' OR table_name = 'tipo_imovel'
      );
    `);

    return res.rows[0].exists; // Retorna true se uma das tabelas existir
  } catch (err) {
    console.error('Erro ao verificar tabelas:', err);
    return false;
  }
}

// Função para executar scripts SQL
async function executarScriptsSql() {
  try {
    const sqlDir = path.join(__dirname, 'db_insert_tables');
    const sqlFiles = fs.readdirSync(sqlDir);

    for (const file of sqlFiles) {
      const filePath = path.join(sqlDir, file);
      const sqlScript = fs.readFileSync(filePath, 'utf-8');
      console.log(`Executando script: ${file}`);
      await client.query(sqlScript);
    }

    console.log('Scripts SQL executados com sucesso.');
  } catch (err) {
    console.error('Erro ao executar os scripts SQL:', err);
  }
}

// Função principal
async function inicializarServidor() {
  const tabelasExistem = await verificarTabelas();

  if (!tabelasExistem) {
    console.log('Tabelas não encontradas, executando scripts SQL...');
    await executarScriptsSql();
  } else {
    console.log('Tabelas já existem, não há necessidade de executar os scripts.');
  }
}

// Iniciar a verificação ao rodar o servidor
inicializarServidor();

// Função auxiliar para carregar todos os dados de pagamento
async function carregarDados() {
  const result = await client.query(`
    SELECT 
      P.data_pagamento, 
      P.valor_pagamento, 
      P.codigo_imovel, 
      I.descricao AS descricao_imovel, 
      T.nome_tipo 
    FROM Pagamento P
    JOIN Imovel I ON P.codigo_imovel = I.codigo_imovel
    JOIN TipoImovel T ON I.id_tipo_imovel = T.id_tipo_imovel
  `);
  return result.rows;
}

// a. Função que retorna o id de cada imóvel e a soma de todos os pagamentos
app.get('/imoveis-pagamentos', async (req, res) => {
  try {
    const dados = await carregarDados();

    const imoveisPagamentos = dados.reduce((acumulador, pagamento) => {
      const { codigo_imovel, valor_pagamento } = pagamento;
      if (!acumulador[codigo_imovel]) {
        acumulador[codigo_imovel] = 0;
      }
      acumulador[codigo_imovel] += parseFloat(valor_pagamento);
      return acumulador;
    }, {});

    const response = Object.entries(imoveisPagamentos).map(([id_imovel, total_pagamentos]) => ({
      id_imovel: parseInt(id_imovel, 10),
      total_pagamentos,
    }));

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao consultar os pagamentos dos imóveis.');
  }
});

// b. Função que retorna uma lista com cada mês/ano e o total de vendas no período
app.get('/vendas-mes', async (req, res) => {
  try {
    const dados = await carregarDados();

    const vendasPorMes = dados.reduce((acumulador, pagamento) => {
      const data = new Date(pagamento.data_pagamento);
      const mesAno = `${('0' + (data.getMonth() + 1)).slice(-2)}/${data.getFullYear()}`;
      if (!acumulador[mesAno]) {
        acumulador[mesAno] = 0;
      }
      acumulador[mesAno] += parseFloat(pagamento.valor_pagamento);
      return acumulador;
    }, {});

    const response = Object.entries(vendasPorMes).map(([mes_ano, total_vendas]) => ({
      mes_ano,
      total_vendas,
    }));

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao consultar as vendas por mês.');
  }
});

// c. Função que retorna o percentual de vendas por tipo de imóvel
app.get('/percentual-vendas', async (req, res) => {
  try {
    const dados = await carregarDados();

    // Contando as vendas por tipo de imóvel
    const vendasPorTipo = dados.reduce((acumulador, pagamento) => {
      const { nome_tipo } = pagamento;
      if (!acumulador[nome_tipo]) {
        acumulador[nome_tipo] = 0;
      }
      acumulador[nome_tipo] += 1; // Contando a ocorrência
      return acumulador;
    }, {});

    // Calculando o percentual
    const totalVendas = dados.length;
    const response = Object.entries(vendasPorTipo).map(([tipo_imovel, quantidade]) => ({
      tipo_imovel,
      percentual_vendas: ((quantidade / totalVendas) * 100).toFixed(2) + '%',
    }));

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao consultar o percentual de vendas por tipo de imóvel.');
  }
});

// Fechar a conexão quando o servidor for encerrado
process.on('SIGINT', () => {
  client.end();
  console.log('Conexão com o banco de dados fechada.');
  process.exit();
});

// Servidor rodando na porta 3000
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
