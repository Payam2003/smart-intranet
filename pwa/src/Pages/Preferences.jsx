import { useEffect, useState, useMemo } from "react";
import { useMyContext } from "../App";
import {
	Avatar,
	Field,
	Fieldset,
	Text,
	VStack,
	Switch,
	SimpleGrid,
	GridItem,
	Button,
	Box,
} from "@chakra-ui/react";
import { useToasterCreate } from "../App";
import { httpsCallable } from "firebase/functions";
import { functions } from "../FireBaseInit";

const aggiornaNotifiche = httpsCallable(functions, "aggiornaNotifiche");
const getPreferenzeUtente = httpsCallable(functions, "getPreferenzeUtente");

function Preferences() {
	const { user } = useMyContext();
	const [serverPrefs, setServerPrefs] = useState({
		chiusure: false,
		compleanni: false,
		news: false,
	});
	const [localPrefs, setLocalPrefs] = useState({
		chiusure: false,
		compleanni: false,
		news: false,
	});
	const [isLoading, setIsLoading] = useState(true);
	const toaster = useToasterCreate();

	useEffect(() => {
		const fetchPreferenze = async () => {
			try {
				const result = await getPreferenzeUtente({ id: user.uid });
				const prefs = result.data || {};
				setServerPrefs(prefs);
				setLocalPrefs(prefs);
			} catch (error) {
				toaster({
					title: "Errore",
					description: "Impossibile caricare le preferenze.",
					type: "error",
				});
			} finally {
				setIsLoading(false);
			}
		};
		if (user?.uid) fetchPreferenze();
	}, [user?.uid]);

	// Controlla se ci sono modifiche locali rispetto ai dati server
	const hasChanges = useMemo(() => {
		return (
			serverPrefs.chiusure !== localPrefs.chiusure ||
			serverPrefs.compleanni !== localPrefs.compleanni ||
			serverPrefs.news !== localPrefs.news
		);
	}, [serverPrefs, localPrefs]);

	const handleSwitchChange = (type, value) => {
		setLocalPrefs((prev) => ({ ...prev, [type]: value }));
	};

	const handleSaveChanges = async () => {
		try {
			const result = await aggiornaNotifiche({
				id: user.uid,
				type: "all",
				value: localPrefs,
			});
			setServerPrefs(localPrefs);
			toaster({
				title: "Preferenze salvate",
				description: "Le tue impostazioni sono state aggiornate.",
				type: "success",
			});
		} catch (err) {
			toaster({
				title: "Errore durante il salvataggio",
				description: err.message,
				type: "error",
			});
		}
	};

	return (
		<VStack>
			{/* --- Sezione Account --- */}
			<Fieldset.Root size="lg" maxW="md">
				<Fieldset.Content>
					<Field.Root>
						<Field.Label mt={10}>
							<Text textStyle="3xl">Account</Text>
						</Field.Label>
						<Field.Label mt={15}>
							<Avatar.Root size="2xl">
								<Avatar.Fallback name={user?.name} />
								<Avatar.Image src={user?.picture} />
							</Avatar.Root>
							<SimpleGrid ml={10} templateRows="repeat(2, 1fr)">
								<GridItem>
									<Text textStyle="md">{user?.name}</Text>
								</GridItem>
								<GridItem>
									<Text fontWeight="light">
										{user?.email}
									</Text>
								</GridItem>
								<GridItem>
									<Text fontWeight="light">
										{user?.phoneNumber}
									</Text>
								</GridItem>
							</SimpleGrid>
						</Field.Label>
					</Field.Root>
				</Fieldset.Content>
			</Fieldset.Root>

			{/* --- Sezione Notifiche --- */}
			<Fieldset.Root size="lg" maxW="md">
				<Fieldset.Content>
					<Field.Root>
						<Field.Label mt={30}>
							<Text textStyle="3xl">Notifiche</Text>
						</Field.Label>

						<SimpleGrid mt={1} columns={2}>
							{/* Chiusure */}
							<GridItem mt={5}>
								{!isLoading && (
									<Switch.Root
										id="s1"
										htmlFor="s1"
										colorPalette="green"
										size="lg"
										checked={localPrefs.chiusure}
										onChange={(e) =>
											handleSwitchChange(
												"chiusure",
												e.target.checked
											)
										}
									>
										<Switch.HiddenInput id="s1" />
										<Switch.Control />
										<Switch.Label />
									</Switch.Root>
								)}
							</GridItem>
							<GridItem mt={2}>
								<Text textStyle="xl" fontWeight="semibold">
									Chiusure del mese
								</Text>
								Ricordami di chiudere le giornate al termine di
								ogni mese
							</GridItem>

							{/* Compleanni */}
							<GridItem mt={2}>
								{!isLoading && (
									<Switch.Root
										id="s2"
										htmlFor="s2"
										colorPalette="green"
										size="lg"
										checked={localPrefs.compleanni}
										onChange={(e) =>
											handleSwitchChange(
												"compleanni",
												e.target.checked
											)
										}
									>
										<Switch.HiddenInput id="s2" />
										<Switch.Control />
										<Switch.Label />
									</Switch.Root>
								)}
							</GridItem>
							<GridItem mt={2}>
								<Text textStyle="xl" fontWeight="semibold">
									Compleanni
								</Text>
								Ricordami i compleanni dei colleghi
							</GridItem>

							{/* News */}
							<GridItem mt={2}>
								{!isLoading && (
									<Switch.Root
										id="s3"
										htmlFor="s3"
										colorPalette="green"
										size="lg"
										checked={localPrefs.news}
										onChange={(e) =>
											handleSwitchChange(
												"news",
												e.target.checked
											)
										}
									>
										<Switch.HiddenInput id="s3" />
										<Switch.Control />
										<Switch.Label />
									</Switch.Root>
								)}
							</GridItem>
							<GridItem mt={2}>
								<Text textStyle="xl" fontWeight="semibold">
									News aziendali
								</Text>
								Ricevi le notifiche dall'amministrazione,
								gestione del personale, ecc.
							</GridItem>
						</SimpleGrid>

						{hasChanges && (
							<Button
								rounded="full"
								minH="4.5rem"
								w="15rem"
								size="xl"
								colorPalette="blue"
								onClick={handleSaveChanges}
								mt={10}
							>
								<Text textStyle="xl">Salva Modifiche</Text>
							</Button>
						)}
					</Field.Root>
				</Fieldset.Content>
			</Fieldset.Root>
		</VStack>
	);
}

export default Preferences;
