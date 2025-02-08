import React from "react";
import ReactDOMClient from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChakraProvider} from "@chakra-ui/react";
import { Cadastro } from "./screens/Cadastro";
import { Login } from "./screens/Login";
import { Esqueci } from "./screens/Esqueci";
import { Contato } from "./screens/Contato";
import { Eventos } from "./screens/Eventos";
import { CadastroPromoters } from "./screens/CadastroPromoters";
import { Configuracao } from "./screens/Configuracao";
import { CriacaoEvento } from "./screens/CriacaoEvento";
import { AprovarPromoter } from "./screens/AprovarPromoter";
import { Admin } from "./screens/Admin";
import { ConfirmarPresenca } from "./screens/ConfirmarPresenca";
import { ConfirmarAniversario } from "./screens/ConfirmarAniversario";
import { Clientes } from "./screens/Clientes";
import { LoginPromoter } from "./screens/LoginPromoter";
import { EventoRelatorio } from "./screens/EventoRelatorio";
import { RelatorioInfoEvento } from "./screens/RelatorioInfoEvento";
import { ConfiguracaoAdmin } from "./screens/ConfiguracaoAdmin";
import { ModalTicket } from "./components/ModalTicket";
import { RelatorioPromoter } from "./screens/RelatorioPromoter";
import { Saldo } from "./screens/Saldo";
import { Principal } from "./screens/Principal";
import { Precos } from "./screens/Precos";
import { LoginAdmin } from "./screens/LoginAdmin";
import { SolicitacaoSaque } from "./screens/SolicitacaoSaque";
import { RelatorioAdmin } from "./screens/RelatorioAdmin";
import { Sobrenos } from "./screens/Sobrenos";
import { Promoter } from "./screens/Promoters";
import { ClientesAdmin } from "./screens/ClientesAdmin";
import { Pagamentos } from "./screens/Pagamentos";
import { PaginaPrincipal } from "./screens/PaginaPrincipal";
import { VerEventos } from "./screens/VerEventos";
import { EditarEvento } from "./screens/EditarEvento";
import { AuthProvider } from "./AuthContext";
import { ProtectedRoute } from "./ProtectedRoute";
import { ProtectedRouteAdmin } from "./ProtectedRouteAdmin";
import { Recuperar } from "./screens/Recuperar";
import ErrorBoundary from "./ErroBoundary";
import { ThemeProvider } from "./ThemeContext";
import { Helmet } from "react-helmet";

const app = document.getElementById("app");

if (!app) {
    throw new Error('Elemento com id "app" não encontrado no DOM.');
}

const root = ReactDOMClient.createRoot(app);


