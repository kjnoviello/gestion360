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
import { UploadedFile, uploadFile } from "../lib/storage";

interface RouteParams {
  id?: string;
  clientId?: string;
}

export const WorkForm: React.FC = () => {
  const { id, clientId: urlClientId } = useParams<RouteParams>();
  const isEditing = Boolean(id);
  const history = useHistory();

  const { clients } = useClients();
  const { addWork, updateWork, getWork } = useWorks();

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [clientId, setClientId] = React.useState(urlClientId || "");
  const [workDescription, setWorkDescription] = React.useState("");
  const [budgetAmount, setBudgetAmount] = React.useState("");
  const [date, setDate] = React.useState(
    new Date().toISOString().split("T")[0]
  );

  const [budgetPdf, setBudgetPdf] = React.useState<UploadedFile | null>(null);
  const [existingImageUrl, setExistingImageUrl] = React.useState<string | null>(null);
  const [image, setImage] = React.useState<UploadedFile | null>(null);

  const work = React.useMemo(() => {
    if (!isEditing || !id) return null;
    return getWork(id);
  }, [isEditing, id, getWork]);

  React.useEffect(() => {
    if (!work) return;

    setClientId(work.clientId);
    setWorkDescription(work.workDescription);
    setDate(work.date);
    setBudgetAmount(work.budget.amount.toString());

    if (work.budget?.pdfName) {
      setBudgetPdf({
        // url: work.budget.pdfUrl,
        name: work.budget.pdfName,
        path: work.budget.pdfPath || "",
      });
    }

    if (work.imageName) {
      setImage({
        // url: work.imageUrl,
        name: work.imageName,
        path: work.imagePath || "",
      });
    }
  }, [work]);

  const selectedClient = React.useMemo(
    () => clients.find((c) => c.id === clientId),
    [clients, clientId]
  );

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files?.[0]) return;

    try {
      const uploaded = await uploadFile(
        e.target.files[0],
        "work-images"
      );

      setImage(uploaded);
    } catch (error: any) {
      addToast({
        title: "Error",
        description:
          error.message || "No se pudo subir la imagen",
        color: "danger",
      });
      console.error("Error al subir imagen:", error);
    }
  };

  const handlePdfUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files?.[0]) return;

    try {
      const uploaded = await uploadFile(
        e.target.files[0],
        "work-pdfs"
      );

      setBudgetPdf(uploaded);
    } catch (error: any) {
      addToast({
        title: "Error",
        description:
          error.message || "No se pudo subir el PDF",
        color: "danger",
      });
    }
  };


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
        date,
        budget: {
          amount: Number(budgetAmount),
          ...(budgetPdf && {
            // pdfUrl: budgetPdf.url,
            pdfName: budgetPdf.name,
            pdfPath: budgetPdf.path,
          }),
        },
        ...(image && {
          // imageUrl: image.url,
          imageName: image.name,
          imagePath: image.path,
        }),
      };


      if (isEditing && id) {
        await updateWork(id, payload);
        history.push(`/work/${id}`);
      } else {
        console.log("FINAL PAYLOAD", payload);
        await addWork(payload);
        history.push("/dashboard");
      }
    } catch {
      addToast({
        title: "Error",
        description: "Ocurrió un error al guardar el trabajo",
        color: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
                startContent={<Icon icon="lucide:dollar-sign" />}
              />

              <div>
                <p className="text-small mb-2">Imagen (opcional)</p>


                <label
                  htmlFor="budget-image"
                  className="inline-flex items-center px-4 py-2
               bg-primary text-white rounded-md
               cursor-pointer hover:bg-primary/90
               transition"
                >
                  {image ?
                    "Cambiar Imagen"
                    :
                    "Subir Imagen"
                  }
                </label>

                <input
                  id="budget-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {image && (
                  <p className="text-small mt-2 text-gray-600">
                    {image.name}
                  </p>
                )}
              </div>

              <div>
                <p className="text-small mb-2">Presupuesto PDF (opcional)</p>

                <label
                  htmlFor="budget-pdf"
                  className="inline-flex items-center px-4 py-2
               bg-primary text-white rounded-md
               cursor-pointer hover:bg-primary/90
               transition"
                >
                  {budgetPdf ?
                    "Cambiar PDF"
                    :
                    "Subir PDF"
                  }
                </label>

                <input
                  id="budget-pdf"
                  type="file"
                  accept="application/pdf"
                  onChange={handlePdfUpload}
                  className="hidden"
                />

                {budgetPdf && (
                  <p className="text-small mt-2 text-gray-600">
                    {budgetPdf.name}
                  </p>
                )}
              </div>
            </div>

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