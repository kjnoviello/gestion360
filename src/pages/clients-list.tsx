import React from "react";
import { Card, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Input, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useHistory } from "react-router-dom";
import { Layout } from "../components/layout";
import { useClients } from "../hooks/use-clients";

export const ClientsList: React.FC = () => {
  const { clients, deleteClient } = useClients();
  const history = useHistory();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [clientToDelete, setClientToDelete] = React.useState<string | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Filter clients
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

  const handleDeleteConfirm = async () => {
    if (!clientToDelete) return;
    
    setIsDeleting(true);
    try {
      await deleteClient(clientToDelete);
      setClientToDelete(null);
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
          
          {filteredClients.length === 0 ? (
            <div className="text-center py-12">
              <Icon icon="lucide:users" className="mx-auto text-default-300" width={48} height={48} />
              <p className="mt-4 text-default-500">
                {searchTerm ? "No se encontraron clientes que coincidan con tu búsqueda" : "Aún no has agregado ningún cliente"}
              </p>
              {searchTerm ? (
                <Button color="primary" variant="flat" className="mt-4" onPress={() => setSearchTerm("")}>
                  Limpiar búsqueda
                </Button>
              ) : (
                <Button color="primary" className="mt-4" onPress={() => history.push("/client/new")}>
                  Agregar cliente
                </Button>
              )}
            </div>
          ) : (
            <Table removeWrapper aria-label="Tabla de clientes" selectionMode="none">
              <TableHeader>
                <TableColumn>NOMBRE</TableColumn>
                <TableColumn>EMPRESA</TableColumn>
                <TableColumn>TELÉFONO</TableColumn>
                <TableColumn>DIRECCIÓN</TableColumn>
                <TableColumn>ACCIONES</TableColumn>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>
                      <p className="font-medium">{client.name}</p>
                    </TableCell>
                    <TableCell>
                      <p>{client.company || "-"}</p>
                    </TableCell>
                    <TableCell>
                      <a href={`tel:${client.phone}`} className="text-primary hover:underline">
                        {client.phone}
                      </a>
                    </TableCell>
                    <TableCell>
                      <p className="line-clamp-1">{client.address || "-"}</p>
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
      
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => {
            const clientName = clientToDelete ? 
              clients.find(c => c.id === clientToDelete)?.name || "este cliente" : 
              "este cliente";
              
            return (
              <>
                <ModalHeader className="flex flex-col gap-1">Confirmar eliminación</ModalHeader>
                <ModalBody>
                  <p>
                    ¿Estás seguro de que deseas eliminar a <strong>{clientName}</strong>?
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
                    onPress={() => {
                      handleDeleteConfirm();
                      onClose();
                    }}
                    isLoading={isDeleting}
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