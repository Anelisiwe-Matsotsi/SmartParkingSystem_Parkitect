 {/* Material UI,2026*/}
 //(rudderz243,2026)
import React, { useEffect, useRef, useState } from "react";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";

import type { Ticket } from "../models/ticket";
import {
  getTickets,
  createTicket,
  uploadTicketImage,
} from "../services/api";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export const TicketsPage: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [activeTicket, setActiveTicket] = useState<number | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);

  const [parkingBay, setParkingBay] = useState("");
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const menuRef = useRef<HTMLDivElement | null>(null);

  // GET tickets from backend
  useEffect(() => {
    const loadTickets = async () => {
      try {
        setLoading(true);

        const data = await getTickets();

        setTickets(data);
      } catch (error) {
        console.error("Failed to load tickets", error);
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);

    setParkingBay("");
    setReason("");
    setDescription("");
    setSelectedImage(null);
  };

  // Accessible ticket menu
  const handleTicketMenu = (ticketID: number) => {
    setActiveTicket(
      activeTicket === ticketID ? null : ticketID
    );
  };

  // Close ticket menu when Escape is pressed
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveTicket(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Close ticket menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setActiveTicket(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle image selection
  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      setSelectedImage(file);
    }
  };

  // CREATE ticket
  const handleSubmit = async () => {
    if (!parkingBay) {
      alert("Please select a parking bay.");
      return;
    }

    if (!reason) {
      alert("Please select a violation.");
      return;
    }

    try {
      setLoading(true);

      let imageURL: string | null = null;

      // Upload image first if one was selected
      if (selectedImage) {
        imageURL = await uploadTicketImage(selectedImage);
      }

      const selectedBay = parkingBay;

      const newTicket: Ticket = {
        ticketID: 0,
        userID: "",
        bayID: selectedBay,
        bayNumber: selectedBay,
        sectionID: `${selectedBay.charAt(0)}-Block`,
        reason: reason,
        description: description || null,
        imageURL: imageURL,
        status: "Pending",
        createdAt: new Date().toISOString(),
        updatedAt: null,
        response: null,
      };

      const createdTicket = await createTicket(newTicket);

      setTickets((previousTickets) => [
        ...previousTickets,
        createdTicket,
      ]);

      handleClose();
    } catch (error) {
      console.error("Failed to create ticket", error);

      alert("Failed to create ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="page is-active"
      aria-labelledby="ticketsTitle"
    >

      <div className="page-heading">
        <div>
          <p className="eyebrow">Parking management</p>

          <h1 id="ticketsTitle">Tickets</h1>

          <p>
            View and manage parking tickets issued across campus.
          </p>
        </div>

        <button
          className="button primary"
          type="button"
          onClick={handleClickOpen}
        >
          Issue ticket
        </button>
      </div>


      <div className="project-grid">

        {loading && tickets.length === 0 && (
          <p role="status">
            Loading tickets...
          </p>
        )}

        {!loading && tickets.length === 0 && (
          <p role="status">
            No tickets have been issued yet.
          </p>
        )}

        {tickets.map((ticket) => (
          <article
            key={ticket.ticketID}
            className="project-card searchable"
            data-search={`parking ticket ${ticket.bayNumber} ${ticket.reason}`}
          >
            <div className="project-card-top">

              <span className="project-icon violet">
                <i
                  className="fa-solid fa-ticket"
                  aria-hidden="true"
                ></i>
              </span>

              <div
                className="ticket-menu"
                ref={
                  activeTicket === ticket.ticketID
                    ? menuRef
                    : null
                }
              >

                <button
                  type="button"
                  aria-label={`More options for ticket ${ticket.ticketID}`}
                  aria-expanded={
                    activeTicket === ticket.ticketID
                  }
                  aria-controls={
                    activeTicket === ticket.ticketID
                      ? `ticket-actions-${ticket.ticketID}`
                      : undefined
                  }
                  onClick={() =>
                    handleTicketMenu(ticket.ticketID)
                  }
                >
                  <i
                    className="fa-solid fa-ellipsis"
                    aria-hidden="true"
                  ></i>
                </button>

                {activeTicket === ticket.ticketID && (
                  <div
                    id={`ticket-actions-${ticket.ticketID}`}
                    className="ticket-actions"
                    role="menu"
                    aria-label={`Actions for ticket ${ticket.ticketID}`}
                  >
                    {/* Approve and Reject will be implemented by another team member */}

                    <button
                      type="button"
                      className="approve"
                      role="menuitem"
                    >
                      Approve
                    </button>

                    <button
                      type="button"
                      className="reject"
                      role="menuitem"
                    >
                      Reject
                    </button>
                  </div>
                )}

              </div>
            </div>

            <span
              className={`status ${
                ticket.status === "Pending"
                  ? "pending"
                  : ticket.status === "Resolved"
                    ? "success"
                    : "review"
              }`}
            >
              {ticket.status}
            </span>

            <h2>
              Parking Bay {ticket.bayNumber}
            </h2>

            <p>
              {ticket.reason}
            </p>

            {ticket.description && (
              <p>
                <span className="status review">
                  Description:
                </span>{" "}
                {ticket.description}
              </p>
            )}

            <div className="project-meta">
              <span>
                <small>Ticket ID</small>
                <strong>
                  #{ticket.ticketID}
                </strong>
              </span>

              <span>
                <small>Issued</small>
                <strong>
                  {new Date(ticket.createdAt).toLocaleTimeString(
                    [],
                    {
                      hour: "numeric",
                      minute: "2-digit",
                    }
                  )}
                </strong>
              </span>
            </div>

            <div className="project-footer">
              <div className="avatar-stack">
                <i>SG</i>
              </div>

              <strong>
                {new Date(ticket.createdAt).toLocaleDateString()}
              </strong>
            </div>

            <div className="progress-track">
              <span
                style={{
                  width:
                    ticket.status === "Resolved"
                      ? "100%"
                      : ticket.status === "Pending"
                        ? "0%"
                        : "50%",
                }}
              ></span>
            </div>

          </article>
        ))}

      </div>

      {/* Material UI,2026*/}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        aria-labelledby="create-ticket-title"
      >
        <DialogTitle id="create-ticket-title">
          Create Ticket
        </DialogTitle>

        <DialogContent>

          {/* PARKING BAY */}
          <FormControl fullWidth margin="normal">
            <FormLabel
              id="parking-bay-label"
              sx={{ mb: 1 }}
            >
              Parking Bay
            </FormLabel>

            <NativeSelect
              value={parkingBay}
              onChange={(event) =>
                setParkingBay(event.target.value)
              }
              inputProps={{
                name: "parkingBay",
                id: "parking-bay-select",
                "aria-labelledby": "parking-bay-label",
              }}
            >
              <option value="" disabled>
                Select a parking bay
              </option>

              <option value="A01">A01</option>
              <option value="A02">A02</option>
              <option value="A03">A03</option>

              <option value="B01">B01</option>
              <option value="B04">B04</option>
              <option value="B07">B07</option>
              <option value="B14">B14</option>

              <option value="C02">C02</option>
              <option value="C07">C07</option>

              <option value="D01">D01</option>
              <option value="D05">D05</option>
              <option value="D22">D22</option>
            </NativeSelect>
          </FormControl>


          {/* VIOLATION */}
          <FormControl margin="dense">
            <FormLabel id="violation-label">
              Violation
            </FormLabel>

            <RadioGroup
              aria-labelledby="violation-label"
              name="violation"
              value={reason}
              onChange={(event) =>
                setReason(event.target.value)
              }
            >
              <FormControlLabel
                value="Restricted parking"
                control={<Radio />}
                label="Restricted parking"
              />

              <FormControlLabel
                value="Incorrect bay"
                control={<Radio />}
                label="Incorrect bay"
              />

              <FormControlLabel
                value="Vehicle outside bay"
                control={<Radio />}
                label="Vehicle outside bay"
              />

              <FormControlLabel
                value="Other"
                control={<Radio />}
                label="Other"
              />
            </RadioGroup>
          </FormControl>


          {/* DESCRIPTION */}
          <TextField
            margin="dense"
            id="description"
            name="description"
            label="Description (optional)"
            multiline
            rows={4}
            fullWidth
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            placeholder="Add any additional information about the violation..."
          />


          {/* IMAGE UPLOAD */}
          <Button
            component="label"
            variant="outlined"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            sx={{ mt: 2 }}
          >
            Upload image (optional)

            <VisuallyHiddenInput
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>

          {selectedImage && (
            <p
              role="status"
              aria-live="polite"
            >
              Selected image: {selectedImage.name}
            </p>
          )}

        </DialogContent>


        <DialogActions>

          <Button
            className="login-button"
            type="button"
            onClick={handleClose}
          >
            Cancel
          </Button>

          <Button
            className="login-button"
            type="button"
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Creating..." : "Issue Ticket"}
          </Button>

        </DialogActions>

      </Dialog>

    </section>
  );
};

export default TicketsPage;



  {/*References
           realCAiN. 2024. Updated* Dashboard for sales, ect / Admin Dashboard. (Version 2.0) [Source code] Available at: < https://codepen.io/realCaiN/pen/yLdEzwv > [Accessed 16 Aug. 2026]. 
            Material UI.2026.Dialog. (Version 2.0) [Source code] . Available at: < https://mui.com/material-ui/react-dialog/#scrolling-long-content> [Accessed 12 Aug. 2026]. 
  rudderz243.2026. rudderz243/insy7314-library.  (Version 2.0) [Source code]. Available at: <https://github.com/rudderz243/insy7314-library> [Accessed 17 Aug. 2026].
           */}
 