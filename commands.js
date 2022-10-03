const {SlashCommandBuilder, Routes, REST} = require('discord.js');
const { Body } = require('node-fetch');
const {token, clientid} = require('./config.json');

const commands = [
new SlashCommandBuilder()
.setName('saldo')
.setDescription('Mostra seu saldo atual no banco'),
new SlashCommandBuilder()
.setName('gerar')
.setDescription('Gera um voucher de 10 coins'),
new SlashCommandBuilder()
.setName('transferir')
.setDescription('Transfere uma certa quantia para outra pessoa deste servidor.')
.addIntegerOption(option=>option.setName('quantia').setDescription('Quantia a ser transferida').setRequired(true))
.addUserOption(option=>option.setName('user').setDescription('Pessoa para quem você irá transferir').setRequired(true)),
new SlashCommandBuilder()
.setName('resgatar')
.setDescription('Comando para resgatar uma KEY do Eco Bot')
.addStringOption(option=>option.setName('key').setDescription('Key recebida do moderador').setRequired(true)),


]
const rest = new REST({version: '10'}).setToken(token);

rest.put(Routes.applicationCommands(clientid),{body:commands}).then((data)=> console.log(`Registrado com sucesso ${data.length} comandos da aplicação`)).catch(console.error);