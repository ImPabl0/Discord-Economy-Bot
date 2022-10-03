const Sequelize = require('sequelize');
const {token, giftimage, allowedusers, database, database_ip, database_pass, database_user, database_dialect} = require('./config.json');
const Discord = require('discord.js')
const {Client, GatewayIntentBits, messageLink, MessageType, EmbedBuilder,ActivityType} = require('discord.js');

const client = new Discord.Client({intents:[GatewayIntentBits.Guilds]});
const sequelize = new Sequelize(database, database_user, database_pass,{
    host:database_ip,
    dialect:database_dialect,
    logging:false
})
const marcobank = sequelize.define('contas',{
    discordid: Sequelize.TEXT,
    coin:{
        type: Sequelize.FLOAT,
        default: 5,
        allowNull: false,
    },
},{dialect:database_dialect});
const marcokey = sequelize.define('keys',{
    fatkey: Sequelize.TEXT,
    valid: Sequelize.TEXT,
    
    
},{dialect:database_dialect});
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
   if (interaction.commandName == 'saldo'){
            const saldo = await marcobank.findOne({where:{discordid:interaction.user.id}})
            if (saldo){
                interaction.reply(`<@${interaction.user.id}> tem ${saldo.coin} Coins`)
                setTimeout(()=>interaction.deleteReply(),2000)
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

    }else if(interaction.commandName =='gerar'&&interaction.user.id == allowedusers){
        const key = MakeKey(16)
        const marcodm = client.users.cache.get(allowedusers[0]);
        await marcokey.create({
            fatkey:key,
            valid: 'valid'
        })
        interaction.reply({content:'Key gerada e enviada na DM com sucesso!', ephemeral:true})
        let embedkey = new EmbedBuilder().setAuthor({name:'Divirta-se!'})
        .setImage(giftimage)
        .setColor('#C1B2A4')
        .setFields({
            name:'Uma key de `10` Coins foi gerada', value:'Faça bom proveito'
        },
        {name:'FatKey:', value:`\`${key}\``})
        .setFooter({text:'PABLO INDUSTRIES©',iconURL:'https://media.discordapp.net/attachments/854828737891008523/1025992196450701343/unknown.png?width=473&height=473'})
        try {
            interaction.user.send({embeds:[embedkey]})
            console.log(`KEY GERADA POR ${interaction.user.tag}`)
        } catch (error) {
            console.error(error)
        }
        
    } else{interaction.reply({content:'Você não tem permissão para usar este comando.', ephemeral:true})}
        if(interaction.commandName =='resgatar'){
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
    }
});


client.login(token);