
# Discord Economy Bot

Olá, este é meu primeiro projeto publicado no Git para divulgar conhecimento e uma forma mais fácil de estudar. 
Outras pessoas também podem reutilizar esse bot para seus servidores sem problema, basta seguir os passos abaixo para configuração do bot

## Referência

 - [Discord.JS Guide](https://discordjs.guide/)


## Instalação

Instale o bot com npm

```bash
  npm install Discord-Economy-Bot
  cd Discord-Economy-Bot
```
Depois configure as variáveis no arquivo ``config.json`` da forma como está abaixo:
![config.json](https://media.discordapp.net/attachments/854826340615979069/1026515341490258064/unknown.png)

Execute o commands.js
```bash
  node commands.js
```

Agora seu bot está pronto para ser executado (Recomendo usar o nodemon que reinicia o projeto a cada save que você der no projeto ``npm install nodemon``)

```bash
  node commands.js
```

```bash
  nodemon index.js
```

## Aprendizados

Neste projeto aprendi como executar comandos simples do sistema MySQL usando o [Sequelize](https://sequelize.org/), noções básicas de JavaScript, Node.JS,
consumo de APIs e uso de WebHooks.


## Screenshots
- Sistema de geração de Keys

![App Screenshot](https://media.discordapp.net/attachments/1025996714974400622/1026507509311225936/unknown.png?width=425&height=473)

- Sistema de resgate de Keys

![Sistema de resgate](https://media.discordapp.net/attachments/854826340615979069/1026510361312112660/unknown.png)

- Sistema de logs para as Keys
 
![Sistema de logs](https://media.discordapp.net/attachments/1025996714974400622/1026509073178435614/unknown.png)

- Sistema de transferência de coins

![Sistema de transferência de Coins](https://media.discordapp.net/attachments/854826340615979069/1026511502569644152/unknown.png)

- Comando para ver o saldo

![Comando para ver o saldo](https://media.discordapp.net/attachments/854826340615979069/1026512199541334107/unknown.png)
## Funcionalidades

- Sistema de transferência de moeda.
- Sistema de geração de ``Keys`` para adição de moeda na economia.
- Interação com o Mercado Pago (Troca dinheiro real por coins) ~Em desenvolvimento~.
- Interação com MySQL e criação de LOG para cada ação feita.
- Sistema de tickets para suporte
## Autores

- [@imPabl0](https://github.com/ImPabl0)
