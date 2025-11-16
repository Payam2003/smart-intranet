import { useEffect } from "react";
import {
	Outlet,
	useNavigate,
	useLocation,
	useMatches,
	NavLink,
} from "react-router";
import { useMyContext } from "./App";
import { auth } from "./FireBaseInit";

import { ColorModeButton } from "@/components/ui/color-mode";
import {
	Avatar,
	AvatarFallback,
	Icon,
	Container,
	Flex,
	CloseButton,
	Drawer,
	HStack,
	Portal,
	SimpleGrid,
	GridItem,
	Center,
	Heading,
	VStack,
	Button,
	Text,
	Box,
	Code,
} from "@chakra-ui/react";

import {
	RiAlignJustify,
	RiArrowLeftLine,
	RiLogoutBoxLine,
} from "react-icons/ri";

export const AppFrame = () => {
	const navigate = useNavigate();
	const { user, isLoading } = useMyContext(); // Add isLoading to your context
	const { pathname } = useLocation();
	const matches = useMatches();
	const currentLabel = matches
		.reverse() // cerca prima nei nodi più annidati
		.find((match) => match.handle?.title)?.handle.title;

	useEffect(() => {
		if (isLoading) return; // aspetta che il caricamento sia completo
		if (!user && !isLoading) {
			navigate("/login");
		} else if (user && (pathname === "/login" || pathname === "/")) {
			navigate("/main");
		}
	}, [user, isLoading, pathname, navigate]);

	if (isLoading) {
		return (
			<Center minH="100vh">
				<Text fontSize="xl">Caricamento...</Text>
			</Center>
		);
	}

	return (
		<>
			<SimpleGrid p={2} columns="4" alignItems={"center"}>
				<GridItem>
					{pathname == "/login" ? (
						<div />
					) : pathname == "/main" ? (
						<Hamburger></Hamburger>
					) : (
						<BackHome></BackHome>
					)}
				</GridItem>
				<GridItem colSpan={2}>
					<Center>
						<Heading>{currentLabel}</Heading>
					</Center>
				</GridItem>
				<GridItem>
					<Flex justify="flex-end">
						{user && (
							<Avatar.Root>
								<AvatarFallback name={user?.name} />
								<Avatar.Image
									src={user?.picture}
									alt="User Avatar"
								/>
							</Avatar.Root>
						)}
						<ColorModeButton />
					</Flex>
				</GridItem>
			</SimpleGrid>
			<Container>
				<Outlet></Outlet>
			</Container>
		</>
	);
};

const BackHome = () => {
	const navigate = useNavigate();

	return (
		<Icon size="lg" color="gray.500" cursor="pointer">
			<RiArrowLeftLine onClick={() => navigate("/main")} />
		</Icon>
	);
};

const Hamburger = () => {
	const navigate = useNavigate();
	const { _, setUser } = useMyContext();

	const signOut = () => {
		setUser(null);
		localStorage.removeItem("user"); // se salvi il profilo qui
		navigate("/login");
	};

	return (
		<HStack wrap="wrap">
			<Drawer.Root placement="start" size="sm">
				<Drawer.Trigger asChild>
					<Icon size="xl" color="gray.500" cursor="pointer">
						<RiAlignJustify />
					</Icon>
				</Drawer.Trigger>
				<Portal>
					<Drawer.Backdrop />
					<Drawer.Positioner>
						<Drawer.Content>
							<Drawer.Header>
								<Drawer.Title>
									<Text textAlign="center" textStyle="xl">
										Opzioni
									</Text>
								</Drawer.Title>
							</Drawer.Header>
							<Drawer.Body
								display="flex"
								flexDirection="column"
								h="100%"
							>
								<VStack>
									<Button
										w="100%"
										minH="4.5rem"
										mb="4rem"
										mt="4rem"
										onClick={() => navigate("/preferences")}
										title="vai a preferenze utente"
										colorPalette="blue"
										rounded="full"
									>
										<Text textStyle="xl">
											Preferenze utente
										</Text>
									</Button>
									<Box
										w="100%"
										h="0.1rem"
										bg="black"
										_dark={{ bg: "gray.200" }}
									/>
									<Button
										minW="100%"
										minH="4.5rem"
										mb="7rem"
										mt="4rem"
										onClick={signOut}
										title="esegui il logout"
										colorPalette="gray"
										variant="surface"
										rounded="full"
									>
										<RiLogoutBoxLine />
										<Text textStyle="xl">Logout</Text>
									</Button>
								</VStack>
								<Drawer.Footer
									placement="bottom"
									mt="auto"
									mb="5rem"
									justifyContent="center"
								>
									<Code>build numero:.....</Code>
								</Drawer.Footer>
							</Drawer.Body>
							<Drawer.CloseTrigger asChild>
								<CloseButton size="xl" />
							</Drawer.CloseTrigger>
						</Drawer.Content>
					</Drawer.Positioner>
				</Portal>
			</Drawer.Root>
		</HStack>
	);
};
