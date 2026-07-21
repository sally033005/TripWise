import { render, screen } from "@testing-library/react";
import TripCard from "@/app/components/TripCard";
import { TripResponseDTO } from "@/types";

jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

const mockTrip: TripResponseDTO = {
  id: "trip-1",
  title: "Tokyo Adventure",
  description: "Cherry blossom season",
  destination: "Tokyo, Japan",
  startDate: "2026-08-01",
  endDate: "2026-08-10",
  creatorName: "alice",
  collaboratorNames: ["bob"],
  totalBudget: 3000,
  totalSpent: 500,
  spentByPerson: {},
  expenses: [],
  dailyItinerary: {},
  reservations: [],
};

describe("TripCard", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("username", "alice");
  });

  it("renders trip details", () => {
    render(
      <TripCard
        trip={mockTrip}
        onRefresh={jest.fn()}
        onEdit={jest.fn()}
      />,
    );

    expect(screen.getByText("Tokyo Adventure")).toBeInTheDocument();
    expect(screen.getByText(/Tokyo, Japan/)).toBeInTheDocument();
    expect(screen.getByText(/"Cherry blossom season"/)).toBeInTheDocument();
    expect(screen.getByText(/By alice/)).toBeInTheDocument();
  });

  it("links to the trip detail page", () => {
    render(
      <TripCard
        trip={mockTrip}
        onRefresh={jest.fn()}
        onEdit={jest.fn()}
      />,
    );

    expect(screen.getByRole("link")).toHaveAttribute("href", "/trips/trip-1");
  });
});
