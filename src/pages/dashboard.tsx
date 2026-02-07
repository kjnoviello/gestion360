import React from "react";
import { Card, CardBody, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Button, Input, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useHistory } from "react-router-dom";
import { Layout } from "../components/layout";
import { useClients } from "../hooks/use-clients";
import { formatCurrency } from "../utils/format";

export const Dashboard: React.FC = () => {
  const { clients, works, isLoading } = useClients();
  const history = useHistory();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortBy, setSortBy] = React.useState<"date" | "name" | "amount">("date");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("desc");

  // Filter and sort works
  const filteredWorks = React.useMemo(() => {
    let result = [...works];
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(work => {
        const client = clients.find(c => c.id === work.clientId);
        return (
          work.workDescription.toLowerCase().includes(term) || 
          (client?.name.toLowerCase().includes(term) || false) ||
          (client?.company?.toLowerCase().includes(term) || false)
        );
      });
    }
    
    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === "date") {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortBy === "name") {
        const clientA = clients.find(c => c.id === a.clientId);
        const clientB = clients.find(c => c.id === b.clientId);
        comparison = (clientA?.name || "").localeCompare(clientB?.name || "");
      } else if (sortBy === "amount") {
        comparison = a.budget.amount - b.budget.amount;
      }
      
      return sortDirection === "asc" ? comparison : -comparison;
    });
    
    return result;
  }, [clients, works, searchTerm, sortBy, sortDirection]);

  // Calculate total earnings
  const totalEarnings = React.useMemo(() => {
    return works.reduce((sum, work) => sum + work.budget.amount, 0);
  }, [works]);

  const handleSort = (column: "date" | "name" | "amount") => {
    if (sortBy === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDirection("desc");
    }
  };

  const viewWork = (id: string) => {
    history.push(`/work/${id}`);
  };

  const navigateToClients = () => {
    history.push("/clients");
  };

  return (
    <Layout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card 
          isPressable
          onPress={navigateToClients}
          className="hover:shadow-md transition-shadow"
        >
          <CardBody className="flex flex-row items-center gap-4">
            <div className="p-3 rounded-full bg-primary-100">
              <Icon icon="lucide:users" className="text-primary" width={24} height={24} />
            </div>
            <div>
              <p className="text-small text-default-500">Total Clientes</p>
              <p className="text-xl font-semibold">{clients.length}</p>
            </div>
            <Icon icon="lucide:chevron-right" className="ml-auto text-default-400" />
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="flex flex-row items-center gap-4">
            <div className="p-3 rounded-full bg-success-100">
              <Icon icon="lucide:dollar-sign" className="text-success" width={24} height={24} />
            </div>
            <div>
              <p className="text-small text-default-500">Ganancias Totales</p>
              <p className="text-xl font-semibold">{formatCurrency(totalEarnings)}</p>
            </div>
          </CardBody>
        </Card>
        
        <Card>
          <CardBody className="flex flex-row items-center gap-4">
            <div className="p-3 rounded-full bg-warning-100">
              <Icon icon="lucide:calendar" className="text-warning" width={24} height={24} />
            </div>
            <div>
              <p className="text-small text-default-500">Trabajos este mes</p>
              <p className="text-xl font-semibold">
                {works.filter(work => {
                  const workDate = new Date(work.date);
                  const today = new Date();
                  return workDate.getMonth() === today.getMonth() && 
                         workDate.getFullYear() === today.getFullYear();
                }).length}
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Trabajos Realizados</h2>
        <div className="flex gap-2">
          <Button 
            color="primary" 
            variant="flat"
            onPress={() => history.push("/client/new")}
            startContent={<Icon icon="lucide:user-plus" />}
          >
            Nuevo Cliente
          </Button>
          <Button 
            color="primary" 
            onPress={() => history.push("/work/new")}
            startContent={<Icon icon="lucide:plus" />}
          >
            Nuevo Trabajo
          </Button>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardBody>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <Input
              placeholder="Buscar por cliente, empresa o trabajo..."
              value={searchTerm}
              onValueChange={setSearchTerm}
              startContent={<Icon icon="lucide:search" className="text-default-400" />}
              className="w-full md:w-80"
            />
            
            <Dropdown>
              <DropdownTrigger>
                <Button 
                  variant="flat" 
                  endContent={<Icon icon="lucide:chevron-down" />}
                >
                  Ordenar por: {sortBy === "date" ? "Fecha" : sortBy === "name" ? "Cliente" : "Monto"}
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Ordenar por">
                <DropdownItem key="date" onPress={() => handleSort("date")}>
                  <div className="flex items-center justify-between w-full">
                    <span>Fecha</span>
                    {sortBy === "date" && (
                      <Icon icon={sortDirection === "asc" ? "lucide:arrow-up" : "lucide:arrow-down"} />
                    )}
                  </div>
                </DropdownItem>
                <DropdownItem key="name" onPress={() => handleSort("name")}>
                  <div className="flex items-center justify-between w-full">
                    <span>Cliente</span>
                    {sortBy === "name" && (
                      <Icon icon={sortDirection === "asc" ? "lucide:arrow-up" : "lucide:arrow-down"} />
                    )}
                  </div>
                </DropdownItem>
                <DropdownItem key="amount" onPress={() => handleSort("amount")}>
                  <div className="flex items-center justify-between w-full">
                    <span>Monto</span>
                    {sortBy === "amount" && (
                      <Icon icon={sortDirection === "asc" ? "lucide:arrow-up" : "lucide:arrow-down"} />
                    )}
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredWorks.length === 0 ? (
            <div className="text-center py-12">
              <Icon icon="lucide:inbox" className="mx-auto text-default-300" width={48} height={48} />
              <p className="mt-4 text-default-500">
                {searchTerm ? "No se encontraron trabajos que coincidan con tu búsqueda" : "Aún no has agregado ningún trabajo"}
              </p>
              {searchTerm ? (
                <Button color="primary" variant="flat" className="mt-4" onPress={() => setSearchTerm("")}>
                  Limpiar búsqueda
                </Button>
              ) : (
                <Button color="primary" className="mt-4" onPress={() => history.push("/work/new")}>
                  Agregar trabajo
                </Button>
              )}
            </div>
          ) : (
            <Table removeWrapper aria-label="Tabla de trabajos">
              <TableHeader>
                <TableColumn>CLIENTE</TableColumn>
                <TableColumn>TRABAJO</TableColumn>
                <TableColumn>FECHA</TableColumn>
                <TableColumn>MONTO</TableColumn>
                <TableColumn>ACCIONES</TableColumn>
              </TableHeader>
              <TableBody>
                {filteredWorks.map((work) => {
                  const client = clients.find(c => c.id === work.clientId);
                  return (
                    <TableRow key={work.id} className="cursor-pointer" onClick={() => viewWork(work.id)}>
                      <TableCell>
                        <div className="flex flex-col">
                          <p className="font-medium">{client?.name || "Cliente desconocido"}</p>
                          <p className="text-small text-default-500">{client?.company || ""}</p>
                        </div>
                      </TableCell>
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
                          <Button isIconOnly size="sm" variant="light" onPress={(e) => {
                            e.stopPropagation();
                            history.push(`/work/edit/${work.id}`);
                          }}>
                            <Icon icon="lucide:edit" />
                          </Button>
                          <Button isIconOnly size="sm" variant="light" color="primary" onPress={(e) => {
                            e.stopPropagation();
                            viewWork(work.id);
                          }}>
                            <Icon icon="lucide:eye" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>
    </Layout>
  );
};