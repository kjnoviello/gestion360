import React from "react";
import { Card, CardBody, Input, Button } from "@heroui/react";
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
  const { addClient, updateClient, getClient, loading } = useClients();

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [company, setCompany] = React.useState("");
  const initializedRef = React.useRef(false);

React.useEffect(() => {
  if (!isEditing || !id || loading) return;
  if (initializedRef.current) return;

  const client = getClient(id);

  if (!client) {
    history.push("/dashboard");
    return;
  }

  setName(client.name);
  setPhone(client.phone);
  setAddress(client.address ?? "");
  setCompany(client.company ?? "");

  initializedRef.current = true;
}, [id, isEditing, loading, history]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim()) {
      addToast({
        title: "Campos requeridos",
        description: "Nombre y teléfono son obligatorios",
        color: "danger",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        ...(address && { address: address.trim() }),
        ...(company && { company: company.trim() }),
      };

      if (isEditing && id) {
        await updateClient(id, payload);
        addToast({
          title: "Cliente actualizado",
          color: "success",
        });
        history.push(`/client/${id}`);
      } else {
        await addClient(payload);
        addToast({
          title: "Cliente creado",
          color: "success",
        });
        history.push("/dashboard");
      }
    } catch (error) {
      console.error(error);
      addToast({
        title: "Error",
        description: "No se pudo guardar el cliente",
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
                placeholder="Nombre completo"
                value={name}
                onValueChange={setName}
                isRequired
                startContent={<Icon icon="lucide:user" />}
              />

              <Input
                label="Teléfono"
                placeholder="Ej: 11 1234 5678"
                value={phone}
                onValueChange={setPhone}
                isRequired
                startContent={<Icon icon="lucide:phone" />}
              />

              <Input
                label="Dirección"
                placeholder="Dirección (opcional)"
                value={address}
                onValueChange={setAddress}
                startContent={<Icon icon="lucide:map-pin" />}
              />

              <Input
                label="Empresa"
                placeholder="Empresa (opcional)"
                value={company}
                onValueChange={setCompany}
                startContent={<Icon icon="lucide:building" />}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="flat"
                onPress={() => history.goBack()}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>

              <Button
                color="primary"
                type="submit"
                isLoading={isSubmitting}
              >
                {isEditing ? "Actualizar cliente" : "Guardar cliente"}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </Layout>
  );
};
