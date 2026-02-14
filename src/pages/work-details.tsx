import React from "react";
import {
  Card,
  CardBody,
  Button,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useHistory, useParams } from "react-router-dom";
import { Layout } from "../components/layout";
import { useClients } from "../hooks/use-clients";
import { formatCurrency } from "../utils/format";
import { useWorks } from "../hooks/useWork";
import { formatDate } from "../utils/date";
import NotFound from "../components/NotFound";
import Loading from "../components/Loading";

interface RouteParams {
  id: string;
}

export const WorkDetails: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const history = useHistory();

  const { getClient } = useClients();
  const { getWork, deleteWork, loading } = useWorks();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const work = getWork(id);
  console.log("WORK:", work);
  const client = work ? getClient(work.clientId) : undefined;

  const downloadFile = (url: string, filename?: string) => {
    const cleanName = filename?.replace(/\.[^/.]+$/, "");

    const downloadUrl = url.replace(
      "/upload/",
      `/upload/fl_attachment${cleanName ? `:${cleanName}` : ""}/`
    );

    window.open(downloadUrl, "_blank");
  };

  if (loading) {
    return (
      <Loading />
    );
  }

  if (!work) {
    return (
      <NotFound title="Trabajo no encontrado" message="El trabajo que buscas no existe o fue eliminado"/>
    );
  }

  const handleEdit = () => {
    history.push(`/work/edit/${id}`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteWork(id);
      history.push("/dashboard");
    } catch (error) {
      console.error("Error deleting work:", error);
      setIsDeleting(false);
    }
  };

  const downloadPdf = () => {
    if (!work.budget.pdfUrl) return;

    const downloadUrl = work.budget.pdfUrl.replace(
      "/upload/",
      "/upload/fl_attachment/"
    );

    window.open(downloadUrl, "_blank");
  };

  return (
    <Layout title="Detalles del Trabajo">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardBody>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">
                    {client?.name || "Cliente desconocido"}
                  </h2>
                  <p className="text-default-500">
                    {client?.company || "Cliente particular"}
                  </p>
                </div>
                <Chip color="primary" variant="flat">
                  {formatDate(work.date)}
                </Chip>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {client?.phone && (
                  <div>
                    <h3 className="text-small text-default-500 mb-1">
                      Teléfono
                    </h3>
                    <p className="flex items-center gap-2">
                      <Icon icon="lucide:phone" />
                      <a
                        href={`tel:${client.phone}`}
                        className="text-primary hover:underline"
                      >
                        {client.phone}
                      </a>
                    </p>
                  </div>
                )}

                {client?.address && (
                  <div>
                    <h3 className="text-small text-default-500 mb-1">
                      Dirección
                    </h3>
                    <p className="flex items-center gap-2">
                      <Icon icon="lucide:map-pin" />
                      {client.address}
                    </p>
                  </div>
                )}

                <div className="md:col-span-2">
                  <h3 className="text-small text-default-500 mb-1">
                    Descripción del trabajo
                  </h3>
                  <p className="bg-default-50 p-3 rounded-md">
                    {work.workDescription}
                  </p>
                </div>

                <div>
                  <h3 className="text-small text-default-500 mb-1">
                    Presupuesto
                  </h3>
                  <p className="text-xl font-semibold text-success">
                    {formatCurrency(work.budget.amount)}
                  </p>
                </div>

                {work.budget?.pdfUrl && (
                  <div className="flex gap-2 items-center">
                    <Button
                      variant="flat"
                      color="primary"
                      startContent={<Icon icon="lucide:file-text" />}
                      onPress={downloadPdf}
                    >
                      Descargar PDF
                    </Button>

                    <Button
                      variant="light"
                      onPress={() => window.open(work.budget.pdfUrl, "_blank")}
                    >
                      Ver
                    </Button>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>

          <div className="flex justify-end gap-2">
            <Button
              variant="flat"
              color="danger"
              startContent={<Icon icon="lucide:trash-2" />}
              onPress={onOpen}
            >
              Eliminar
            </Button>
            <Button
              color="primary"
              startContent={<Icon icon="lucide:edit" />}
              onPress={handleEdit}
            >
              Editar
            </Button>
          </div>
        </div>

        <div>
          {work.imageUrl ? (
            <Card>
              <CardBody>
                <h3 className="text-medium font-semibold mb-3">
                  Foto del trabajo
                </h3>

                <img
                  src={work.imageUrl}
                  alt="Foto del trabajo"
                  className="w-full rounded-lg object-cover mb-3"
                />

                <Button
                  variant="flat"
                  color="primary"
                  startContent={<Icon icon="lucide:download" />}
                  onPress={() =>
                    downloadFile(
                      work.imageUrl!,
                      work.imageName
                    )
                  }
                >
                  Descargar imagen
                </Button>

              </CardBody>
            </Card>
          ) : (
            <Card>
              <CardBody className="py-8 text-center">
                <Icon
                  icon="lucide:image"
                  className="mx-auto text-default-300"
                  width={48}
                  height={48}
                />
                <p className="text-default-500 mt-4">
                  No hay foto disponible
                </p>
                <Button
                  variant="flat"
                  color="primary"
                  className="mt-4"
                  onPress={handleEdit}
                  startContent={<Icon icon="lucide:plus" />}
                >
                  Agregar foto
                </Button>
              </CardBody>
            </Card>
          )}
        </div>
      </div>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Confirmar eliminación</ModalHeader>
              <ModalBody>
                <p>¿Estás seguro de eliminar este trabajo?</p>
                <p className="text-default-500">
                  Esta acción no se puede deshacer.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  color="danger"
                  isLoading={isDeleting}
                  onPress={handleDelete}
                >
                  Eliminar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Layout>
  );
};