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
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  useDisclosure,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useHistory, useParams } from "react-router-dom";
import { Layout } from "../components/layout";
import { useClients } from "../hooks/use-clients";
import { formatCurrency } from "../utils/format";
import { useWorks } from "../hooks/useWork";
import Loading from "../components/Loading";
import NotFound from "../components/NotFound";

interface RouteParams {
  id: string;
}

export const ClientDetails: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const history = useHistory();

  const { getClient, deleteClient, loading } = useClients();
  const { getClientWorks } = useWorks();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const client = getClient(id);
  const clientWorks = React.useMemo(
    () => (client ? getClientWorks(id) : []),
    [client, id, getClientWorks]
  );

    if (loading) {
    return (
      <Loading />
    );
  }

  if (!client) {
    return (
      <NotFound title="Cliente no encontrado" message="El cliente que buscas no existe o fue eliminado"/>
    );
  }

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteClient(id);
      history.push("/dashboard");
    } catch (err) {
      console.error(err);
      setIsDeleting(false);
    }
  };

  return (
    <Layout title="Detalles del Cliente">
      <div className="gap-6">
        {/* INFO CLIENTE */}
        <Card>
          <CardBody>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold">{client.name}</h2>
                <p className="text-default-500">
                  {client.company || "Cliente particular"}
                </p>
              </div>

              <Button
                color="primary"
                startContent={<Icon icon="lucide:plus" />}
                onPress={() => history.push(`/work/new/${client.id}`)}
              >
                Nuevo Trabajo
              </Button>
            </div>

            <div className="flex flex-col gap-6 mb-6">
              <div>
                <p className="text-small text-default-500">Teléfono</p>
                <a
                  href={`tel:${client.phone}`}
                  className="text-primary hover:underline flex gap-2 items-center"
                >
                  <Icon icon="lucide:phone" />
                  {client.phone}
                </a>
              </div>

              {client.address && (
                <div>
                  <p className="text-small text-default-500">Dirección</p>
                  <p className="flex gap-2 items-center">
                    <Icon icon="lucide:map-pin" />
                    {client.address}
                  </p>
                </div>
              )}
            </div>

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
                onPress={() => history.push(`/client/edit/${client.id}`)}
              >
                Editar
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* TRABAJOS */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Trabajos realizados
          </h2>

          {clientWorks.length === 0 ? (
            <Card>
              <CardBody className="py-10 text-center">
                <Icon
                  icon="lucide:clipboard"
                  className="mx-auto text-default-300"
                  width={48}
                />
                <p className="mt-4 text-default-500">
                  Este cliente aún no tiene trabajos
                </p>
                <Button
                  color="primary"
                  className="mt-4"
                  onPress={() => history.push(`/work/new/${client.id}`)}
                  startContent={<Icon icon="lucide:plus" />}
                >
                  Agregar trabajo
                </Button>
              </CardBody>
            </Card>
          ) : (
            <Card>
              <CardBody>
                <Table removeWrapper>
                  <TableHeader>
                    <TableColumn>DESCRIPCIÓN</TableColumn>
                    <TableColumn>FECHA</TableColumn>
                    <TableColumn>MONTO</TableColumn>
                    <TableColumn>ACCIONES</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {clientWorks.map(work => (
                      <TableRow
                        key={work.id}
                        className="cursor-pointer"
                      >
                        <TableCell>
                          {work.workDescription}
                        </TableCell>
                        <TableCell>
                          <Chip size="sm">
                            {new Date(work.date).toLocaleDateString()}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          {formatCurrency(work.budget.amount)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              onPress={() =>
                                history.push(`/work/edit/${work.id}`)
                              }
                            >
                              <Icon icon="lucide:edit" />
                            </Button>
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              color="primary"
                              onPress={() =>
                                history.push(`/work/${work.id}`)
                              }
                            >
                              <Icon icon="lucide:eye" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardBody>
            </Card>
          )}
        </div>
      </div>

      {/* MODAL ELIMINAR */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Eliminar cliente</ModalHeader>
              <ModalBody>
                <p>
                  ¿Seguro que querés eliminar a{" "}
                  <strong>{client.name}</strong>?
                </p>
                <p className="text-default-500">
                  Se eliminarán también sus trabajos.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  color="danger"
                  onPress={handleDelete}
                  isLoading={isDeleting}
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
