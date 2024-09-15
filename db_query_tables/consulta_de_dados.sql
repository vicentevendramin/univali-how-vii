SELECT 
    p.id_pagamento,
    p.data_pagamento,
    p.valor_pagamento,
    i.codigo_imovel,
    i.descricao AS descricao_imovel,
    t.nome_tipo AS tipo_imovel
FROM 
    Pagamento p
JOIN 
    Imovel i ON p.codigo_imovel = i.codigo_imovel
JOIN 
    TipoImovel t ON i.id_tipo_imovel = t.id_tipo_imovel;
