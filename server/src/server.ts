import Fastify from "fastify";
import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import ShortUniqueID from "short-unique-id";

// para rodar o comando de seed: npx prisma db seed

const prisma = new PrismaClient({
	log: ["query"], //será gerado um log de todas as querys do banco de dados
});

async function bootstrap() {
	const fastify = Fastify({
		logger: true, // Logs para requisição e monitoramento
	});

	await fastify.register(cors, {
		origin: true, // permite qualquer aplicação a consumir a aplicação
	});

	// Primeira rota com fastify
	fastify.get("/pools/count", async () => {
		const count = await prisma.pool.count();

		return { count };
	});

	fastify.get("/users/count", async () => {
		const count = await prisma.user.count();

		return { count };
	});

	fastify.get("/guesses/count", async () => {
		const count = await prisma.guess.count();

		return { count };
	});

	// Criando um bolão
	fastify.post("/pools", async (request, reply) => {
		// Para validação
		const createPoolBody = z.object({
			title: z.string(),
		});

		const { title } = createPoolBody.parse(request.body);

		// Gerar código de 6 caracteres
		const generate = new ShortUniqueID({ length: 6 });

		const code = String(generate()).toUpperCase();

		await prisma.pool.create({
			data: {
				title,
				code,
			},
		});

		return reply.status(201).send({ code });
	});

	// A configuração de host é para funcionar no ambiente mobile
	await fastify.listen({ port: 3333, host: "0.0.0.0" });
}

bootstrap();
