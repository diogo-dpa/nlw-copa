import Image from "next/image";
import appPreviewImage from "../assets/app-nlw-copa-preview.png";
import logo from "../assets/logo.svg";
import usersAvatarExampleImg from "../assets/users-avatar-example.png";
import iconCheckImg from "../assets/icon-check.svg";
import { api } from "../lib/axios";
import { FormEvent, useRef, useState } from "react";
import { GetStaticProps } from "next";

interface HomeProps {
	poolCount: number;
	guessCount: number;
	userCount: number;
}

export default function Home(props: HomeProps) {
	const poolRef = useRef<HTMLInputElement>(null);

	async function createPool(event: FormEvent) {
		event.preventDefault();

		if (poolRef.current) {
			try {
				const response = await api.post("/pools", {
					title: poolRef.current?.value,
				});
				const { code } = response.data;
				await navigator.clipboard.writeText(code);
				poolRef.current.value = "";
				alert(
					"Bolão criado com sucesso. O código foi copiado para a área de transferência."
				);
			} catch (err) {
				console.log(err);
				alert("Falha ao criar um bolão. Tente novamente.");
			}
		}
	}

	return (
		<div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 items-center gap-28">
			<main>
				<Image src={logo} alt="NLW Copa" />
				<h1 className="mt-14 text-white text-5xl font-bold leading-tight">
					Crie seu próprio bolão da copa e compartilhe entre amigos!
				</h1>

				<div className="mt-10 flex items-center gap-2">
					<Image src={usersAvatarExampleImg} alt="" />
					<strong className="text-gray-100 text-xl">
						<span className="text-ignite-500">+{props.userCount}</span> pessoas
						já estão usando
					</strong>
				</div>

				<form onSubmit={createPool} className="mt-10 flex gap-2">
					<input
						className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
						type="text"
						required
						placeholder="Qual nome do seu bolão?"
						ref={poolRef}
					/>
					<button
						className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-600"
						type="submit"
					>
						Criar meu bolão
					</button>
				</form>

				<p className="mt-4 text-sm text-gray-300 leading-relaxed">
					Após criar sue bolão, você receberá um código único que poderá usar
					para convidar outras pessoas
				</p>

				<div className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100">
					<div className="flex items-center gap-6">
						<Image src={iconCheckImg} alt="" />
						<div className="flex flex-col">
							<span className="font-bold text-2xl">+{props.poolCount}</span>
							<span>Bolões criados</span>
						</div>
					</div>

					<div className="w-px h-14 bg-gray-600" />

					<div className="flex items-center gap-6">
						<Image src={iconCheckImg} alt="" />
						<div className="flex flex-col">
							<span className="font-bold text-2xl">+{props.guessCount}</span>
							<span>Palpites enviados</span>
						</div>
					</div>
				</div>
			</main>
			<Image
				src={appPreviewImage}
				alt="Dois celulares exibindo uma prévia da aplicação móvel do NLW Copa"
			/>
		</div>
	);
}

export const getStaticProps: GetStaticProps = async () => {
	const [poolCountResponse, guessCountResponse, usersCountResponse] =
		await Promise.all([
			api.get("pools/count"),
			api.get("guesses/count"),
			api.get("users/count"),
		]);

	return {
		props: {
			poolCount: poolCountResponse.data.count,
			guessCount: guessCountResponse.data.count,
			userCount: usersCountResponse.data.count,
		},
		revalidate: 60,
	};
};
