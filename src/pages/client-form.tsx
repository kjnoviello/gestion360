import React from "react";
import { Card, CardBody, Input, Button, Textarea, DatePicker } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useHistory, useParams } from "react-router-dom";
import { Layout } from "../components/layout";
import { useClients } from "../hooks/use-clients";
import { addToast } from "@heroui/react";

interface RouteParams {
  id?: string;
}

export const ClientForm: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const isEditing = Boolean(id);
  const history = useHistory();
  const { addClient, updateClient, getClient } = useClients();
  
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [company, setCompany] = React.useState("");
  
  React.useEffect(() => {
    if (isEditing && id) {
      const client = getClient(id);
      if (client) {
        setName(client.name);
        setPhone(client.phone);
        setAddress(client.address);
        setCompany(client.company);
      } else {
        history.push("/dashboard");
      }
    }
  }, [id, isEditing, getClient, history]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !phone) {
      addToast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        color: "danger",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const clientData = {
        name,
        phone,
        address,
        company,
      };
      
      if (isEditing && id) {
        await updateClient(id, clientData);
        history.push(`/client/${id}`);
      } else {
        const newClientId = await addClient(clientData);
        history.push(`/dashboard`);
      }
    } catch (error) {
      console.error("Error saving client:", error);
      addToast({
        title: "Error",
        description: "Ocurrió un error al guardar el cliente",
        color: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout title={isEditing ? "Editar Cliente" : "Nuevo Cliente"}>
      <Card>
        <CardBody className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Nombre del cliente"
                placeholder="Ingresa el nombre completo"
                value={name}
                onValueChange={setName}
                isRequired
                startContent={<Icon icon="lucide:user" className="text-default-400" />}
              />
              
              <Input
                label="Teléfono"
                placeholder="Ingresa el número de teléfono"
                value={phone}
                onValueChange={setPhone}
                isRequired
                startContent={<Icon icon="lucide:phone" className="text-default-400" />}
              />
              
              <Input
                label="Dirección"
                placeholder="Ingresa la dirección"
                value={address}
                onValueChange={setAddress}
                startContent={<Icon icon="lucide:map-pin" className="text-default-400" />}
              />
              
              <Input
                label="Empresa"
                placeholder="Nombre de la empresa (opcional)"
                value={company}
                onValueChange={setCompany}
                startContent={<Icon icon="lucide:building" className="text-default-400" />}
              />
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button 
                variant="flat" 
                onPress={() => history.goBack()}
              >
                Cancelar
              </Button>
              <Button 
                color="primary" 
                type="submit"
                isLoading={isSubmitting}
              >
                {isEditing ? "Actualizar" : "Guardar"} Cliente
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </Layout>
  );
};