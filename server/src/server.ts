import Fastify from "fastify";
import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";

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

	// A configuração de host é para funcionar no ambiente mobile
	await fastify.listen({ port: 3333, host: "0.0.0.0" });
}

bootstrap();
