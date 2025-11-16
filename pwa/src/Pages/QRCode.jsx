import { VStack, QrCode, Text } from "@chakra-ui/react";

function QRCode(){

    return (
        <VStack>
            <Text textStyle="xl">Entra da un altro dispositivo</Text>
            {/*Qrcode per il login da un altro device, con il relativo URL nel value*/}
            <QrCode.Root size="2xl" mt="100px" value="...">
                <QrCode.Frame>
                    <QrCode.Pattern />
                </QrCode.Frame>
            </QrCode.Root>
        </VStack>
    );
}

export default QRCode;