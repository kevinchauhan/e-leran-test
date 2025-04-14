import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage, auth } from "../firebase/firebase";
import UploadModal from "../components/UploadModel";
import ReactPlayer from "react-player";
import { useAuthState } from "react-firebase-hooks/auth";
import Spinner from "../components/Spinner";

const TabDetails = () => {
  const { tabId } = useParams();
  const [data, setData] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [user] = useAuthState(auth);
  const [role, setRole] = useState(null);

  const isAdmin = role === "admin";

  useEffect(() => {
    const fetchTab = async () => {
      const refDoc = doc(db, "study_materials", tabId);
      const snap = await getDoc(refDoc);
      if (snap.exists()) {
        setData(snap.data());
      } else {
        setData("notfound");
      }
    };

    const fetchUserRole = async () => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setRole(userDocSnap.data().role);
        }
      }
    };

    fetchTab();
    fetchUserRole();
  }, [tabId, user]);

  const deleteFile = async (tabId, type, fileUrl) => {
    const fileRef = ref(storage, decodeURIComponent(new URL(fileUrl).pathname.slice(1)));
    try {
      await deleteObject(fileRef);
      const docRef = doc(db, "study_materials", tabId);
      await updateDoc(docRef, {
        [type]: arrayRemove(fileUrl),
      });
      window.location.reload();
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  if (data === "notfound") {
    return <div className="p-4 text-center text-red-600">No Data Found!</div>;
  }

  if (!data) {
    return <Spinner />
  }

  return (
    <div className="p-6">
      <div className="text-sm text-gray-500 mb-2">
        <Link to="/" className="hover:underline text-blue-600">Home</Link> /{" "}
        <span className="text-gray-700">{data.title}</span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-3xl font-bold text-gray-800">{data.title}</h2>
        {isAdmin && (
          <button
            className="bg-purple-500 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-600"
            onClick={() => setShowUploadModal(true)}
          >
            Upload File
          </button>
        )}
      </div>

      {/* Videos */}
      {data.videos?.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Videos</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.videos.map((video, idx) => (
              <div key={idx} className="bg-white rounded-xl p-4 shadow border relative">
                <ReactPlayer url={video} controls width="100%" />
                {isAdmin && (
                  <button
                    onClick={() => deleteFile(tabId, "videos", video)}
                    className="absolute top-2 right-2 text-gray-800 p-1 rounded hover:bg-red-600"
                  >
                    X
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PDFs */}
      {data.pdfs?.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">PDFs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.pdfs.map((pdf, idx) => (
              <div key={idx} className="bg-white rounded-xl p-4 shadow border relative">
                <p className="text-sm font-medium text-gray-700 mb-2">PDF {idx + 1}</p>
                <a href={pdf} target="_blank" rel="noreferrer">
                  <img
                    src={pdf}
                    alt={`PDF ${idx + 1}`}
                    className="w-full h-64 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                  />
                </a>
                {isAdmin && (
                  <button
                    onClick={() => deleteFile(tabId, "pdfs", pdf)}
                    className="absolute top-2 right-2 text-gray-800 p-1 rounded hover:bg-red-600"
                  >
                    X
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Images */}
      {data.images?.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Images</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.images.map((img, idx) => (
              <div key={idx} className="relative rounded-xl overflow-hidden shadow border">
                <img src={img} alt={`Image ${idx + 1}`} className="w-full h-auto" />
                {isAdmin && (
                  <button
                    onClick={() => deleteFile(tabId, "images", img)}
                    className="absolute top-2 right-2 text-gray-800 p-1 rounded hover:bg-red-600"
                  >
                    X
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isAdmin && showUploadModal && (
        <UploadModal
          tabId={tabId}
          onClose={() => setShowUploadModal(false)}
          onUploaded={() => window.location.reload()}
        />
      )}
    </div>
  );
};

export default TabDetails;