root.render(
  <ErrorBoundary>
     <ChakraProvider>
      <ThemeProvider>
        <Router>
          <AuthProvider>
            <Routes>
              <Route
                path="/eventos"
                element={
                  <>
                    <Helmet>
                      <title>Lista de Eventos - ListaVip</title>
                    </Helmet>
                    <ProtectedRoute requiredRoles={['ceo', 'mod', 'rec']}>
                      <Eventos />
                    </ProtectedRoute>
                  </>
                }
              />
              <Route
                path="/configuracao"
                element={
                  <>
                    <Helmet>
                      <title>Configurações - ListaVip</title>
                    </Helmet>
                    <ProtectedRoute requiredRoles={['ceo', 'mod', 'rec']}>
                      <Configuracao />
                    </ProtectedRoute>
                  </>
                }
              />
              <Route
                path="/eventos/criar"
                element={
                  <>
                    <Helmet>
                      <title>Criar Evento - ListaVip</title>
                    </Helmet>
                    <ProtectedRoute requiredRoles={['ceo', 'mod']}>
                      <CriacaoEvento />
                    </ProtectedRoute>
                  </>
                }
              />
              <Route
                path="/eventos/editar/:id"
                element={
                  <>
                    <Helmet>
                      <title>Editar Evento - ListaVip</title>
                    </Helmet>
                    <ProtectedRoute requiredRoles={['ceo', 'mod']}>
                      <EditarEvento />
                    </ProtectedRoute>
                  </>
                }
              />F
              <Route
                path="/eventos/detalhes/:id"
                element={
                  <>
                    <Helmet>
                      <title>Detalhes do Evento - ListaVip</title>
                    </Helmet>
                    <ProtectedRoute requiredRoles={['ceo', 'mod', 'rec']}>
                      <EventoRelatorio />
                    </ProtectedRoute>
                  </>
                }
              />
              <Route
                path="/eventos/relatorio/:id"
                element={
                  <>
                    <Helmet>
                      <title>Relatório do Evento - ListaVip</title>
                    </Helmet>
                    <ProtectedRoute requiredRoles={['ceo', 'mod']}>
                      <RelatorioInfoEvento />
                    </ProtectedRoute>
                  </>
                }
              />
              <Route
                path="/admin"
                element={
                  <>
                    <Helmet>
                      <title>Lista de Funcionarios - ListaVip</title>
                    </Helmet>
                    <ProtectedRoute requiredRoles={['ceo', 'mod']}>
                      <Admin />
                    </ProtectedRoute>
                  </>
                }
              />
              <Route
                path="/clientes"
                element={
                  <>
                    <Helmet>
                      <title>Lista de Clientes - ListaVip</title>
                    </Helmet>
                    <ProtectedRoute requiredRoles={['ceo', 'mod', 'rec']}>
                      <Clientes />
                    </ProtectedRoute>
                  </>
                }
              />
              <Route
                path="/promoters/aprovar"
                element={
                  <>
                    <Helmet>
                      <title>Aprovar Promoters - ListaVip</title>
                    </Helmet>
                    <ProtectedRoute requiredRoles={['ceo', 'mod']}>
                      <AprovarPromoter />
                    </ProtectedRoute>
                  </>
                }
              />
              <Route
                path="/promoters/relatorio/:id"
                element={
                  <>
                    <Helmet>
                      <title>Relatorio do Promoter - ListaVip</title>
                    </Helmet>
                    <ProtectedRoute requiredRoles={['ceo', 'mod', 'rec', 'promoter']}>
                      <RelatorioPromoter />
                    </ProtectedRoute>
                  </>
                }
              />
              <Route
                path="/saldo"
                element={
                  <>
                    <Helmet>
                      <title>Saldo - ListaVip</title>
                    </Helmet>
                    <ProtectedRoute requiredRoles={['ceo']}>
                      <Saldo />
                    </ProtectedRoute>
                  </>
                }
              />
              <Route
                path="/promoters"
                element={
                  <>
                    <Helmet>
                      <title>Lista de Promoters - ListaVip</title>
                    </Helmet>
                    <ProtectedRoute requiredRoles={['ceo', 'mod']}>
                      <Promoter />
                    </ProtectedRoute>
                  </>
                }
              />
              <Route path="/eventos/:nomefantasia" element={<><Helmet><title>Eventos da Semana</title> </Helmet><ConfirmarPresenca /></>} />
              <Route path="/convite/:id" element={<><Helmet><title>Eventos da Semana</title> </Helmet> <ConfirmarPresenca /></>} />
              <Route path="/eventos/:nomefantasia/:token" element={<><Helmet><title>Eventos da Semana</title> </Helmet><ConfirmarPresenca /> </>} />
              <Route path="/eventos/:nomefantasia/aniversario/:token" element={<><Helmet><title>Aniversário da Semana</title> </Helmet><ConfirmarAniversario /></>} />
              <Route path="/login" element={<><Helmet><title>Login - ListaVip</title> </Helmet><Login /> </>} />
              <Route path="/login-admin" element={<><Helmet><title>Login Administrador - ListaVip</title> </Helmet><LoginAdmin /></>} />
              <Route path="/login/promoter/:nomefantasia" element={<><Helmet><title>Login Promoter - ListaVip</title> </Helmet><LoginPromoter /></>} />
              <Route path="/cadastro" element={<><Helmet><title>Cadastro - ListaVip</title> </Helmet><Cadastro /></>} />
              <Route path="/cadastro/promoter/:nomefantasia" element={<><Helmet><title>Cadastro Promoter - ListaVip</title> </Helmet><CadastroPromoters /></>} />
              <Route path="/recuperar" element={<><Helmet><title>Recuperar Senha - ListaVip</title> </Helmet><Recuperar /></>} />
              <Route path="/" element={<><Helmet><title>Início - ListaVip</title> </Helmet><PaginaPrincipal /></>} />
              <Route path="/contato" element={<><Helmet><title>Contato - ListaVip</title> </Helmet><Contato /></>} />
              <Route path="/planos" element={<><Helmet><title>Planos - ListaVip</title> </Helmet><Precos /></>} />
              <Route path="/pagamento" element={<><Helmet><title>Pagamento - ListaVip</title> </Helmet><Pagamentos /></>} />
              <Route path="/sobre" element={<><Helmet><title>Sobre Nós - ListaVip</title> </Helmet><Sobrenos /></>} />
              <Route path="/esqueci-senha/:token" element={<><Helmet><title>Recuperar Senha - ListaVip</title> </Helmet><Esqueci /></>} />

              <Route
                path="/saque-requests"
                element={
                  <ProtectedRouteAdmin>
                    <SolicitacaoSaque />
                  </ProtectedRouteAdmin>
                }
              />
              <Route
                path="/clientes-admin"
                element={
                  <ProtectedRouteAdmin>
                    <ClientesAdmin />
                  </ProtectedRouteAdmin>
                }
              />
              <Route
                path="/relatorios"
                element={
                  <ProtectedRouteAdmin>
                    <RelatorioAdmin />
                  </ProtectedRouteAdmin>
                }
              />
              <Route
                path="/ver-eventos"
                element={
                  <ProtectedRouteAdmin>
                    <VerEventos />
                  </ProtectedRouteAdmin>
                }
              />
              <Route
                path="/configuracao-admin"
                element={
                  <ProtectedRouteAdmin>
                    <ConfiguracaoAdmin />
                  </ProtectedRouteAdmin>
                }
              />
            </Routes>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </ChakraProvider>
  </ErrorBoundary>
);
