import { useState, useRef, useCallback} from "react";
import { User, Camera, X } from "lucide-react";
import Cropper from "react-easy-crop";
import useAxios from "@/utils/useAxios";
import toast from "react-hot-toast";

const UserImage = ({ userData, setUserData,user_id}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const fileInputRef = useRef(null);
  const axiosInstance = useAxios();

  // Handle file selection
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setShowPopup(true);
    }
  };

  // Capture crop area
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Create cropped image
  const createCroppedImage = async (imageSrc, croppedAreaPixels) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.src = imageSrc;

      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;

        ctx.drawImage(
          image,
          croppedAreaPixels.x,
          croppedAreaPixels.y,
          croppedAreaPixels.width,
          croppedAreaPixels.height,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        );

        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error("Canvas is empty"));
            return;
          }
          const file = new File([blob], "cropped-image.jpg", { type: "image/jpeg" });
          resolve(file);
        }, "image/jpeg");
      };

      image.onerror = (error) => reject(error);
    });
  };

  // Upload the cropped image
  const handleImageUpload = async () => {
    if (!selectedImage) return;

    const croppedImage = await createCroppedImage(selectedImage, croppedAreaPixels);
    const formData = new FormData();
    formData.append("image", croppedImage);

    try {
      await axiosInstance.patch(`api/accounts/profile/${user_id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Profile image updated successfully!");
      setUserData({ ...userData, image: URL.createObjectURL(croppedImage) });
      setShowPopup(false);
    } catch {
      toast.error("Failed to upload image");
    }
  };

  return (
    <div className="relative group">
      {userData.image ? (
        <img
          src={userData.image}
          alt="Profile"
          className="w-40 h-40 rounded-full border-4 border-gray-300 object-cover"
          referrerPolicy="no-referrer"
          />
      ) : (
        <User className="w-40 h-40 rounded-full border-4 border-gray-300 text-gray-400" />
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleImageChange}
      />

      {/* Camera Icon */}
      <div
        className="absolute bottom-2 right-2 bg-gray-700 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition cursor-pointer"
        onClick={() => fileInputRef.current.click()}
      >
        <Camera size={20} />
      </div>

      {/* Image Crop Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Background */}
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>

          {/* Popup Box */}
          <div className="bg-white rounded-lg p-6 shadow-lg z-10 w-96 text-center">
            <button className="absolute top-3 right-3 text-gray-600 hover:text-red-600" onClick={() => setShowPopup(false)}>
              <X size={24} />
            </button>
            <h2 className="text-xl font-bold mb-4">Crop Image</h2>

            {/* Cropping Area */}
            <div className="relative w-full h-64 bg-gray-200">
              <Cropper
                image={selectedImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            {/* Buttons */}
            <div className="mt-4 flex justify-center gap-4">
              <button
                onClick={handleImageUpload}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserImage;
