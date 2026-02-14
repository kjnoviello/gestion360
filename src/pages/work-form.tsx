import React from "react";
import {
  Card,
  CardBody,
  Input,
  Button,
  Textarea,
  Select,
  SelectItem,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useHistory, useParams } from "react-router-dom";
import { Layout } from "../components/layout";
import { useClients } from "../hooks/use-clients";
import { addToast } from "@heroui/react";
import { useWorks } from "../hooks/useWork";

interface RouteParams {
  id?: string;
  clientId?: string;
}

export const WorkForm: React.FC = () => {
  const { id, clientId: urlClientId } = useParams<RouteParams>();
  const isEditing = Boolean(id);
  const history = useHistory();

  const { clients } = useClients();
  const { addWork, updateWork, getWork,
    // uploadFile 
  } = useWorks();

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [clientId, setClientId] = React.useState(urlClientId || "");
  const [workDescription, setWorkDescription] = React.useState("");
  // const [date, setDate] = React.useState<Date>(new Date());
  const [budgetAmount, setBudgetAmount] = React.useState("");

  const [budgetPdf, setBudgetPdf] = React.useState<{
    url: string;
    name: string;
  } | null>(null);

  const [photo, setPhoto] = React.useState<{
    url: string;
    name: string;
  } | null>(null);

  const [date, setDate] = React.useState(
    new Date().toISOString().split("T")[0]
  );

  const work = React.useMemo(() => {
    if (!isEditing || !id) return null;
    return getWork(id);
  }, [isEditing, id, getWork]);

  const initializedRef = React.useRef(false);

  // ===============================
  // Cargar trabajo si es edición
  // ===============================
  React.useEffect(() => {
    if (!work) return;

    setClientId(work.clientId);
    setWorkDescription(work.workDescription);
    setDate(work.date.split("T")[0]);
    setBudgetAmount(work.budget.amount.toString());

    if (work.budget.pdfUrl && work.budget.pdfName) {
      setBudgetPdf({
        url: work.budget.pdfUrl,
        name: work.budget.pdfName,
      });
    }

    if (work.photo && work.photoName) {
      setPhoto({
        url: work.photo,
        name: work.photoName,
      });
    }
  }, [work]);

  const selectedClient = React.useMemo(
    () => clients.find((c) => c.id === clientId),
    [clients, clientId]
  );

  // ===============================
  // Submit
  // ===============================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!clientId || !workDescription || !budgetAmount) {
      addToast({
        title: "Error",
        description: "Completa todos los campos obligatorios",
        color: "danger",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        clientId,
        workDescription,
        date: date,
        budget: {
          amount: Number(budgetAmount),
          // pdfUrl: budgetPdf?.url,
          // pdfName: budgetPdf?.name,
        },
        // photo: photo?.url,
        // photoName: photo?.name,
      };

      if (isEditing && id) {
        await updateWork(id, payload);
        history.push(`/work/${id}`);
      } else {
        await addWork(payload);
        history.push("/dashboard");
      }
    } catch (error) {
      console.error(error);
      addToast({
        title: "Error",
        description: "Ocurrió un error al guardar el trabajo",
        color: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ===============================
  // Upload PDF
  // ===============================
  // const handleBudgetPdfUpload = async (
  //   e: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   if (!e.target.files?.[0]) return;

  //   try {
  //     const file = e.target.files[0];
  //     const result = await uploadFile(file, "pdf");
  //     setBudgetPdf(result);
  //   } catch (error) {
  //     addToast({
  //       title: "Error",
  //       description: "No se pudo subir el PDF",
  //       color: "danger",
  //     });
  //   }
  // };

  // ===============================
  // Upload Photo
  // ===============================
  // const handlePhotoUpload = async (
  //   e: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   if (!e.target.files?.[0]) return;

  //   try {
  //     const file = e.target.files[0];
  //     const result = await uploadFile(file, "photo");
  //     setPhoto(result);
  //   } catch (error) {
  //     addToast({
  //       title: "Error",
  //       description: "No se pudo subir la imagen",
  //       color: "danger",
  //     });
  //   }
  // };

  return (
    <Layout title={isEditing ? "Editar Trabajo" : "Nuevo Trabajo"}>
      <Card>
        <CardBody className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                label="Cliente"
                selectedKeys={clientId ? new Set([clientId]) : new Set()}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;
                  setClientId(value);
                }}
                renderValue={() =>
                  selectedClient
                    ? `${selectedClient.name}${selectedClient.company ? ` (${selectedClient.company})` : ""
                    }`
                    : ""
                }
                isRequired
              >
                {clients.map((client) => (
                  <SelectItem key={client.id} textValue={client.name}>
                    {client.name}
                    {client.company ? ` (${client.company})` : ""}
                  </SelectItem>
                ))}
              </Select>

              <Input
                type="date"
                label="Fecha"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                isRequired
              />

              <Textarea
                label="Descripción"
                value={workDescription}
                onValueChange={setWorkDescription}
                isRequired
                minRows={3}
                className="md:col-span-2"
              />

              <Input
                type="number"
                label="Presupuesto"
                value={budgetAmount}
                onValueChange={setBudgetAmount}
                isRequired
                startContent={
                  <Icon icon="lucide:dollar-sign" className="text-default-400" />
                }
              />

              {/* PDF */}
              {/* <div>
                <p className="text-small mb-2">Presupuesto (PDF)</p>
                <div className="flex gap-2 items-center">
                  <div className="file-input-container">
                    <Button
                      variant="flat"
                      color="primary"
                      startContent={<Icon icon="lucide:file-text" />}
                    >
                      {budgetPdf ? "Cambiar PDF" : "Subir PDF"}
                    </Button>
                    <input type="file" accept=".pdf" onChange={handleBudgetPdfUpload} />
                  </div>
                  {budgetPdf && (
                    <span className="text-small truncate max-w-[200px]">
                      {budgetPdf.name}
                    </span>
                  )}
                </div>
              </div> */}

              {/* Foto */}
              {/* <div>
                <p className="text-small mb-2">Foto</p>
                <div className="flex gap-2 items-center">
                  <div className="file-input-container">
                    <Button
                      variant="flat"
                      color="primary"
                      startContent={<Icon icon="lucide:image" />}
                    >
                      {photo ? "Cambiar foto" : "Subir foto"}
                    </Button>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} />
                  </div>
                  {photo && (
                    <span className="text-small truncate max-w-[200px]">
                      {photo.name}
                    </span>
                  )}
                </div>
              </div> */}
            </div>

            {photo && (
              <img
                src={photo.url}
                alt="preview"
                className="max-h-40 rounded-md object-cover"
              />
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="flat" onPress={() => history.goBack()}>
                Cancelar
              </Button>
              <Button color="primary" type="submit" isLoading={isSubmitting}>
                {isEditing ? "Actualizar" : "Guardar"} Trabajo
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </Layout>
  );
};
