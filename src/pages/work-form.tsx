import React from "react";
import { Card, CardBody, Input, Button, Textarea, Select, SelectItem } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useHistory, useParams } from "react-router-dom";
import { Layout } from "../components/layout";
import { useClients } from "../hooks/use-clients";
import { addToast } from "@heroui/react";

interface RouteParams {
  id?: string;
  clientId?: string;
}

export const WorkForm: React.FC = () => {
  const { id, clientId: urlClientId } = useParams<RouteParams>();
  const isEditing = Boolean(id);
  const history = useHistory();
  const { clients, addWork, updateWork, getWork, uploadFile } = useClients();
  
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [clientId, setClientId] = React.useState(urlClientId || "");
  const [workDescription, setWorkDescription] = React.useState("");
  const [date, setDate] = React.useState<Date>(new Date());
  const [budgetAmount, setBudgetAmount] = React.useState("");
  const [budgetPdf, setBudgetPdf] = React.useState<{ url: string; name: string } | null>(null);
  const [photo, setPhoto] = React.useState<{ url: string; name: string } | null>(null);
  
  React.useEffect(() => {
    if (isEditing && id) {
      const work = getWork(id);
      if (work) {
        setClientId(work.clientId);
        setWorkDescription(work.workDescription);
        setDate(new Date(work.date));
        setBudgetAmount(work.budget.amount.toString());
        
        if (work.budget.pdfUrl && work.budget.pdfName) {
          setBudgetPdf({
            url: work.budget.pdfUrl,
            name: work.budget.pdfName
          });
        }
        
        if (work.photo && work.photoName) {
          setPhoto({
            url: work.photo,
            name: work.photoName
          });
        }
      } else {
        history.push("/dashboard");
      }
    }
  }, [id, isEditing, getWork, history]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientId || !workDescription || !date || !budgetAmount) {
      addToast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        color: "danger",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const workData = {
        clientId,
        workDescription,
        date: date.toISOString(),
        budget: {
          amount: parseFloat(budgetAmount),
          pdfUrl: budgetPdf?.url,
          pdfName: budgetPdf?.name,
        },
        photo: photo?.url,
        photoName: photo?.name,
      };
      
      if (isEditing && id) {
        await updateWork(id, workData);
        history.push(`/work/${id}`);
      } else {
        const newWorkId = await addWork(workData);
        history.push(`/dashboard`);
      }
    } catch (error) {
      console.error("Error saving work:", error);
      addToast({
        title: "Error",
        description: "Ocurrió un error al guardar el trabajo",
        color: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBudgetPdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const file = e.target.files[0];
        const result = await uploadFile(file, "pdf");
        setBudgetPdf(result);
      } catch (error) {
        console.error("Error uploading PDF:", error);
        addToast({
          title: "Error",
          description: "No se pudo cargar el archivo PDF",
          color: "danger",
        });
      }
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const file = e.target.files[0];
        const result = await uploadFile(file, "photo");
        setPhoto(result);
      } catch (error) {
        console.error("Error uploading photo:", error);
        addToast({
          title: "Error",
          description: "No se pudo cargar la foto",
          color: "danger",
        });
      }
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
                placeholder="Selecciona un cliente"
                selectedKeys={clientId ? [clientId] : []}
                onChange={(e) => setClientId(e.target.value)}
                isRequired
              >
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name} {client.company ? `(${client.company})` : ''}
                  </SelectItem>
                ))}
              </Select>
              
              <Input
                type="date"
                label="Fecha del trabajo"
                placeholder="Selecciona la fecha"
                value={date.toISOString().split('T')[0]}
                onChange={(e) => {
                  const newDate = new Date(e.target.value);
                  setDate(newDate);
                }}
                className="w-full"
                isRequired
              />
              
              <div className="md:col-span-2">
                <Textarea
                  label="Descripción del trabajo"
                  placeholder="Describe el trabajo realizado"
                  value={workDescription}
                  onValueChange={setWorkDescription}
                  isRequired
                  minRows={3}
                />
              </div>
              
              <Input
                type="number"
                label="Monto del presupuesto"
                placeholder="Ingresa el monto"
                value={budgetAmount}
                onValueChange={setBudgetAmount}
                isRequired
                startContent={<Icon icon="lucide:dollar-sign" className="text-default-400" />}
              />
              
              <div>
                <p className="text-small mb-2">Presupuesto (PDF)</p>
                <div className="flex items-center gap-2">
                  <div className="file-input-container">
                    <Button 
                      variant="flat" 
                      color="primary"
                      startContent={<Icon icon="lucide:file-text" />}
                      className="w-full"
                    >
                      {budgetPdf ? "Cambiar PDF" : "Subir PDF"}
                    </Button>
                    <input 
                      type="file" 
                      accept=".pdf" 
                      onChange={handleBudgetPdfUpload}
                    />
                  </div>
                  {budgetPdf && (
                    <p className="text-small text-default-500 truncate max-w-[200px]">
                      {budgetPdf.name}
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <p className="text-small mb-2">Foto del trabajo</p>
                <div className="flex items-center gap-2">
                  <div className="file-input-container">
                    <Button 
                      variant="flat" 
                      color="primary"
                      startContent={<Icon icon="lucide:image" />}
                      className="w-full"
                    >
                      {photo ? "Cambiar foto" : "Subir foto"}
                    </Button>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handlePhotoUpload}
                    />
                  </div>
                  {photo && (
                    <p className="text-small text-default-500 truncate max-w-[200px]">
                      {photo.name}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {photo && (
              <div className="mt-4">
                <p className="text-small mb-2">Vista previa:</p>
                <img 
                  src={photo.url} 
                  alt="Vista previa" 
                  className="max-h-40 rounded-md object-cover" 
                />
              </div>
            )}
            
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
                {isEditing ? "Actualizar" : "Guardar"} Trabajo
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </Layout>
  );
};