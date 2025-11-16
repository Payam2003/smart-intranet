import { useState, useEffect, use } from "react";
import { useMyContext } from "../App";
import { useColorModeValue } from "@/components/ui/color-mode";
import {
	Center,
	Input,
	SimpleGrid,
	Button,
	Text,
	GridItem,
	Box,
} from "@chakra-ui/react";
import { useToasterCreate } from "../App";
import { httpsCallable } from "firebase/functions";
import { functions } from "../FireBaseInit";

const checkPostazioni = httpsCallable(functions, "checkPostazioni");
const prenotaPostazione = httpsCallable(functions, "prenotaPostazione");

function Postazioni() {
	const toaster = useToasterCreate();
	const [startDate, setStartDate] = useState("");
	const [disponibili, setDisponibili] = useState([]);
	const { user } = useMyContext();
	const today = new Date().toISOString().split("T")[0];

	const bg = useColorModeValue("gray.100", "gray.800");
	const color = useColorModeValue("dark", "white");

	const handleDateChange = (e) => {
		setStartDate(e.target.value);
		setDisponibili([]);
	};

	async function verificaPostazioni(e) {
		e.preventDefault();
		try {
			console.log("DATE", startDate);
			const result = await checkPostazioni({
				date: startDate,
				id: user.uid,
			});
			const disponibili = result.data?.data || [];
			setDisponibili(disponibili);
		} catch (error) {
			toaster({
				title: "Errore in fase di recupero dati",
				description: error.message,
				type: "error",
			});
		}
	}

	async function bookPostazione(index) {
		try {
			const result = await prenotaPostazione({
				id: user.uid,
				index: index,
				date: startDate,
			});
			toaster({
				title: "Prenotazione riuscita",
				description: `Evento creato con ID: ${result.data?.event}`,
				type: "success",
			});
		} catch (error) {
			toaster({
				title: "Errore durante la prenotazione",
				description: error.message,
				type: "error",
			});
		}
	}

	return (
		<form onSubmit={verificaPostazioni}>
			<SimpleGrid m="2rem">
				<GridItem>
					<Center>
						<Input
							w="20rem"
							minH="3.5rem"
							textStyle={"md"}
							type="date"
							value={startDate}
							onChange={handleDateChange}
							min={today}
						/>
					</Center>
				</GridItem>
				<GridItem mt={5}>
					<Center>
						<Button
							type="submit"
							rounded="full"
							minH="4.5rem"
							w="15rem"
							size="xl"
							colorPalette="blue"
							mt={4}
							disabled={!startDate}
						>
							<Text textStyle="xl">Verifica disponibilità</Text>
						</Button>
					</Center>
				</GridItem>
				{disponibili.length > 0 && (
					<GridItem>
						<Center>
							<GridItem mt={5}>
								{disponibili
									.filter((p) => p.disponibile)
									.map((p) => (
										<Box
											key={p.calendarId}
											bg={bg}
											borderWidth={1}
											borderColor="border.disabled"
											p={3}
											mt={10}
											rounded="md"
										>
											<Text color={color}>
												<b>{p.label}</b>: Disponibile
											</Text>
											<Button
												onClick={() =>
													bookPostazione(p.calendarId)
												}
												rounded="full"
												minH="1.5rem"
												w="12rem"
												size="xl"
												colorPalette="blue"
												mt={4}
											>
												<Text textStyle="l">
													Prenota
												</Text>
											</Button>
										</Box>
									))}

								{disponibili.filter((p) => p.disponibile)
									.length === 0 && (
									<Text color="gray.600" fontStyle="italic">
										Nessuna postazione disponibile per
										questa data.
									</Text>
								)}
							</GridItem>
						</Center>
					</GridItem>
				)}
			</SimpleGrid>
		</form>
	);
}

export default Postazioni;
