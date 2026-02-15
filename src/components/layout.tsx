import React from "react";
import {
  Link,
  useHistory,
  useLocation,
} from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useAuth } from "../hooks/use-auth";

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  title,
}) => {
  const { logout, user } = useAuth();
  const history = useHistory();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    history.push("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar maxWidth="2xl" className="border-b border-divider">
        <NavbarBrand>
          <Link to="/dashboard" className="flex items-center gap-2">
            <Icon
              icon="lucide:briefcase"
              width={24}
              height={24}
              className="text-primary"
            />
            <p className="font-bold text-inherit">
              Gestión de Clientes
            </p>
          </Link>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  as="button"
                  className="transition-transform"
                  color="primary"
                  name={user?.email ?? "Usuario"}
                  size="sm"
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Acciones de usuario">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-semibold">
                    {user?.email}
                  </p>
                  <p className="text-sm text-default-500">
                    Usuario autenticado
                  </p>
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  onPress={handleLogout}
                >
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:log-out" />
                    <span>Cerrar sesión</span>
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        </NavbarContent>
      </Navbar>

      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{title}</h1>
          {location.pathname === "/dashboard" && (
            <Button
              color="primary"
              onPress={() => history.push("/client/new")}
              startContent={<Icon icon="lucide:plus" />}
            >
              Nuevo Cliente
            </Button>
          )}
          {location.pathname !== "/dashboard" && (
            <Button
              variant="flat"
              color="default"
              onPress={() => history.push("/dashboard")}
              startContent={<Icon icon="lucide:arrow-left" />}
            >
              Volver
            </Button>
          )}
        </div>
        {children}
      </div>

      <footer className="py-4 px-6 border-t border-divider">
        <div className="container mx-auto text-center text-default-500 text-sm">
          © {new Date().getFullYear()} Gestión de Clientes y Ganancias por
          <a
            href="https://kevinjoelnoviello.vercel.app/"
            target="_blank"
            className="text-primary hover:underline mx-1"
            rel="noreferrer"
          >
            Kevin Joel Noviello
          </a>
          . Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
};
