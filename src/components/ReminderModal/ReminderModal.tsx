import moment from "moment";
import "./ReminderModal.scss";
import { CircleX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useClickOutside } from "../../hooks/useClickOutside";
import { CalendarEvent } from "../../types/CalendarEventsType";

type ReminderModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  reminder: CalendarEvent;
  setReminder: React.Dispatch<React.SetStateAction<CalendarEvent>>;
  onDiscard?: () => void;
  mode: "create" | "edit";
  position: { x: number; y: number } | null;
};

export const ReminderModal: React.FC<ReminderModalProps> = ({
  isOpen,
  onClose,
  onSave,
  reminder,
  setReminder,
  onDiscard,
  mode,
  position,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useClickOutside(modalRef, onClose);
  const modalStyle: React.CSSProperties = {
    borderRadius: "10px",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };

  const [openUpwards, setOpenUpwards] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (position && modalRef.current) {
      const modalHeight = modalRef.current.offsetHeight;
      const spaceBelow = window.innerHeight - position.y;

      if (spaceBelow < modalHeight + 20) {
        setOpenUpwards(true);
      } else {
        setOpenUpwards(false);
      }
    }
  }, [position, isOpen]);

  if (position) {
    if (openUpwards) {
      modalStyle.top = `${position.y - 10}px`;
      modalStyle.transform = "translate(-50%, -100%)";
    } else {
      modalStyle.top = `${position.y + 10}px`;
      modalStyle.transform = "translate(-50%, 0)";
    }
    modalStyle.left = `${position.x}px`;
  }

  if (!isOpen) return null;

  const handleSave = () => {
    if (!reminder.title) {
      setError("Event title is required.");
      return;
    }
    setError(null); 
    onSave();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setReminder({ ...reminder, [name]: value });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setReminder({ ...reminder, [name]: value });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value);
    const updatedStart = new Date(reminder.start);
    updatedStart.setFullYear(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate()
    );
    const updatedEnd = new Date(updatedStart.getTime());
    setReminder({ ...reminder, start: updatedStart, end: updatedEnd });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(":");
    const updatedStart = new Date(reminder.start);
    updatedStart.setHours(parseInt(hours, 10));
    updatedStart.setMinutes(parseInt(minutes, 10));
    const updatedEnd = new Date(updatedStart.getTime());
    setReminder({ ...reminder, start: updatedStart, end: updatedEnd });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReminder({ ...reminder, color: e.target.value });
  };

  const stopPropagation = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <div
      ref={modalRef}
      className="reminder-modal flex flex-col gap-10 text-[#6A6996] fixed w-1/5 max-w-72 top-1/2 left-1/2 p-6 bg-white p-5 border border-[#43425D] z-50 shadow-xl"
      style={modalStyle}
      onClick={stopPropagation}
      onMouseDown={stopPropagation}
    >
      {!openUpwards ? (
        <div className="arrow-up absolute top-[-10px] left-1/2 transform -translate-x-1/2" />
      ) : (
        <div className="arrow-down absolute bottom-[-10px] left-1/2 transform -translate-x-1/2" />
      )}
      <div className="flex flex-col gap-5 text-[#D6D6D6]">
        <label className={`${error ? 'border-red-600' : 'border-[#D6D6D6]'} border-b flex flex-col`}>
          <span className={`${error && 'text-red-600'} text-[11px] leading-5`}>event name</span>
          <input
            type="text"
            name="title"
            value={reminder.title}
            onChange={handleInputChange}
            maxLength={30}
          />
        </label>
        <label className="border-b border-[#D6D6D6] flex flex-col">
          <span className="text-[11px] leading-5">event data</span>
          <input
            type="date"
            name="start"
            value={moment(reminder.start).format("YYYY-MM-DD")}
            onChange={handleDateChange}
          />
        </label>
        <label className="border-b border-[#D6D6D6] flex flex-col">
          <span className="text-[11px] leading-5">event time</span>
          <input
            type="time"
            name="start"
            value={moment(reminder.start).format("HH:mm")}
            onChange={handleTimeChange}
          />
        </label>
        <label className="flex justify-between">
          <span className="text-[11px] leading-5">event color</span>
          <span
            className="w-6 h-6 rounded-full"
            style={{ backgroundColor: reminder.color }}
          />
          <input
            type="color"
            value={reminder.color}
            onChange={handleColorChange}
            className="opacity-0 absolute cursor-pointer "
          />
        </label>
        <label className="border-b border-[#D6D6D6] flex flex-col">
          <span className="text-[11px] leading-5">notes</span>
          <input
            type="text"
            name="description"
            value={reminder.description}
            onChange={handleDescriptionChange}
            maxLength={100}
          />
        </label>
      </div>
      <div className="flex justify-between">
        <button
          className={`${mode !== "create" ? "uppercase" : ""} text-red-600`}
          onClick={mode === "create" ? onClose : onDiscard}
        >
          {mode === "create" ? "Cancel" : "Discard"}
        </button>
        <button
          className={`${mode !== "create" ? "uppercase" : ""}`}
          onClick={handleSave}
        >
          {mode === "create" ? "Save" : "Edit"}
        </button>
      </div>
      <button
        className="text-[#D6D6D6] absolute top-2 right-2"
        onClick={onClose}
      >
        <CircleX />
      </button>
    </div>
  );
};
