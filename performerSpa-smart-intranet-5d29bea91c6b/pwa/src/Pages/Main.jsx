import { useMyContext } from "../App";
import {
	Button,
	VStack,
	Text,
	SimpleGrid,
	GridItem,
	Center,
} from "@chakra-ui/react";
import { useNavigate } from "react-router";

export const Main = () => {
	const { user } = useMyContext();
	const navigate = useNavigate();

	return (
		<VStack>
			<SimpleGrid minH="25rem" mt="3.13rem" templateRows="repeat(2, 1fr)">
				<Center>
					<GridItem>
						<Text textStyle="2xl">
							Benvenuto <b>{user?.displayName}</b>!
						</Text>
						<Text>Che cosa vuoi fare oggi?</Text>
					</GridItem>
				</Center>
				<Center>
					<GridItem>
						<Button
							rounded="full"
							minH="4.5rem"
							w="15rem"
							size="xl"
							colorPalette="blue"
							onClick={() => {
								navigate("/events");
							}}
						>
							<Text textStyle="xl">Prenota Postazione</Text>
						</Button>
					</GridItem>
				</Center>
				<Center>
					<GridItem>
						<Button
							rounded="full"
							minH="4.5rem"
							w="15rem"
							size="xl"
							colorPalette="blue"
							mt={2}
							onClick={() => {
								navigate("/QRcode");
							}}
							disabled
						>
							<Text textStyle="xl">Login con QR</Text>
						</Button>
					</GridItem>
				</Center>
			</SimpleGrid>
		</VStack>
	);
};
