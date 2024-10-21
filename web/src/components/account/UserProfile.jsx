// Import
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Avatar from "@/components/Avatar";

// Import store
import useAuthStore from "@/stores/authStore";

// Import Icon
import { PhotoIcon } from "@/components/ui/icon";

const UserProfile = () => {
  // State from Stores
  // const user = useAuthStore((state) => state.user);
  // const actionCurrentUser = useAuthStore((state) => state.actionCurrentUser);
  // const actionUpdateUser = useAuthStore((state) => state.actionUpdateUser);
  const { user, actionCurrentUser, actionUpdateUser } = useAuthStore();

  // useState for user profile information
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState("");

  // File size
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  // useState for file size
  const [errorFileSize, setErrorFileSize] = useState("");

  // useEffect for Fetch current user data
  useEffect(() => {
    const getUser = async () => {
      await actionCurrentUser();
    };

    getUser();
  }, [actionCurrentUser]);

  // useEffect for Update local state when user data is fetched
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setProfileImage(user.profileImage); // Assuming profileImage is the correct field
      setProfileImagePreview(user.profileImage);
    }
  }, [user]); // Depend on user

  // Fn for handle avatar file change
  const hdlAvatarChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setErrorFileSize("File size exceeds 10MB limit.");
      return;
    }
    setProfileImage(file);
    setProfileImagePreview(URL.createObjectURL(file)); // Show selected image
    setErrorFileSize("");
  };

  // Fn for handle form submis to update user profile
  const hdlUpdateProfile = async () => {
    const updatedData = new FormData();
    updatedData.append("firstName", firstName);
    updatedData.append("lastName", lastName);
    updatedData.append("email", email);
    if (password) {
      updatedData.append("password", password);
    }
    if (profileImage) {
      updatedData.append("profileImage", profileImage);
    }

    await actionUpdateUser(updatedData); // Call the action to update user profile
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="w-full flex flex-rol gap-4 items-start p-2 rounded-2xl shadow-2xl">
      {/* Avatar */}
      <div className="mx-10">
        <input
          type="file"
          onChange={hdlAvatarChange}
          id="avatar-upload"
          className="hidden"
        />
        <label htmlFor="avatar-upload" className="cursor-pointer">
          <Avatar
            className="w-[150px] h-[150px] rounded-full flex items-center shadow-lg"
            imgSrc={profileImagePreview}
          />
          {/* Use Avatar component for displaying the profile image */}
        </label>
      </div>

      {/* Infomation */}
      <div className="flex flex-col gap-10">
        {/* Intro */}
        <div className="my-8">
          <p className="font-bold text-2xl">Profile</p>
          <p>Update your profile photo and personal details</p>
        </div>

        {/* Personal Details */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-row items-center gap-2">
            <p className="w-[90px] font-semibold">First Name:</p>
            <input
              className="input input-bordered w-80 h-[47.99px] bg-slate-50 border-slate-200 placeholder:text-slate-900"
              type="text"
              value={firstName}
              placeholder="Firstname"
              onChange={(e) => setFirstName(e.target.value)} // Update first name
            />
          </div>
          <div className="flex flex-row items-center gap-2">
            <p className="w-[90px] font-semibold">Last Name:</p>
            <input
              className="input input-bordered w-80 h-[47.99px] bg-slate-50 border-slate-200 placeholder:text-slate-900"
              type="text"
              value={lastName}
              placeholder="Lastname"
              onChange={(e) => setLastName(e.target.value)} // Update last name
            />
          </div>
          <div className="flex flex-row items-center gap-2">
            <p className="w-[90px] font-semibold">Email:</p>
            <input
              className="input input-bordered w-80 h-[47.99px] bg-slate-50 border-slate-200 placeholder:text-slate-900"
              type="email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)} // Update email
            />
          </div>
          <div className="flex flex-row items-center gap-2">
            <p className="w-[90px] font-semibold">Password:</p>
            <input
              className="input input-bordered w-80 h-[47.99px] bg-slate-50 border-slate-200 placeholder:text-slate-900"
              type="password"
              value={password}
              placeholder="********"
              onChange={(e) => setPassword(e.target.value)} // Update password
            />
          </div>
          <div>
            <div className="flex flex-row items-center gap-2">
              <p className="w-[100px] font-semibold">Avatar:</p>
              <input
                className="hidden"
                type="file"
                onChange={hdlAvatarChange}
                id="avatar-upload"
              />
              <label
                htmlFor="avatar-upload"
                className="cursor-pointer flex items-center justify-center w-10 h-10 bg-slate-900 rounded-full"
              >
                {/* Show PhotoIcon instead of the file input */}
                <PhotoIcon className="w-6 h-6" />
              </label>
            </div>
            {errorFileSize && (
              <p className="text-red-500 text-sm mt-1 pl-[90px]">
                {errorFileSize}
              </p>
            )}
          </div>
        </div>

        {/* Update Profile */}
        <button
          onClick={hdlUpdateProfile}
          className="btn bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full border-none mt-4 text-base mb-8"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
