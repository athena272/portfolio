import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderWithIntl } from "@/test/render";

import { ContactForm } from "./contact-form";
import type { SubmitContactResult } from "./submit-contact";

const validInput = {
  name: "Ana Souza",
  email: "ana@empresa.com",
  message: "Olá! Gostaria de conversar sobre uma vaga.",
};

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}

async function fillForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Nome"), validInput.name);
  await user.type(screen.getByLabelText("E-mail"), validInput.email);
  await user.type(screen.getByLabelText("Mensagem"), validInput.message);
}

describe("ContactForm", () => {
  it("shows translated validation errors, focuses the first invalid field and does not submit", async () => {
    const user = userEvent.setup();
    const submit = vi.fn();
    renderWithIntl(<ContactForm submit={submit} />);

    await user.type(screen.getByLabelText("E-mail"), "invalido");
    await user.click(screen.getByRole("button", { name: "Enviar mensagem" }));

    expect(submit).not.toHaveBeenCalled();
    expect(screen.getByText("Informe pelo menos 2 caracteres.")).toBeInTheDocument();
    expect(screen.getByText("Informe um e-mail válido.")).toBeInTheDocument();
    expect(screen.getByText("Escreva pelo menos 10 caracteres.")).toBeInTheDocument();

    const nameInput = screen.getByLabelText("Nome");
    expect(nameInput).toHaveFocus();
    expect(nameInput).toHaveAttribute("aria-invalid", "true");
    expect(nameInput).toHaveAccessibleDescription(
      "Informe pelo menos 2 caracteres. 0 de 100 caracteres",
    );
  });

  it("shows a character counter only on fields with a length limit", () => {
    renderWithIntl(<ContactForm submit={vi.fn()} />);

    expect(screen.getByText("0/100")).toBeInTheDocument();
    expect(screen.getByText("0/5000")).toBeInTheDocument();
    expect(screen.getByLabelText("E-mail")).not.toHaveAccessibleDescription();
  });

  it("updates the counter as the user types and reads it on focus", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ContactForm submit={vi.fn()} />);

    await user.type(screen.getByLabelText("Nome"), "Ana");

    expect(screen.getByText("3/100")).toBeInTheDocument();
    expect(screen.getByLabelText("Nome")).toHaveAccessibleDescription("3 de 100 caracteres");
  });

  it("stops at the limit and highlights the counter when it is reached", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ContactForm submit={vi.fn()} />);

    await user.click(screen.getByLabelText("Nome"));
    await user.paste("a".repeat(120));

    expect(screen.getByLabelText("Nome")).toHaveValue("a".repeat(100));
    expect(screen.getByText("100/100").closest("[data-tone]")).toHaveAttribute(
      "data-tone",
      "limit",
    );
  });

  it("clears a field error as soon as the user edits that field", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ContactForm submit={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Enviar mensagem" }));
    await user.type(screen.getByLabelText("Nome"), "A");

    expect(screen.queryByText("Informe pelo menos 2 caracteres.")).not.toBeInTheDocument();
    expect(screen.getByText("Informe um e-mail válido.")).toBeInTheDocument();
  });

  it("shows a loading state while sending and then the success message", async () => {
    const user = userEvent.setup();
    const pending = deferred<SubmitContactResult>();
    const submit = vi.fn(() => pending.promise);
    renderWithIntl(<ContactForm submit={submit} />);

    await fillForm(user);
    await user.click(screen.getByRole("button", { name: "Enviar mensagem" }));

    const submitButton = screen.getByRole("button", { name: "Enviando…" });
    expect(submitButton).toBeDisabled();
    expect(screen.getByLabelText("Nome")).toBeDisabled();
    expect(screen.getByRole("status")).toHaveTextContent("Enviando…");
    expect(submit).toHaveBeenCalledWith({ ...validInput, honeypot: "", locale: "pt" });

    pending.resolve({ ok: true });

    const heading = await screen.findByRole("heading", { name: "Mensagem enviada!" });
    expect(heading).toHaveFocus();
  });

  it("starts a clean form after choosing to send another message", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ContactForm submit={vi.fn().mockResolvedValue({ ok: true })} />);

    await fillForm(user);
    await user.click(screen.getByRole("button", { name: "Enviar mensagem" }));
    await user.click(await screen.findByRole("button", { name: "Enviar outra mensagem" }));

    expect(screen.getByLabelText("Nome")).toHaveValue("");
    expect(screen.getByLabelText("Mensagem")).toHaveValue("");
    expect(screen.getByText("0/100")).toBeInTheDocument();
    expect(screen.getByText("0/5000")).toBeInTheDocument();
  });

  it("keeps what the user typed, and its count, when sending fails and lets them retry", async () => {
    const user = userEvent.setup();
    const submit = vi
      .fn<() => Promise<SubmitContactResult>>()
      .mockResolvedValueOnce({ ok: false, reason: "timeout" })
      .mockResolvedValueOnce({ ok: true });
    renderWithIntl(<ContactForm submit={submit} />);

    await fillForm(user);
    await user.click(screen.getByRole("button", { name: "Enviar mensagem" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "O envio demorou demais. Verifique sua conexão e tente novamente.",
    );
    expect(screen.getByLabelText("Nome")).toHaveValue(validInput.name);
    expect(screen.getByLabelText("Mensagem")).toHaveValue(validInput.message);
    expect(screen.getByText(`${validInput.message.length}/5000`)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Tentar novamente" }));

    expect(await screen.findByRole("heading", { name: "Mensagem enviada!" })).toBeInTheDocument();
    expect(submit).toHaveBeenCalledTimes(2);
  });

  it("recovers to an error state if the submit function throws unexpectedly", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ContactForm submit={vi.fn().mockRejectedValue(new Error("boom"))} />);

    await fillForm(user);
    await user.click(screen.getByRole("button", { name: "Enviar mensagem" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Não foi possível conectar.");
    expect(screen.getByRole("button", { name: "Enviar mensagem" })).toBeEnabled();
  });

  it("sends only once when the form is submitted repeatedly", async () => {
    const user = userEvent.setup();
    const pending = deferred<SubmitContactResult>();
    const submit = vi.fn(() => pending.promise);
    renderWithIntl(<ContactForm submit={submit} />);

    await fillForm(user);
    const form = screen.getByRole("button", { name: "Enviar mensagem" }).closest("form");
    form?.requestSubmit();
    form?.requestSubmit();

    await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
    pending.resolve({ ok: true });
    await screen.findByRole("heading", { name: "Mensagem enviada!" });
  });

  it("renders in English", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ContactForm submit={vi.fn()} />, { locale: "en" });

    await user.click(screen.getByRole("button", { name: "Send message" }));
    expect(screen.getByText("Please enter at least 2 characters.")).toBeInTheDocument();
  });

  it("sends the language of the page along with the message", async () => {
    const user = userEvent.setup();
    const submit = vi.fn().mockResolvedValue({ ok: true });
    renderWithIntl(<ContactForm submit={submit} />, { locale: "en" });

    await user.type(screen.getByLabelText("Name"), validInput.name);
    await user.type(screen.getByLabelText("Email"), validInput.email);
    await user.type(screen.getByLabelText("Message"), validInput.message);
    await user.click(screen.getByRole("button", { name: "Send message" }));

    await waitFor(() =>
      expect(submit).toHaveBeenCalledWith({ ...validInput, honeypot: "", locale: "en" }),
    );
  });
});
