import React from "react";
import { Card, CardBody, Button, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, useDisclosure } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useHistory, useParams } from "react-router-dom";
import { Layout } from "../components/layout";
import { useClients } from "../hooks/use-clients";
import { formatCurrency, formatDate } from "../utils/format";

interface RouteParams {
  id: string;
}

export const ClientDetails: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const history = useHistory();
  const { getClient, deleteClient, getClientWorks } = useClients();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isDeleting, setIsDeleting] = React.useState(false);
  
  const client = getClient(id);
  const clientWorks = client ? getClientWorks(id) : [];
  
  if (!client) {
    return (
      <Layout title="Cliente no encontrado">
        <Card>
          <CardBody className="py-8 text-center">
            <Icon icon="lucide:alert-circle" className="mx-auto text-danger" width={48} height={48} />
            <h2 className="text-xl font-semibold mt-4">Cliente no encontrado</h2>
            <p className="text-default-500 mt-2">El cliente que buscas no existe o ha sido eliminado</p>
            <Button 
              color="primary" 
              className="mt-6" 
              onPress={() => history.push("/dashboard")}
            >
              Volver al Dashboard
            </Button>
          </CardBody>
        </Card>
      </Layout>
    );
  }

  const handleEdit = () => {
    history.push(`/client/edit/${id}`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteClient(id);
      history.push("/dashboard");
    } catch (error) {
      console.error("Error deleting client:", error);
      setIsDeleting(false);
    }
  };

  const handleAddWork = () => {
    history.push(`/work/new/${id}`);
  };

  return (
    <Layout title="Detalles del Cliente">
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardBody>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold">{client.name}</h2>
                <p className="text-default-500">{client.company || "Cliente particular"}</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  color="primary" 
                  startContent={<Icon icon="lucide:plus" />}
                  onPress={handleAddWork}
                >
                  Nuevo Trabajo
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-small text-default-500 mb-1">Teléfono</h3>
                <p className="flex items-center gap-2">
                  <Icon icon="lucide:phone" className="text-default-500" />
                  <a href={`tel:${client.phone}`} className="text-primary hover:underline">
                    {client.phone}
                  </a>
                </p>
              </div>
              
              {client.address && (
                <div>
                  <h3 className="text-small text-default-500 mb-1">Dirección</h3>
                  <p className="flex items-center gap-2">
                    <Icon icon="lucide:map-pin" className="text-default-500" />
                    {client.address}
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex gap-2 justify-end">
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
          </CardBody>
        </Card>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Trabajos realizados</h2>
          {clientWorks.length === 0 ? (
            <Card>
              <CardBody className="py-8 text-center">
                <Icon icon="lucide:clipboard" className="mx-auto text-default-300" width={48} height={48} />
                <p className="mt-4 text-default-500">Este cliente aún no tiene trabajos registrados</p>
                <Button 
                  color="primary" 
                  className="mt-4" 
                  onPress={handleAddWork}
                  startContent={<Icon icon="lucide:plus" />}
                >
                  Agregar trabajo
                </Button>
              </CardBody>
            </Card>
          ) : (
            <Card>
              <CardBody>
                <Table removeWrapper aria-label="Trabajos del cliente">
                  <TableHeader>
                    <TableColumn>DESCRIPCIÓN</TableColumn>
                    <TableColumn>FECHA</TableColumn>
                    <TableColumn>MONTO</TableColumn>
                    <TableColumn>ACCIONES</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {clientWorks.map((work) => (
                      <TableRow key={work.id}>
                        <TableCell>
                          <p className="line-clamp-1">{work.workDescription}</p>
                        </TableCell>
                        <TableCell>
                          <Chip color="primary" variant="flat" size="sm">
                            {new Date(work.date).toLocaleDateString()}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">{formatCurrency(work.budget.amount)}</p>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button isIconOnly size="sm" variant="light" onPress={() => history.push(`/work/edit/${work.id}`)}>
                              <Icon icon="lucide:edit" />
                            </Button>
                            <Button isIconOnly size="sm" variant="light" color="primary" onPress={() => history.push(`/work/${work.id}`)}>
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
      
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Confirmar eliminación</ModalHeader>
              <ModalBody>
                <p>
                  ¿Estás seguro de que deseas eliminar a <strong>{client.name}</strong>?
                </p>
                <p className="text-default-500">
                  Esta acción no se puede deshacer y se perderán todos los datos asociados.
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