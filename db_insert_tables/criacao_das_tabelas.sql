CREATE TABLE TipoImovel (
    id_tipo_imovel SERIAL PRIMARY KEY,
    nome_tipo VARCHAR(50) NOT NULL
);

CREATE TABLE Imovel (
    codigo_imovel SERIAL PRIMARY KEY,
    descricao VARCHAR(255) NOT NULL,
    id_tipo_imovel INT NOT NULL,
    FOREIGN KEY (id_tipo_imovel) REFERENCES TipoImovel(id_tipo_imovel)
);

CREATE TABLE Pagamento (
    id_pagamento SERIAL PRIMARY KEY,
    data_pagamento DATE NOT NULL,
    valor_pagamento DECIMAL(10, 2) NOT NULL,
    codigo_imovel INT NOT NULL,
    FOREIGN KEY (codigo_imovel) REFERENCES Imovel(codigo_imovel)
);
