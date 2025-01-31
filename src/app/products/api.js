import { Pool } from 'pg';

// Configuração da conexão com o banco de dados
const pool = new Pool({
  host: 'inanely-changeable-chub.data-1.use1.tembo.io',
  port: 5432,
  user: 'postgres',
  password: 'XNQJ84BbUlCLDhww',
  database: 'postgres',
});

// API Handler
export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const result = await pool.query('SELECT * FROM produtos');
        res.status(200).json(result.rows);
      } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar produtos' });
      }
      break;

    case 'POST':
      try {
        const { nome, classe, valor, descricao, foto } = req.body;
        // Enviar a foto em formato binário (base64 ou similar)
        await pool.query(
          'INSERT INTO produtos (nome, classe, valor, descricao, foto) VALUES ($1, $2, $3, $4, $5)',
          [nome, classe, valor, descricao, foto] // foto será em formato binário
        );
        res.status(201).json({ message: 'Produto criado com sucesso!' });
      } catch (error) {
        res.status(500).json({ error: 'Erro ao criar produto' });
      }
      break;

    case 'PUT':
      try {
        const { id, nome, classe, valor, descricao, foto } = req.body;
        // Atualiza o produto, considerando a foto (caso seja enviada)
        await pool.query(
          'UPDATE produtos SET nome = $1, classe = $2, valor = $3, descricao = $4, foto = $5, data_atualizacao = CURRENT_TIMESTAMP WHERE id = $6',
          [nome, classe, valor, descricao, foto, id]
        );
        res.status(200).json({ message: 'Produto atualizado com sucesso!' });
      } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar produto' });
      }
      break;

    case 'DELETE':
      try {
        const { id } = req.body;
        await pool.query('DELETE FROM produtos WHERE id = $1', [id]);
        res.status(200).json({ message: 'Produto excluído com sucesso!' });
      } catch (error) {
        res.status(500).json({ error: 'Erro ao excluir produto' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Método ${method} não permitido`);
  }
}
