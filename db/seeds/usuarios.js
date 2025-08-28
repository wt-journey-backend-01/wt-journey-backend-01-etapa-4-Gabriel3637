/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('usuarios').del()
  await knex('usuarios').insert([
    {nome: 'Usuario 1', email: 'usuario1@example.com', senha: 'senha1'},
    {nome: 'Usuario 2', email: 'usuario2@example.com', senha: 'senha2'},
    {nome: 'Usuario 3', email: 'usuario3@example.com', senha: 'senha3'}
  ]);
};
