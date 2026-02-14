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
  Chip,
  Button,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useHistory } from "react-router-dom";
import { Layout } from "../components/layout";
import { useClients } from "../hooks/use-clients";
import { formatCurrency } from "../utils/format";
import { useWorks } from "../hooks/useWork";
import { formatDate } from "../utils/date";
import Loading from "../components/Loading";


export const Dashboard: React.FC = () => {
  const history = useHistory();

  const { clients } = useClients();
  const { works, loading } = useWorks();

  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortBy, setSortBy] = React.useState<"date" | "name" | "amount">("date");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("desc");

  // 🔹 Filtrado + orden
  const filteredWorks = React.useMemo(() => {
    let result = [...works];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(work => {
        const client = clients.find(c => c.id === work.clientId);
        return (
          work.workDescription.toLowerCase().includes(term) ||
          client?.name.toLowerCase().includes(term) ||
          client?.company?.toLowerCase().includes(term)
        );
      });
    }

    result.sort((a, b) => {
      let comparison = 0;

      if (sortBy === "date") {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      }

      if (sortBy === "name") {
        const clientA = clients.find(c => c.id === a.clientId)?.name || "";
        const clientB = clients.find(c => c.id === b.clientId)?.name || "";
        comparison = clientA.localeCompare(clientB);
      }

      if (sortBy === "amount") {
        comparison = a.budget.amount - b.budget.amount;
      }

      return sortDirection === "asc" ? comparison : -comparison;
    });

    return result;
  }, [works, clients, searchTerm, sortBy, sortDirection]);

  // 🔹 Métricas
  const totalEarnings = React.useMemo(
    () => works.reduce((sum, w) => sum + w.budget.amount, 0),
    [works]
  );

  const worksThisMonth = React.useMemo(() => {
    const now = new Date();
    return works.filter(work => {
      const d = new Date(work.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
  }, [works]);

  const handleSort = (column: "date" | "name" | "amount") => {
    if (sortBy === column) {
      setSortDirection(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortDirection("desc");
    }
  };

  if (loading) {
    return (
      <Loading />
    );
  }

  return (
    <Layout title="Dashboard">
      {/* MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card isPressable onPress={() => history.push("/clients")}>
          <CardBody className="flex items-center gap-4">
            <Icon icon="lucide:users" width={24} />
            <div className="flex flex-col items-center">
              <p className="text-small text-default-500">Clientes</p>
              <p className="text-xl font-semibold">{clients.length}</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center gap-4">
            <Icon icon="lucide:dollar-sign" width={24} />
            <div className="flex flex-col items-center">
              <p className="text-small text-default-500">Ganancias</p>
              <p className="text-xl font-semibold">
                {formatCurrency(totalEarnings)}
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex items-center gap-4">
            <Icon icon="lucide:calendar" width={24} />
            <div className="flex flex-col items-center">
              <p className="text-small text-default-500">Trabajos este mes</p>
              <p className="text-xl font-semibold">{worksThisMonth}</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* LISTA */}
      <Card>
        <CardBody>
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <Input
              placeholder="Buscar trabajos..."
              value={searchTerm}
              onValueChange={setSearchTerm}
              startContent={<Icon icon="lucide:search" />}
              className="w-full md:w-80"
            />

            <div className="flex gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="flat">
                    Ordenar por
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  <DropdownItem key="date" onPress={() => handleSort("date")}>
                    Fecha
                  </DropdownItem>
                  <DropdownItem key="name" onPress={() => handleSort("name")}>
                    Cliente
                  </DropdownItem>
                  <DropdownItem key="amount" onPress={() => handleSort("amount")}>
                    Monto
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>

              <Button
                color="primary"
                startContent={<Icon icon="lucide:plus" />}
                onPress={() => history.push("/work/new")}
              >
                Nuevo trabajo
              </Button>
            </div>
          </div>


          {filteredWorks.length === 0 ? (
            <p className="text-center text-default-500 py-10">
              No hay trabajos registrados
            </p>
          ) : (
            <Table removeWrapper>
              <TableHeader>
                <TableColumn>CLIENTE</TableColumn>
                <TableColumn>TRABAJO</TableColumn>
                <TableColumn>FECHA</TableColumn>
                <TableColumn>MONTO</TableColumn>
              </TableHeader>
              <TableBody>
                {filteredWorks.map(work => {
                  const client = clients.find(c => c.id === work.clientId);
                  return (
                    <TableRow
                      key={work.id}
                      className="cursor-pointer"
                      onClick={() => history.push(`/work/${work.id}`)}
                    >
                      <TableCell>
                        <p className="font-medium">{client?.name}</p>
                        <p className="text-small text-default-500">
                          {client?.company}
                        </p>
                      </TableCell>
                      <TableCell>{work.workDescription}</TableCell>
                      <TableCell>
                        <Chip size="sm">
                          {/* {new Date(work.date).toLocaleDateString()} */}
                          {formatDate(work.date)}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        {formatCurrency(work.budget.amount)}
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
