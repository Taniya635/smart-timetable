import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import TimetableGrid from "../components/TimetableGrid";
import ConflictPanel from "../components/ConflictPanel";
import StatsBar from "../components/StatsBar";
import CourseForm from "../components/CourseForm";
import ConstraintForm from "../components/ConstraintForm";
import RoomForm from "../components/RoomForm";
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getConstraints,
  updateConstraints,
  generateTimetable,
  getTimetable,
  getRooms,
  createRoom,
  deleteRoom,
  logout,
} from "../api/api";
import "../App.css";

export default function Dashboard() {
  const { user, onLogout, addToast } = useOutletContext();
  const [courses, setCourses] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [constraints, setConstraints] = useState(null);
  const [timetable, setTimetable] = useState(null);
  const [conflicts, setConflicts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [serverStatus, setServerStatus] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [showConstraintForm, setShowConstraintForm] = useState(false);
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Load data when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        const [coursesRes, constraintsRes, timetableRes, roomsRes] =
          await Promise.all([
            getCourses(),
            getConstraints(),
            getTimetable(),
            getRooms(),
          ]);
        setCourses(coursesRes.data);
        setConstraints(constraintsRes.data);
        setRooms(roomsRes.data);
        if (timetableRes.data.timetable) {
          setTimetable(timetableRes.data.timetable);
          setConflicts(timetableRes.data.conflicts || []);
          setSuggestions(timetableRes.data.suggestions || []);
        }
        setServerStatus(true);
      } catch {
        setServerStatus(false);
        addToast("Failed to load data", "error");
      }
    };
    loadData();
  }, [addToast]);

  useEffect(() => {
    if (!mobileOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // Ignore logout network errors
    }
    onLogout();
  };

  // Course CRUD
  const handleAddCourse = async (data) => {
    try {
      const res = await createCourse(data);
      setCourses((prev) => [res.data, ...prev]);
      setShowCourseForm(false);
      addToast(`Course "${data.name}" added!`);
    } catch (err) {
      addToast(err.response?.data?.error || "Failed to add course", "error");
    }
  };

  const handleEditCourse = async (data) => {
    try {
      const res = await updateCourse(editingCourse._id, data);
      setCourses((prev) =>
        prev.map((c) => (c._id === editingCourse._id ? res.data : c)),
      );
      setEditingCourse(null);
      addToast(`Course "${data.name}" updated!`);
    } catch (err) {
      addToast(err.response?.data?.error || "Failed to edit course", "error");
    }
  };

  const handleDeleteCourse = async (id) => {
    try {
      await deleteCourse(id);
      setCourses((prev) => prev.filter((c) => c._id !== id));
      addToast("Course deleted");
    } catch {
      addToast("Failed to delete course", "error");
    }
  };

  // Room CRUD
  const handleAddRoom = async (data) => {
    try {
      const res = await createRoom(data);
      setRooms((prev) => [...prev, res.data]);
      setShowRoomForm(false);
      addToast(`Room "${data.name}" added!`);
    } catch (err) {
      addToast(err.response?.data?.error || "Failed to add room", "error");
    }
  };

  const handleDeleteRoom = async (id) => {
    try {
      await deleteRoom(id);
      setRooms((prev) => prev.filter((r) => r._id !== id));
      addToast("Room deleted");
    } catch {
      addToast("Failed to delete room", "error");
    }
  };

  // Constraints
  const handleUpdateConstraints = async (data) => {
    try {
      const res = await updateConstraints(data);
      setConstraints(res.data);
      setShowConstraintForm(false);
      addToast("Constraints updated!");
    } catch (err) {
      addToast(
        err.response?.data?.error || "Failed to update constraints",
        "error",
      );
    }
  };

  // Generate timetable
  const handleGenerateTimetable = async () => {
    if (courses.length === 0) {
      addToast("Add at least one course first", "warning");
      return;
    }
    setIsGenerating(true);
    try {
      const res = await generateTimetable();
      setTimetable(res.data.timetable);
      setConflicts(res.data.conflicts || []);
      setSuggestions(res.data.suggestions || []);
      const placed = res.data.timetable?.length || 0;
      const unplaced = res.data.conflicts?.length || 0;
      if (unplaced > 0) {
        addToast(
          `Timetable generated — ${placed} placed, ${unplaced} unplaced`,
          "warning",
        );
      } else {
        addToast(`Timetable generated! ${placed} sessions placed`, "success");
        spawnConfetti();
      }
    } catch (err) {
      addToast(err.response?.data?.error || "Generation failed", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  // Export as PNG
  const handleExport = async () => {
    try {
      const { default: html2canvas } = await import("html2canvas");
      const el = document.getElementById("timetable-export-area");
      if (!el) return;
      const canvas = await html2canvas(el, {
        backgroundColor: "#f0f2f8",
        scale: 2,
      });
      const link = document.createElement("a");
      link.download = "timetable.png";
      link.href = canvas.toDataURL();
      link.click();
      addToast("Timetable exported as PNG!");
    } catch {
      addToast("Export failed", "error");
    }
  };

  // Confetti
  const spawnConfetti = () => {
    const colors = [
      "#6c5ce7",
      "#a855f7",
      "#00cec9",
      "#fdcb6e",
      "#ff6b6b",
      "#74b9ff",
    ];
    for (let i = 0; i < 30; i++) {
      const el = document.createElement("div");
      el.className = "confetti-piece";
      el.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      el.style.left = `${Math.random() * 100}vw`;
      el.style.top = `${40 + Math.random() * 30}vh`;
      el.style.animationDuration = `${0.8 + Math.random() * 0.6}s`;
      el.style.animationDelay = `${Math.random() * 0.4}s`;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 2000);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar
        courses={courses}
        rooms={rooms}
        onAddCourse={() => {
          setEditingCourse(null);
          setShowCourseForm(true);
        }}
        onEditCourse={(course) => {
          setEditingCourse(course);
          setShowCourseForm(true);
        }}
        onDeleteCourse={handleDeleteCourse}
        onAddRoom={() => setShowRoomForm(true)}
        onDeleteRoom={handleDeleteRoom}
        onGenerate={handleGenerateTimetable}
        onShowConstraints={() => setShowConstraintForm(true)}
        onExport={handleExport}
        isGenerating={isGenerating}
        hasTimetable={!!timetable}
        mobileOpen={mobileOpen}
        onToggleMobile={() => setMobileOpen(!mobileOpen)}
      />

      <div className="main-content">
        <Header
          serverStatus={serverStatus}
          user={user}
          onLogout={handleLogout}
        />

        {timetable && (
          <>
            <StatsBar
              timetable={timetable}
              conflicts={conflicts}
              suggestions={suggestions}
            />
            <TimetableGrid
              timetable={timetable}
              constraints={constraints}
              wrapperId="timetable-export-area"
              title={conflicts.length > 0 ? "Conflict-Free Timetable" : "Current Timetable"}
              subtitle={conflicts.length > 0 ? "Automatically replaced after conflict tracing" : undefined}
            />
            {conflicts.length > 0 && (
              <ConflictPanel conflicts={conflicts} suggestions={suggestions} />
            )}
          </>
        )}

        {showCourseForm && (
          <CourseForm
            course={editingCourse}
            onSubmit={editingCourse ? handleEditCourse : handleAddCourse}
            onClose={() => setShowCourseForm(false)}
          />
        )}

        {showConstraintForm && (
          <ConstraintForm
            constraints={constraints}
            onSubmit={handleUpdateConstraints}
            onClose={() => setShowConstraintForm(false)}
          />
        )}

        {showRoomForm && (
          <RoomForm
            room={null}
            onSubmit={handleAddRoom}
            onClose={() => setShowRoomForm(false)}
          />
        )}
      </div>
    </div>
  );
}
