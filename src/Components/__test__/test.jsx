// _tests_/Administrador.test.jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Administrador from "../Administrador";
import API from "../Servicios/api";

// =========================
// 🔹 Mock de la API
// =========================
jest.mock("../Servicios/api", () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

// =========================
// 🔹 Datos simulados
// =========================
const usuariosMock = [
  { id: 1, nombre: "Juan", apellido: "Pérez", email: "juan@mail.com", rol: "estudiante", id_curso: "1" },
  { id: 2, nombre: "Ana", apellido: "Gómez", email: "ana@mail.com", rol: "personal", id_curso: "" },
];

const statsMock = { estudiantes: 1, personal: 1 };

// =========================
// 🔹 Tests
// =========================
describe("Administrador Component", () => {
  beforeEach(() => {
    API.get.mockImplementation((url) => {
      if (url === "/usuarios") return Promise.resolve({ data: usuariosMock });
      if (url === "/estadisticas") return Promise.resolve({ data: statsMock });
    });
    API.post.mockResolvedValue({ data: { id: 3, nombre: "Sofi", apellido: "Lopez", email: "sofi@mail.com", rol: "estudiante", id_curso: "2" } });
    API.put.mockResolvedValue({});
    API.delete.mockResolvedValue({});
  });

  test("Renderiza título y estadísticas", async () => {
    render(<Administrador />);
    expect(screen.getByText(/Panel de Administración/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("Estudiantes")).toBeInTheDocument();
      expect(screen.getByText("1")).toBeInTheDocument(); // statsMock.estudiantes
    });
  });

  test("Renderiza tabla de usuarios", async () => {
    render(<Administrador />);
    await waitFor(() => {
      expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
      expect(screen.getByText("Ana Gómez")).toBeInTheDocument();
    });
  });

  test("Formulario permite crear usuario", async () => {
    render(<Administrador />);
    const nombreInput = screen.getByPlaceholderText("Nombre");
    const apellidoInput = screen.getByPlaceholderText("Apellido");
    const emailInput = screen.getByPlaceholderText("Email");
    const rolSelect = screen.getByRole("combobox");

    fireEvent.change(nombreInput, { target: { value: "Sofi" } });
    fireEvent.change(apellidoInput, { target: { value: "Lopez" } });
    fireEvent.change(emailInput, { target: { value: "sofi@mail.com" } });
    fireEvent.change(rolSelect, { target: { value: "estudiante" } });

    const crearBtn = screen.getByText("Crear");
    fireEvent.click(crearBtn);

    await waitFor(() => {
      expect(screen.getByText("Sofi Lopez")).toBeInTheDocument();
    });
  });

  test("Botón eliminar llama a la API", async () => {
    render(<Administrador />);
    await waitFor(() => {
      const deleteBtn = screen.getAllByText("🗑")[0];
      fireEvent.click(deleteBtn);
      expect(API.delete).toHaveBeenCalled();
    });
  });

  test("Botón editar carga datos en formulario", async () => {
    render(<Administrador />);
    await waitFor(() => {
      const editBtn = screen.getAllByText("✏")[0];
      fireEvent.click(editBtn);
      const nombreInput = screen.getByPlaceholderText("Nombre");
      expect(nombreInput.value).toBe("Juan");
    });
  });
});