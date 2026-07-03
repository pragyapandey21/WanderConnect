import { useState } from "react";
import axios from "axios";

const inputStyle = {
  width: "100%",
  padding: "13px 15px",
  marginBottom: 14,
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,.08)",
  background: "#222232",
  color: "white",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
};

export default function CreateGroupModal({
  open,
  onClose,
  destination,
  fetchGroups,
}) {
  const [newGroup, setNewGroup] = useState({
    groupName: "",
    description: "",
    startDate: "",
    endDate: "",
    maxMembers: 6,
  });

  const authHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const createGroup = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/groups",
        {
          ...newGroup,
          destination,
        },
        authHeaders()
      );

      fetchGroups();

      onClose();

      setNewGroup({
        groupName: "",
        description: "",
        startDate: "",
        endDate: "",
        maxMembers: 6,
      });

    } catch (err) {
      alert(err.response?.data?.message || "Failed to create group");
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,.55)",
          backdropFilter: "blur(6px)",
          zIndex: 999,
        }}
      />

      {/* Bottom Sheet */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 430,
          background: "#171726",
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          padding: 22,
          zIndex: 1000,
        }}
      >
        <div
          style={{
            width: 60,
            height: 6,
            background: "#555",
            borderRadius: 50,
            margin: "0 auto 18px",
          }}
        />

        <h2>Create Trip Group ✈️</h2>

        <input
          placeholder="Group Name"
          value={newGroup.groupName}
          onChange={(e) =>
            setNewGroup({
              ...newGroup,
              groupName: e.target.value,
            })
          }
          style={inputStyle}
        />

        <textarea
          placeholder="Description"
          value={newGroup.description}
          onChange={(e) =>
            setNewGroup({
              ...newGroup,
              description: e.target.value,
            })
          }
          style={{
            ...inputStyle,
            minHeight: 90,
            resize: "none",
          }}
        />

        <input
          type="date"
          value={newGroup.startDate}
          onChange={(e) =>
            setNewGroup({
              ...newGroup,
              startDate: e.target.value,
            })
          }
          style={inputStyle}
        />

        <input
          type="date"
          value={newGroup.endDate}
          onChange={(e) =>
            setNewGroup({
              ...newGroup,
              endDate: e.target.value,
            })
          }
          style={inputStyle}
        />

        <input
          type="number"
          value={newGroup.maxMembers}
          onChange={(e) =>
            setNewGroup({
              ...newGroup,
              maxMembers: e.target.value,
            })
          }
          style={inputStyle}
        />

        <button
          onClick={createGroup}
          style={{
            width: "100%",
            marginTop: 15,
            padding: 14,
            border: "none",
            borderRadius: 14,
            background:
              "linear-gradient(135deg,#8b5cf6,#ec4899)",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Create Group
        </button>
      </div>
    </>
  );
}