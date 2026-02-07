import React from "react";
import { Card, CardBody, Button, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useHistory, useParams } from "react-router-dom";
import { Layout } from "../components/layout";
import { useClients } from "../hooks/use-clients";
import { formatCurrency, formatDate } from "../utils/format";

interface RouteParams {
  id: string;
}

export const WorkDetails: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const history = useHistory();
  const { getWork, deleteWork, getClient } = useClients();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isDeleting, setIsDeleting] = React.useState(false);
  
  const work = getWork(id);
  const client = work ? getClient(work.clientId) : undefined;
  
  if (!work) {
    return (
      <Layout title="Trabajo no encontrado">
        <Card>
          <CardBody className="py-8 text-center">
            <Icon icon="lucide:alert-circle" className="mx-auto text-danger" width={48} height={48} />
            <h2 className="text-xl font-semibold mt-4">Trabajo no encontrado</h2>
            <p className="text-default-500 mt-2">El trabajo que buscas no existe o ha sido eliminado</p>
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
    if (work.budget.pdfUrl) {
      const link = document.createElement('a');
      link.href = work.budget.pdfUrl;
      link.download = work.budget.pdfName || 'presupuesto.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Layout title="Detalles del Trabajo">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardBody>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{client?.name || "Cliente desconocido"}</h2>
                  <p className="text-default-500">{client?.company || "Cliente particular"}</p>
                </div>
                <Chip color="primary" variant="flat">
                  {formatDate(work.date)}
                </Chip>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {client && (
                  <div>
                    <h3 className="text-small text-default-500 mb-1">Teléfono</h3>
                    <p className="flex items-center gap-2">
                      <Icon icon="lucide:phone" className="text-default-500" />
                      <a href={`tel:${client.phone}`} className="text-primary hover:underline">
                        {client.phone}
                      </a>
                    </p>
                  </div>
                )}
                
                {client?.address && (
                  <div>
                    <h3 className="text-small text-default-500 mb-1">Dirección</h3>
                    <p className="flex items-center gap-2">
                      <Icon icon="lucide:map-pin" className="text-default-500" />
                      {client.address}
                    </p>
                  </div>
                )}
                
                <div className="md:col-span-2">
                  <h3 className="text-small text-default-500 mb-1">Descripción del trabajo</h3>
                  <p className="bg-default-50 p-3 rounded-md">{work.workDescription}</p>
                </div>
                
                <div>
                  <h3 className="text-small text-default-500 mb-1">Monto del presupuesto</h3>
                  <p className="text-xl font-semibold text-success">
                    {formatCurrency(work.budget.amount)}
                  </p>
                </div>
                
                {work.budget.pdfUrl && (
                  <div>
                    <h3 className="text-small text-default-500 mb-1">Presupuesto</h3>
                    <Button 
                      variant="flat" 
                      color="primary" 
                      startContent={<Icon icon="lucide:file-text" />}
                      onPress={downloadPdf}
                    >
                      Descargar PDF
                    </Button>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
          
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
        </div>
        
        <div>
          {work.photo ? (
            <Card>
              <CardBody>
                <h3 className="text-medium font-semibold mb-3">Foto del trabajo</h3>
                <img 
                  src={work.photo} 
                  alt="Foto del trabajo" 
                  className="w-full rounded-lg object-cover" 
                />
              </CardBody>
            </Card>
          ) : (
            <Card>
              <CardBody className="py-8 text-center">
                <Icon icon="lucide:image" className="mx-auto text-default-300" width={48} height={48} />
                <p className="text-default-500 mt-4">No hay foto disponible</p>
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
              <ModalHeader className="flex flex-col gap-1">Confirmar eliminación</ModalHeader>
              <ModalBody>
                <p>
                  ¿Estás seguro de que deseas eliminar este trabajo?
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