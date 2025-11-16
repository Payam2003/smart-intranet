import { auth } from "../FireBaseInit";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import {
	Button,
	Text,
	VStack,
	Link,
	GridItem,
	Center,
	SimpleGrid,
} from "@chakra-ui/react";
import { RiGoogleFill } from "react-icons/ri";
import { useToasterCreate } from "../App";
import { redirectToGoogleOAuth } from "../App";

auth.languageCode = "it";

function MyLogin() {
	const toaster = useToasterCreate();

	const signIn = () => redirectToGoogleOAuth();
	try {
		console.log("Autenticazione Google ok");
	} catch (error) {
		toaster({
			title: "Errore di accesso",
			description: error.message,
			type: "error",
		});
	}

	return (
		<VStack>
			<SimpleGrid minH="100%" mt="10rem" templateRows="repeat(2, 1fr)">
				<GridItem>
					<Center>
						<Button
							rounded="full"
							minH="5rem"
							minW="8rem"
							onClick={signIn}
							size="lg"
							colorPalette="blue"
							mt={4}
						>
							<RiGoogleFill />{" "}
							<Text textStyle="xl">Login con Google</Text>
						</Button>
					</Center>
				</GridItem>
				<GridItem>
					<Text
						fontSize="s"
						fontWeight="light"
						mt={10}
						textAlign={"center"}
					>
						Continuando, dichiari di accettare i nostri{" "}
						<Link
							variant={"underline"}
							href="/terms-of-service"
							colorPalette="blue"
							target="_blank"
						>
							Termini di Servizio
						</Link>{" "}
						e le{" "}
						<Link
							variant={"underline"}
							href="/privacy"
							colorPalette="blue"
							target="_blank"
						>
							Normative sulla Privacy
						</Link>
					</Text>
				</GridItem>
			</SimpleGrid>
		</VStack>
	);
}

export default MyLogin;
