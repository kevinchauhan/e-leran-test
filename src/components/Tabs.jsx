import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db, auth } from "../firebase/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, getDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const Tabs = () => {
  const [tabData, setTabData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTab, setEditingTab] = useState(null);
  const [newTab, setNewTab] = useState({
    title: "",
    color: "bg-blue-500",
  });
  const [user] = useAuthState(auth);
  const [userRole, setUserRole] = useState("student");

  // Fetch user role from users collection
  useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserRole(userData.role || "student");
          }
        } catch (err) {
          console.error("Failed to fetch user role:", err);
        }
      }
    };

    fetchUserRole();
  }, [user]);

  // Fetch Tabs
  useEffect(() => {
    const fetchTabs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "study_materials"));
        const tabsArray = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.role === "all" || userRole === "admin") {
            tabsArray.push({ id: doc.id, ...data });
          }
        });
        setTabData(tabsArray);
      } catch (error) {
        console.error("Error fetching tabs: ", error);
      }
    };

    if (userRole) fetchTabs();
  }, [showModal, userRole]);

  const handleAddOrUpdateTab = async () => {
    try {
      if (editingTab) {
        const tabRef = doc(db, "study_materials", editingTab.id);
        await updateDoc(tabRef, newTab);
        setTabData((prev) =>
          prev.map((t) => (t.id === editingTab.id ? { id: t.id, ...newTab } : t))
        );
      } else {
        const docRef = await addDoc(collection(db, "study_materials"), newTab);
        setTabData((prev) => [...prev, { id: docRef.id, ...newTab }]);
      }
      closeModal();
    } catch (err) {
      console.error("Failed to add/update tab:", err);
    }
  };

  const handleDeleteTab = async (id, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this tab?")) {
      try {
        const tabRef = doc(db, "study_materials", id);
        await deleteDoc(tabRef);
        setTabData(tabData.filter((tab) => tab.id !== id));
      } catch (err) {
        console.error("Failed to delete tab:", err);
      }
    }
  };

  const handleEditModalOpen = (tab, e) => {
    e.stopPropagation();
    setEditingTab(tab);
    setNewTab({
      title: tab.title,
      color: tab.color,
      role: tab.role,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setNewTab({ title: "", color: "bg-blue-500", link: "", role: "all" });
    setEditingTab(null);
  };

  return (
    <div className="p-4">
      {userRole === "admin" && (
        <div className="text-end">
          <button
            onClick={() => setShowModal(true)}
            className="mb-4 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
          >
            + Add
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {tabData.map((tab) => (
          <div
            key={tab.id}
            className={`relative rounded-xl shadow-lg hover:scale-105 transform transition duration-300 ${tab.color}`}
          >
            {userRole === "admin" && (
              <div className="absolute top-2 right-2 flex space-x-1 z-10">
                <button
                  onClick={(e) => handleEditModalOpen(tab, e)}
                  className="p-0.5 text-gray-800 hover:text-white rounded"
                  title="Edit"
                >
                  <FiEdit2 size={16} />
                </button>
                <button
                  onClick={(e) => handleDeleteTab(tab.id, e)}
                  className="p-0.5 text-gray-800 hover:text-white rounded"
                  title="Delete"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            )}

            <Link
              to={`/tab/${tab.id}`}
              className="block p-6 text-white text-center w-full h-full"
            >
              {tab.title}
            </Link>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg relative">
            <h2 className="text-xl font-semibold mb-4">
              {editingTab ? "Edit Study Material" : "Add New Study Material"}
            </h2>
            <input
              type="text"
              placeholder="Title"
              value={newTab.title}
              onChange={(e) => setNewTab({ ...newTab, title: e.target.value })}
              className="w-full mb-2 px-3 py-2 border rounded"
            />
            <select
              value={newTab.color}
              onChange={(e) => setNewTab({ ...newTab, color: e.target.value })}
              className="w-full mb-2 px-3 py-2 border rounded"
            >
              <option value="bg-blue-500">Blue</option>
              <option value="bg-green-500">Green</option>
              <option value="bg-red-500">Red</option>
              <option value="bg-purple-500">Purple</option>
              <option value="bg-orange-500">Orange</option>
              <option value="bg-gray-600">Gray</option>
              <option value="bg-teal-500">Teal</option>
            </select>
            <select
              value={newTab.role}
              onChange={(e) => setNewTab({ ...newTab, role: e.target.value })}
              className="w-full mb-4 px-3 py-2 border rounded"
            >
              <option value="all">All Users</option>
              <option value="admin">Admin Only</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-400 rounded hover:bg-gray-500 text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleAddOrUpdateTab}
                className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-white"
              >
                {editingTab ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tabs;
