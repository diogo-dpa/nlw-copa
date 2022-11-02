import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	const user = await prisma.user.create({
		data: {
			name: "Jonh Doe",
			email: "johndoe3@gmail.com",
			avatarUrl: "https://github.com/diogo-dpa.png",
		},
	});

	const pool = await prisma.pool.create({
		data: {
			title: "Example Pool",
			code: "BOL111",
			ownerId: user.id,

			// possibilidade de incluir um participante ao incluir o pool
			participants: {
				create: {
					// cria um registro
					userId: user.id,
				},
			},
		},
	});

	await prisma.game.create({
		data: {
			date: "2022-11-02T12:00:00.201Z",
			firstTeamCountryCode: "DE",
			secondTeamCountryCode: "BR",
		},
	});

	await prisma.game.create({
		data: {
			date: "2022-11-03T12:00:00.201Z",
			firstTeamCountryCode: "BR",
			secondTeamCountryCode: "AR",

			guesses: {
				create: {
					// cria um palpite
					firstTeamPoints: 2,
					secondTeamPoints: 1,
					// a associação com o game já está sendo feita, falta os participantes

					participant: {
						connect: {
							userId_poolId: {
								userId: user.id,
								poolId: pool.id,
							},
						},
					},
				},
			},
		},
	});
}

main();
