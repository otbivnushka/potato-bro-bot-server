import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const adapter = new PrismaPg({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: false,
});

const prisma = new PrismaClient({ adapter });

async function down() {
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE
      messages,
      chats,
      user_settings,
      characters,
      users
    RESTART IDENTITY CASCADE;
  `);
}

async function up() {
  const password = await argon2.hash('123456');

  const user = await prisma.user.create({
    data: {
      username: 'user',
      password_hash: password,
    },
  });

  const pin = await prisma.character.create({
    data: {
      name: 'Pin',
      prompt: 'You are a cute funny assistant who speaks casually.',
    },
  });

  const robot = await prisma.character.create({
    data: {
      name: 'Robot',
      prompt: 'You are a strict logical AI assistant.',
    },
  });

  await prisma.userSettings.create({
    data: {
      user_id: user.user_id,
      theme: 'dark',
      character_id: pin.id,
    },
  });

  const chat = await prisma.chat.create({
    data: {
      title: 'First chat',
      user_id: user.user_id,
    },
  });

  await prisma.message.createMany({
    data: [
      {
        chat_id: chat.chat_id,
        role: 'user',
        content: 'Привет!',
      },
      {
        chat_id: chat.chat_id,
        role: 'bot',
        content: 'Привет! Я твой бот',
      },
      {
        chat_id: chat.chat_id,
        role: 'user',
        content: 'Что ты умеешь?',
      },
      {
        chat_id: chat.chat_id,
        role: 'bot',
        content: 'Я умею отвечать, как ChatGPT-lite',
      },
    ],
  });

  const chat2 = await prisma.chat.create({
    data: {
      title: 'Second chat',
      user_id: user.user_id,
    },
  });

  await prisma.message.createMany({
    data: [
      {
        chat_id: chat2.chat_id,
        role: 'user',
        content: 'Расскажи про TypeScript',
      },
      {
        chat_id: chat2.chat_id,
        role: 'bot',
        content: 'TypeScript — это надстройка над JavaScript...',
      },
    ],
  });

  console.log('Seed completed');
}

async function main() {
  await down();
  await up();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
