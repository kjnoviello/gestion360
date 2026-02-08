import React from "react";
import {
  Card,
  CardBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useHistory } from "react-router-dom";
import { Layout } from "../components/layout";
import { useClients } from "../hooks/use-clients";

export const ClientsList: React.FC = () => {
  const { clients, loading, deleteClient } = useClients();
  const history = useHistory();

  const [searchTerm, setSearchTerm] = React.useState("");
  const [clientToDelete, setClientToDelete] = React.useState<string | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // 🔎 Filter
  const filteredClients = React.useMemo(() => {
    if (!searchTerm) return clients;

    const term = searchTerm.toLowerCase();
    return clients.filter(
      client =>
        client.name.toLowerCase().includes(term) ||
        client.company?.toLowerCase().includes(term) ||
        client.phone.includes(term)
    );
  }, [clients, searchTerm]);

  const handleEditClient = (id: string) => {
    history.push(`/client/edit/${id}`);
  };

  const handleViewClient = (id: string) => {
    history.push(`/client/${id}`);
  };

  const handleDeleteClick = (id: string) => {
    setClientToDelete(id);
    onOpen();
  };

  const handleDeleteConfirm = async (onClose: () => void) => {
    if (!clientToDelete) return;

    setIsDeleting(true);
    try {
      await deleteClient(clientToDelete);
      setClientToDelete(null);
      onClose();
    } catch (error) {
      console.error("Error deleting client:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Layout title="Lista de Clientes">
      <Card className="mb-6">
        <CardBody>
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <Input
              placeholder="Buscar por nombre, empresa o teléfono..."
              value={searchTerm}
              onValueChange={setSearchTerm}
              startContent={<Icon icon="lucide:search" className="text-default-400" />}
              className="w-full md:w-80"
            />

            <Button
              color="primary"
              onPress={() => history.push("/client/new")}
              startContent={<Icon icon="lucide:user-plus" />}
            >
              Nuevo Cliente
            </Button>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="flex justify-center py-12">
              <Spinner label="Cargando clientes..." />
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="text-center py-12">
              <Icon icon="lucide:users" className="mx-auto text-default-300" width={48} height={48} />
              <p className="mt-4 text-default-500">
                {searchTerm
                  ? "No se encontraron clientes que coincidan con tu búsqueda"
                  : "Aún no has agregado ningún cliente"}
              </p>

              {searchTerm ? (
                <Button
                  color="primary"
                  variant="flat"
                  className="mt-4"
                  onPress={() => setSearchTerm("")}
                >
                  Limpiar búsqueda
                </Button>
              ) : (
                <Button
                  color="primary"
                  className="mt-4"
                  onPress={() => history.push("/client/new")}
                >
                  Agregar cliente
                </Button>
              )}
            </div>
          ) : (
            <Table removeWrapper aria-label="Tabla de clientes">
              <TableHeader>
                <TableColumn>NOMBRE</TableColumn>
                <TableColumn>EMPRESA</TableColumn>
                <TableColumn>TELÉFONO</TableColumn>
                <TableColumn>DIRECCIÓN</TableColumn>
                <TableColumn>ACCIONES</TableColumn>
              </TableHeader>
              <TableBody>
                {filteredClients.map(client => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.company || "-"}</TableCell>
                    <TableCell>
                      <a
                        href={`tel:${client.phone}`}
                        className="text-primary hover:underline"
                      >
                        {client.phone}
                      </a>
                    </TableCell>
                    <TableCell className="line-clamp-1">
                      {client.address || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onPress={() => handleEditClient(client.id)}
                        >
                          <Icon icon="lucide:edit" />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          color="primary"
                          onPress={() => handleViewClient(client.id)}
                        >
                          <Icon icon="lucide:eye" />
                        </Button>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          color="danger"
                          onPress={() => handleDeleteClick(client.id)}
                        >
                          <Icon icon="lucide:trash-2" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>

      {/* Modal delete */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => {
            const clientName =
              clients.find(c => c.id === clientToDelete)?.name ?? "este cliente";

            return (
              <>
                <ModalHeader>Confirmar eliminación</ModalHeader>
                <ModalBody>
                  <p>
                    ¿Estás seguro de que deseas eliminar a{" "}
                    <strong>{clientName}</strong>?
                  </p>
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
                    onPress={() => handleDeleteConfirm(onClose)}
                  >
                    Eliminar
                  </Button>
                </ModalFooter>
              </>
            );
          }}
        </ModalContent>
      </Modal>
    </Layout>
  );
};
