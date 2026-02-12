import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Page from "../page";

describe("Home Page", () => {
  it("renders my name on the page", () => {
    render(<Page />);
    const myName = screen.getByRole("heading", { name: /Nathan Pons/i });
    expect(myName).toBeInTheDocument();
  });

  it("renders the software engineer title", () => {
    render(<Page />);
    const title = screen.getAllByText(/Software Engineer/i);
    expect(title[0]).toHaveTextContent("Software Engineer");
  });

  it("renders the about me section", () => {
    render(<Page />);
    const aboutMe = screen.getByText(/full‑stack engineering/i);
    expect(aboutMe).toBeInTheDocument();
  });

  it("renders credentials heading", () => {
    render(<Page />);
    const credentials = screen.getByRole("heading", {
      name: /Credentials/i,
    });
    expect(credentials).toBeInTheDocument();
  });

  it("renders the correct number of certification list items", () => {
    render(<Page />);
    const certList = screen.getByTestId("cert-list");
    const certifications = certList.querySelectorAll("li");
    expect(certifications.length).toBeGreaterThan(1);
  });

  it("renders skills list", () => {
    render(<Page />);
    const skillsList = screen.getByTestId("skills-list");
    expect(skillsList).toBeInTheDocument();
  });

  it("renders programming languages list", () => {
    render(<Page />);
    const languagesList = screen.getByTestId("programming-languages-list");
    expect(languagesList).toBeInTheDocument();
  });

  it("renders correct number of skills", () => {
    render(<Page />);
    const skillsList = screen.getByTestId("skills-list");
    const skillItems = skillsList.querySelectorAll("li");
    expect(skillItems.length).toBeGreaterThan(1);
  });

  it("renders correct number of programming languages", () => {
    render(<Page />);
    const languagesList = screen.getByTestId("programming-languages-list");
    const languageItems = languagesList.querySelectorAll("li");
    expect(languageItems.length).toBeGreaterThan(1);
  });
});
