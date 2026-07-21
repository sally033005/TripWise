import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Home from "@/app/page";
import { tripService } from "../../services/api";
import { TripResponseDTO } from "@/types";

jest.mock("../../services/api", () => ({
  tripService: {
    getAllTrips: jest.fn(),
  },
  FILE_BASE_URL: "http://localhost:8080",
}));

jest.mock("../../app/components/TripCard", () => {
  return function MockTripCard({
    trip,
    isPast,
    onEdit,
  }: {
    trip: TripResponseDTO;
    isPast?: boolean;
    onEdit: (trip: TripResponseDTO) => void;
  }) {
    return (
      <div data-testid={isPast ? "past-trip" : "upcoming-trip"}>
        <span>{trip.title}</span>
        <button type="button" onClick={() => onEdit(trip)}>
          Edit {trip.title}
        </button>
      </div>
    );
  };
});

jest.mock("../../app/components/CreateTripModal", () => {
  return function MockCreateTripModal({ isOpen }: { isOpen: boolean }) {
    return isOpen ? <div data-testid="create-trip-modal">Create Trip Modal</div> : null;
  };
});

jest.mock("../../app/components/EditTripModal", () => {
  return function MockEditTripModal({
    isOpen,
    trip,
  }: {
    isOpen: boolean;
    trip: TripResponseDTO;
  }) {
    return isOpen ? (
      <div data-testid="edit-trip-modal">Edit Trip Modal: {trip.title}</div>
    ) : null;
  };
});

const mockGetAllTrips = tripService.getAllTrips as jest.MockedFunction<
  typeof tripService.getAllTrips
>;

const createTrip = (overrides: Partial<TripResponseDTO> = {}): TripResponseDTO => ({
  id: "trip-1",
  title: "Tokyo Adventure",
  description: "Cherry blossom season",
  destination: "Tokyo, Japan",
  startDate: "2026-08-01",
  endDate: "2026-08-10",
  creatorName: "alice",
  collaboratorNames: [],
  totalBudget: 3000,
  totalSpent: 500,
  spentByPerson: {},
  expenses: [],
  dailyItinerary: {},
  reservations: [],
  ...overrides,
});

describe("Home page", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-07-20T12:00:00.000Z"));
    mockGetAllTrips.mockReset();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders the page header", async () => {
    mockGetAllTrips.mockResolvedValue([]);

    render(<Home />);

    expect(screen.getByRole("heading", { name: "My Travels" })).toBeInTheDocument();
    expect(screen.getByText("Plan your next adventure together")).toBeInTheDocument();

    await waitFor(() => {
      expect(mockGetAllTrips).toHaveBeenCalledTimes(1);
    });
  });

  it("shows empty state when there are no upcoming trips", async () => {
    mockGetAllTrips.mockResolvedValue([]);

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("No upcoming trips yet ✈️")).toBeInTheDocument();
    });

    expect(screen.getByText("0 Active")).toBeInTheDocument();
    expect(screen.getByText("0 Completed")).toBeInTheDocument();
  });

  it("displays upcoming and past trips in separate sections", async () => {
    mockGetAllTrips.mockResolvedValue([
      createTrip({ id: "upcoming-1", title: "Future Trip", endDate: "2026-12-31" }),
      createTrip({ id: "past-1", title: "Past Trip", endDate: "2026-06-01" }),
    ]);

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("Future Trip")).toBeInTheDocument();
    });

    expect(screen.getByText("Past Trip")).toBeInTheDocument();
    expect(screen.getAllByTestId("upcoming-trip")).toHaveLength(1);
    expect(screen.getAllByTestId("past-trip")).toHaveLength(1);
    expect(screen.getByText("1 Active")).toBeInTheDocument();
    expect(screen.getByText("1 Completed")).toBeInTheDocument();
  });

  it("opens the create trip modal when New Trip is clicked", async () => {
    mockGetAllTrips.mockResolvedValue([]);

    render(<Home />);

    await waitFor(() => {
      expect(mockGetAllTrips).toHaveBeenCalled();
    });

    expect(screen.queryByTestId("create-trip-modal")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /new trip/i }));

    expect(screen.getByTestId("create-trip-modal")).toBeInTheDocument();
  });

  it("opens the edit trip modal when a trip edit action is triggered", async () => {
    mockGetAllTrips.mockResolvedValue([
      createTrip({ id: "upcoming-1", title: "Future Trip", endDate: "2026-12-31" }),
    ]);

    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText("Future Trip")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: "Edit Future Trip" }));

    expect(screen.getByTestId("edit-trip-modal")).toHaveTextContent(
      "Edit Trip Modal: Future Trip",
    );
  });

  it("logs an error when fetching trips fails", async () => {
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
    mockGetAllTrips.mockRejectedValue(new Error("Network error"));

    render(<Home />);

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(
        "Error fetching trips:",
        expect.any(Error),
      );
    });

    consoleError.mockRestore();
  });
});
