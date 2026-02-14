import { Layout } from './layout';
import {
    Card,
    CardBody,
} from "@heroui/react";

const Loading = () => {
    return (
        <Layout title="Cargando...">
            <Card>
                <CardBody className="py-8 text-center">
                    <div className="flex justify-center py-0">
                        <div className="animate-spin h-10 w-10 border-2 border-primary border-t-transparent rounded-full" />
                    </div>
                    <p className="text-default-500 mt-4">
                        Cargando detalles...
                    </p>
                </CardBody>
            </Card>
        </Layout>
    );
}

export default Loading