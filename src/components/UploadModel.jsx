import { useState } from "react";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db, storage } from "../firebase/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const UploadModal = ({ tabId, onClose, onUploaded }) => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    const fieldMap = {
        pdf: "pdfs",
        image: "images",
        video: "videos",
    };

    const getFileType = (file) => {
        if (file.type.includes("pdf")) return "pdf";
        if (file.type.includes("image")) return "image";
        if (file.type.includes("video")) return "video";
        return null;
    };

    const handleUpload = async () => {
        if (files.length === 0) return alert("Please select at least one file.");

        setLoading(true);
        const docRef = doc(db, "study_materials", tabId);
        const updates = { pdfs: [], images: [], videos: [] };

        try {
            for (const file of files) {
                const fileType = getFileType(file);
                if (!fileType) continue;

                const storageRef = ref(storage, `study_materials/${tabId}/${file.name}`);
                await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(storageRef);
                updates[fieldMap[fileType]].push(downloadURL);
            }

            // Only update fields with new data
            const filteredUpdate = Object.fromEntries(
                Object.entries(updates).filter(([_, value]) => value.length > 0)
            );

            for (const [field, urls] of Object.entries(filteredUpdate)) {
                await updateDoc(docRef, {
                    [field]: arrayUnion(...urls),
                });
            }

            setFiles([]);
            setLoading(false);
            onUploaded();
        } catch (error) {
            console.error("Upload failed:", error);
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm space-y-4">
                <h2 className="text-lg font-semibold">Upload Files</h2>

                <input
                    type="file"
                    multiple
                    onChange={(e) => setFiles(Array.from(e.target.files))}
                    className="w-full"
                />

                <div className="flex justify-end gap-2 mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpload}
                        disabled={loading || files.length === 0}
                        className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
                    >
                        {loading ? "Uploading..." : "Upload"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UploadModal;
