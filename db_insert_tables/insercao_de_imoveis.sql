-- Inserindo tipos de imóveis
INSERT INTO TipoImovel (nome_tipo) VALUES ('Apartamento');
INSERT INTO TipoImovel (nome_tipo) VALUES ('Terreno');
INSERT INTO TipoImovel (nome_tipo) VALUES ('Sala Comercial');
INSERT INTO TipoImovel (nome_tipo) VALUES ('Galpão');

-- Inserindo imóveis
INSERT INTO Imovel (descricao, id_tipo_imovel) VALUES ('Apartamento 100 m2 em condomínio fechado.', 1);
INSERT INTO Imovel (descricao, id_tipo_imovel) VALUES ('Terreno 500 m2 no centro da cidade.', 2);
INSERT INTO Imovel (descricao, id_tipo_imovel) VALUES ('Sala Comercial 50 m2 no edifício central.', 3);
INSERT INTO Imovel (descricao, id_tipo_imovel) VALUES ('Galpão 200 m2 na zona industrial.', 4);
INSERT INTO Imovel (descricao, id_tipo_imovel) VALUES ('Apartamento 80 m2 próximo ao parque.', 1);
INSERT INTO Imovel (descricao, id_tipo_imovel) VALUES ('Terreno 600 m2 na zona rural.', 2);
INSERT INTO Imovel (descricao, id_tipo_imovel) VALUES ('Sala Comercial 70 m2 na avenida principal.', 3);
INSERT INTO Imovel (descricao, id_tipo_imovel) VALUES ('Galpão 300 m2 na periferia.', 4);
