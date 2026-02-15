import React from "react";
import { Card, CardBody, Input, Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useAuth } from "../hooks/use-auth";
import { useHistory } from "react-router-dom";
import { addToast } from "@heroui/react";


export const LoginPage: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const { login, credentialError } = useAuth();
  const history = useHistory();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      console.log(success);

      if (success) {
        addToast({
          title: "Bienvenido",
          color: "success",
        });
        history.push("/dashboard");
      } else {
        addToast({
          title: credentialError || "Credenciales inválidas",
          color: "danger",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardBody className="flex flex-col gap-6 p-8">
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="rounded-full bg-primary/10 p-4 mb-2">
              <Icon
                icon="lucide:briefcase"
                className="text-primary"
                width={32}
                height={32}
              />
            </div>
            <h1 className="text-2xl font-bold">Gestión de Clientes</h1>
            <p className="text-default-500">
              Inicia sesión para acceder a tu cuenta
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <Input
              label="Correo electrónico"
              placeholder="Ingresa tu correo electrónico"
              type="email"
              value={email}
              onValueChange={setEmail}
              startContent={
                <Icon icon="lucide:mail" className="text-default-400" />
              }
              isRequired
            />

            <Input
              label="Contraseña"
              placeholder="Ingresa tu contraseña"
              type={showPassword ? "text" : "password"}
              value={password}
              onValueChange={setPassword}
              startContent={
                <Icon icon="lucide:lock" className="text-default-400" />
              }
              endContent={
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="focus:outline-none"
                >
                  <Icon
                    icon={showPassword ? "lucide:eye-off" : "lucide:eye"}
                    className="text-default-400 hover:text-default-500 transition-colors"
                  />
                </button>
              }
              isRequired
            />

            <Button
              type="submit"
              color="primary"
              className="mt-2"
              fullWidth
              isLoading={isLoading}
            >
              Iniciar sesión
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};
