const Sequelize = require('sequelize');
const {token, giftimage} = require('./config.json');
const Discord = require('discord.js')
const {Client, GatewayIntentBits,ButtonBuilder, messageLink, MessageType, EmbedBuilder,SelectMenuBuilder,ActivityType, ActionRowBuilder, ButtonStyle} = require('discord.js');

const client = new Discord.Client({intents:[GatewayIntentBits.Guilds, 'DirectMessages', 'MessageContent']});
const sequelize = new Sequelize('marcobank', 'root', '',{
    host:'localhost',
    dialect:'mariadb',
    logging:false
})
const marcobank = sequelize.define('contas',{
    discordid: Sequelize.TEXT,
    coin:{
        type: Sequelize.FLOAT,
        default: 5,
        allowNull: false,
    },
},{dialect:'mariadb'});
const marcokey = sequelize.define('keys',{
    fatkey: Sequelize.TEXT,
    valid: Sequelize.TEXT,
    
    
},{dialect:'mariadb'});
function MakeKey(length) {
    var result           = 'FatKey';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
}
client.once('ready',()=>{
    marcokey.sync()
    marcobank.sync();
    console.log(`Bot logado como ${client.user.username}`)
    client.user.setPresence({ status:'dnd',activities:
         [{ name: 'RODANDO MARCO BANK', type: ActivityType.Playing }]
        });
})
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
client.on('interactionCreate', async interaction=>{
    if(!interaction.isChatInputCommand()) return;
    if (interaction.commandName == 'bangar'){
        let time = interaction.options.getString('time');
        await interaction.reply('https://images-ext-1.discordapp.net/external/vvGFxlV5u_AvCF3yhuh6CQ4Yk7b8Rhhv2kzI9TP0jRw/https/pbs.twimg.com/media/FJzVcG5VgAIloWw.jpg?width=758&height=473');
        await interaction.channel.send({content: 'CEGUEI!!'});
        setTimeout(()=>interaction.channel.bulkDelete(2), time*1000);
    }else if (interaction.commandName == 'bangespecial'){
        let time = interaction.options.getString('time');
        await interaction.reply('https://cdn.discordapp.com/attachments/854826340615979069/1025509301927825428/Untitled-1.png');
        await interaction.channel.send({content: 'CEGUEI!!'});
        setTimeout(()=>interaction.channel.bulkDelete(2), time*1000);
    }else if (interaction.commandName == 'saldo'){
            const saldo = await marcobank.findOne({where:{discordid:interaction.user.id}})
            if (saldo){
                interaction.reply(`<@${interaction.user.id}> tem ${saldo.coin} Coins`)
                
            }else{
            const criarconta = marcobank.create({
                discordid: interaction.user.id,
                coin:'5'
            })
            interaction.reply('Este é o seu primeiro acesso, então criei uma conta pra você com 5 Coins')
            
            }
    }else if(interaction.commandName ==='transferir'){
        var target = interaction.options.getMember('user');
        let coins = interaction.options.getInteger('quantia');
        const alvo = await marcobank.findOne({where:{discordid:target.id}})
        const user = await marcobank.findOne({where:{discordid:interaction.user.id}})
        if(user){
            if(!alvo){
                interaction.reply(`${target} não tem uma conta na MRCA Bank, peça para ele enviar /saldo para criar uma conta!`)
            }else if(coins>user.coin){
                interaction.reply(`<@${interaction.user.id}> é pobre e não tem dinheiro para transferir para ${target}`)
            }else{
                const interactionuser = interaction.user.id;
                const marcolog = client.channels.cache.get('1025923424612253728')
                await marcobank.update({coin: alvo.coin+coins},{where: {discordid:target.id}})
                await marcobank.update({coin: user.coin-coins},{where: {discordid:interaction.user.id}})
                interaction.reply(`<@${interaction.user.id}> transferiu ${coins} para ${target}`)
                marcolog.send(`<@${interactionuser}> transferiu ${coins} Coins para ${target}`)
                
            }
        }

    }else if(interaction.commandName =='gerar'){
        const key = MakeKey(16)
        const marcodm = client.users.cache.get('795407741534863390');
        await marcokey.create({
            fatkey:key,
            valid: 'valid'
        })
        interaction.reply({content:'Key gerada e enviada na DM com sucesso!', ephemeral:true})
        let embedkey = new EmbedBuilder().setAuthor({name:'Divirta-se!'})
        .setImage(giftimage)
        .setColor('#C1B2A4')
        .setFields({
            name:'Uma key de `10` MRCA foi gerada', value:'Faça bom proveito'
        },
        {name:'FatKey:', value:`\`${key}\``})
        .setFooter({text:'PABLO INDUSTRIES©',iconURL:'https://media.discordapp.net/attachments/854828737891008523/1025992196450701343/unknown.png?width=473&height=473'})
        try {
            interaction.user.send({embeds:[embedkey]})
            console.log(`KEY GERADA POR ${interaction.user.tag}`)
        } catch (error) {
            console.error(error)
        }
        
    }else if(interaction.commandName =='resgatar'){
        let key = interaction.options.getString('key');
        var verifykey = await marcokey.findOne({where: {fatkey:key, valid:'valid'}})
        const user = await marcobank.findOne({where:{discordid:interaction.user.id}})
        var timestamp = new Date().getTime();
        if(verifykey){
            const marcolog = await client.channels.cache.get('1025923424612253728')
            marcolog.send(`<@${interaction.user.id}> resgatou \`10\` Coins`)
            marcobank.update({coin: user.coin+10},{where:{discordid:interaction.user.id}})
            marcokey.update({valid:`Usado por ${interaction.user.tag} de ID ${interaction.user.id}`},{where:{fatkey:key}})
            interaction.reply('Parabéns!!, você acaba de receber `10` Coins na sua carteira')
        }else{
            interaction.reply('Chave não encontrada')
        }
    }else if(interaction.commandName =='sellmenu'){
        let row = new ActionRowBuilder()
        .addComponents(
            new SelectMenuBuilder()
            .setCustomId('menu')
            .setPlaceholder('Selecione uma opção')
            .addOptions(
                {
                    label: 'Comprar MarCoins',
                    description: '1 MarCoin = 0,25 centavos de real',
                    value: 'comprar_coin',
                    emoji: '💰'
                },
                {
                    label: 'Abrir Ticket',
                    description: 'Fale com um moderador',
                    value: 'ticket',
                    emoji: '🎫'
                }
            )
        )
        let embed = new EmbedBuilder()
        .setTitle('Olá! Eu sou a Skye')
        .setDescription('Vou te ajudar a trazer a discórdia para mais perto ^^')
        .setImage('https://noticias.maisesports.com.br/wp-content/uploads/2021/12/Gragas-Noel-800x472.jpg')
        .setFields({
            name: 'Você pode ser atendido por aqui mais rapidamente',
            value:'Sem complicações!'
        },{
            name: 'Compre saldo e adquira nossos serviços e produtos',
            value:'Você também pode apostar se quiser 😏😏'
        })
        .setColor('Green')
        .setThumbnail('https://overplay.com.br/wp-content/uploads/2022/01/skye-overplay.jpg')
        .setFooter({text:'Skye, the bot', iconURL:'https://overplay.com.br/wp-content/uploads/2022/01/skye-overplay.jpg'})
        interaction.channel.send({embeds: [embed], components:[row]})
    } 

    
});
client.on('interactionCreate', async interaction =>{
    if(!interaction.isSelectMenu()) return;
    if(interaction.values == 'ticket'){
        var channel = interaction.guild.channels.cache.find(channel=>channel.name ==`ticket-${interaction.user.id}`);
        if(channel){
            interaction.reply({content:`Seu ticket já está aberto em ${channel}`, ephemeral: true})
        }else{interaction.guild.channels.create({name:`Ticket ${interaction.user.id}`, permissionOverwrites:[{
            id: interaction.guild.roles.everyone,
            deny: ["ViewChannel"]
        },{
            id: interaction.user.id,
            allow:["ReadMessageHistory", "SendMessages", "ViewChannel"]
        }]}).then(async ticket =>{
            interaction.reply({content:`Ticket criado em ${ticket}`, ephemeral: true})
            let embedticket = new EmbedBuilder()
            .setTitle(`Olá ${interaction.user.username}`)
            .setFields({
                name:'Já já um dos nossos moderadores te responderá',
                value:'Seja paciente...'
            })
            .setImage('https://noticias.maisesports.com.br/wp-content/uploads/2021/12/Gragas-Noel-800x472.jpg')
            .setFooter({text:'Tia Skye', iconURL:'https://overplay.com.br/wp-content/uploads/2022/01/skye-overplay.jpg'})
            .setTimestamp()
            let closeticket = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('closeticket').setLabel('FECHAR TICKET').setEmoji('❎').setStyle(ButtonStyle.Danger)
            );
            ticket.send({embeds:[embedticket], components:[closeticket]})
        })}
        
    }else if(interaction.values == 'comprar_coin'){
        let channel = interaction.guild.channels.cache.find(channel=>channel.name ==`coin-${interaction.user.id}`);
        if(channel){
            interaction.reply({content:`Já tem uma compra sua aberta em ${channel}`, ephemeral: true})
        }else{interaction.guild.channels.create({name:`coin ${interaction.user.id}`, permissionOverwrites:[{
            id: interaction.guild.roles.everyone,
            deny: ["ViewChannel"]
        },{
            id: interaction.user.id,
            allow:["ReadMessageHistory", "SendMessages", "ViewChannel"]
        }]}).then(async compra =>{
            interaction.reply({content:`Compra aberta em ${compra}`, ephemeral: true})
            let embedcompra = new EmbedBuilder()
            .setTitle(`Olá ${interaction.user.username}`)
            .setDescription('O coin custa R$0,25 centavos')
            .setFields({
                name:'Quantos MRCoin você deseja?',
                value:'Digite o valor bruto ex: 10  15  20'
            })
            .setImage('https://lol-skin.weblog.vc/img/wallpaper/tiles/Gragas_4.jpg?1663674324')
            .setFooter({text:'Tia Skye', iconURL:'https://overplay.com.br/wp-content/uploads/2022/01/skye-overplay.jpg'})
            .setTimestamp()
            let closecompra = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('closecompra').setLabel('FINALIZAR COMPRA').setEmoji('❎').setStyle(ButtonStyle.Danger)
            );
           compra.send({embeds:[embedcompra], components:[closecompra]});
           compra.send("Por favor insira seu email\n**ATENÇÃO**\n``É PARA SEU EMAIL QUE SERÁ ENVIADO O COMPROVANTE! CASO ALGO DÊ ERRADO VOCÊ PRECISARÁ DELE.``")
           var email = '';
           var valor = '';
           await compra.awaitMessages({filter: (m)=> m.author.id === interaction.user.id, max:1}).then((message)=>{
            console.log('Mensagem recebida')
            console.log(message.at[0])
           })
           compra.send(`Seu email é ${email}, Agora digite o valor que você deseja comprar`)
           await compra.awaitMessages({filter: (m)=> m.author.id === interaction.user.id, max:1}).then((message)=>{
            console.log('Mensagem recebida')
            valor = message.first().content;
           })
           compra.send(`O valor desejado é ${valor}`)
        })}
        
    }
});
client.on('interactionCreate',async interaction=>{
    if(!interaction.isButton) return;
    if(interaction.customId == 'closeticket'){
        interaction.channel.send('Seu ticket será finalizado em 3 segundos...')
        setTimeout(()=>{
            interaction.channel.delete()
        }, 3000)
    }else if(interaction.customId == 'closecompra'){
        interaction.channel.send('Sua compra será finalizado em 3 segundos...')
        setTimeout(()=>{
            interaction.channel.delete()
        }, 3000)
    }
});



client.login(token);