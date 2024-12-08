const { execSync } = require('child_process');

// Gerekli kütüphaneleri yükle
function installDependencies() {
    try {
        console.log('Gerekli kütüphaneler yükleniyor...');
        execSync('npm install discord.js @google/generative-ai', { stdio: 'inherit' });
        console.log('Kütüphaneler başarıyla yüklendi.');
    } catch (error) {
        console.error('Kütüphaneler yüklenirken bir hata oluştu:', error);
        process.exit(1); // Eğer kütüphaneler yüklenmezse, uygulamayı sonlandır.
    }
}

// Kütüphaneleri yükle
installDependencies();

// Gerekli kütüphaneleri yükledikten sonra asıl kodu çalıştır
const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const { GoogleGenerativeAI } = require("@google/generative-ai");

// API anahtarınızı doğrudan kod içine entegre edin
const genAI = new GoogleGenerativeAI('YOUR_GOOGLE_API_KEY'); // Buraya Google API anahtarınızı ekleyin
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', () => {
    console.log('Bot hazır!');
    client.user.setActivity('GeminiAI | ismetemir_.', { type: ActivityType.Watching }); // "İzliyor..." durumu ayarlandı
});

client.on('messageCreate', async message => {
    // Botun kendisinden gelen mesajları yok sayın
    if (message.author.bot) return;

    const userMessage = message.content.trim();
    if (userMessage) {
        try {
            // "Yazıyor..." mesajını gönder
            const typingMessage = await message.channel.send("Yazıyor...");

            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            const result = await model.generateContent([userMessage]);

            // "Yazıyor..." mesajını sil ve gerçek yanıtı gönder
            await typingMessage.delete();
            await message.channel.send(`<@${message.author.id}> ${result.response.text()}`);
        } catch (error) {
            console.error("Error generating content:", error);
            await message.channel.send("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
        }
    } else {
        await message.channel.send('Lütfen sohbet için bir mesaj girin.');
    }
});

// Discord tokenınızı doğrudan kod içine entegre edin
client.login('YOUR_DISCORD_TOKEN'); // Buraya Discord bot tokenınızı ekleyin
