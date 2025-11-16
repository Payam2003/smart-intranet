import Stamping from "./Stamping";
import { VStack, Text, Table, SimpleGrid, Input } from "@chakra-ui/react";

function TimbratureOnlyRead({
	currentDate,
	giornata,
	totalHours,
	projectItems,
}) {
	return (
		<VStack>
			<SimpleGrid gap="2rem">
				<Text textStyle="xl" fontWeight="semibold">
					Giornat {currentDate}
				</Text>
				<Text textStyle="xl" fontWeight="semibold">
					Timbratura della giornata
				</Text>
				<Table.Root size="sm" variant="outline">
					<Table.Header>
						<Table.Row>
							<Table.ColumnHeader>
								Tipo timbratura
							</Table.ColumnHeader>
							<Table.ColumnHeader>Orario</Table.ColumnHeader>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{giornata.timbratureGiornata.map((item, index) => (
							<Table.Row key={index}>
								<Table.Cell>{item.tipo}</Table.Cell>
								<Table.Cell>{item.orario}</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
				</Table.Root>
				<Text textStyle="xl" fontWeight="semibold">
					Totale ore giornata: {totalHours}
				</Text>
				<Table.Root size="sm" variant="outline" showColumnBorder>
					<Table.ColumnGroup>
						<Table.Column htmlWidth="75%" />
						<Table.Column htmlWidth="25%" />
						<Table.Column />
					</Table.ColumnGroup>
					<Table.Header>
						<Table.Row>
							<Table.ColumnHeader>Progetti</Table.ColumnHeader>
							<Table.ColumnHeader textAlign="end">
								Ore svolte
							</Table.ColumnHeader>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{projectItems.map((item) => (
							<Table.Row key={item.id}>
								<Table.Cell>{item.name}</Table.Cell>
								<Table.Cell textAlign="end">
									<Input
										type="time"
										placeholder="HH:mm"
										value={item.hours}
										onChange={(e) =>
											handleProjectHoursChange(
												item.id,
												e.target.value
											)
										}
										size="sm"
										textAlign="end"
										min={0}
										max={24}
										readOnly
									/>
								</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
				</Table.Root>
			</SimpleGrid>
		</VStack>
	);
}
export default TimbratureOnlyRead;
