import { Layout } from './layout';
import {
    Card,
    CardBody,
    Button,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useHistory } from "react-router-dom";

interface NotFoundProps {
    title?: string;
    message?: string;
}

const NotFound = ({title, message}:NotFoundProps) => {

    const history = useHistory();

    return (
        <Layout title="Trabajo no encontrado" >
            <Card>
                <CardBody className="py-8 text-center">
                    <Icon
                        icon="lucide:alert-circle"
                        className="mx-auto text-danger"
                        width={48}
                        height={48}
                    />
                    <h2 className="text-xl font-semibold mt-4">
                        {title || "No encontrado"}
                    </h2>
                    <p className="text-default-500 mt-2">
                        {message || "El recurso que buscas no existe o fue eliminado"}
                    </p>
                    <Button
                        color="primary"
                        className="mt-6"
                        onPress={() => history.push("/dashboard")}
                    >
                        Volver al Dashboard
                    </Button>
                </CardBody>
            </Card>
        </Layout >
    )
}

export default NotFound