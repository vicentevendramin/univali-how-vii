# Usa a imagem oficial do PostgreSQL como base
FROM postgres:latest

# Define variáveis de ambiente opcionais
ENV POSTGRES_USER=user
ENV POSTGRES_PASSWORD=password
ENV POSTGRES_DB=how

# Copia arquivos SQL para inicializar o banco de dados (se necessário)
COPY ./db_insert_tables/*.sql /docker-entrypoint-initdb.d/
