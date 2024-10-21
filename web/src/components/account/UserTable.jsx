// Import
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Avatar from "@/components/Avatar";

//Import Store
import useMemberStore from "@/stores/memberStore";

const UserTable = () => {
    // State from Stores
    const {
        members,
        loading,
        error,
        totalMembers,
        actionGetMembers,
        actionUpdateMember,
        actionDeleteMember,
    } = useMemberStore();

    // State from pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [membersPerPage] = useState(5);
    const totalPages = Math.ceil(totalMembers / membersPerPage) || 1

    // State from select member
    const [selectedMember, setSelectedMember] = useState(null);

    // State from edit member
    const [isEditing, setIsEditing] = useState(false);

    // State from delete member
    const [isConfirmDelete, setIsConfirmDelete] = useState(false);

    // // useEffect for Fetch members
    // useEffect(() => {
    //     actionGetMembers();
    // }, [actionGetMembers]);

    // useEffect for Fetch members and page changes
    useEffect(() => {
        const getMembers = async () => {
            await actionGetMembers(currentPage, membersPerPage); // Fetch members based on current page
        };
        getMembers();
    }, [actionGetMembers, currentPage]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error.message || "An error occurred."}</p>;

    // Fn for handle the edit button click
    const hdlEditClick = (member) => {
        setSelectedMember(member); // Set the selected member to the state
        setIsEditing(true); // Enable editing mode
    };

    // Fn for close the modal after editing
    const hdlCloseModal = () => {
        setIsEditing(false); // Disable editing mode
        setSelectedMember(null); // Clear the selected member
        setIsConfirmDelete(false); // Close delete confirmation modal
    };

    // Fn for handle the update of member information
    const hdlUpdate = async (e) => {
        e.preventDefault();

        console.log("Selected member data:", selectedMember);

        const { id, firstName, lastName, email, password, role } = selectedMember;

        console.log("Current password in selectedMember:", password);

        // Prepare updated data
        const updatedData = {};
        updatedData.firstName = firstName;
        updatedData.lastName = lastName;
        updatedData.email = email;
        updatedData.role = role;

        if (password && password.trim() !== "") {
            updatedData.password = password;
        }

        // Log the updated data before sending
        console.log("Updating member data from userTable:", updatedData);

        await actionUpdateMember(id, updatedData); // Update the member using the store action
        toast.success("Member updated successfully!");
        hdlCloseModal();
    };


    // Fn for handle member delete
    const hdlDelete = (member) => {
        setSelectedMember(member); // Set the member to be deleted
        setIsConfirmDelete(true); // Open the confirmation modal
    };

    // Fn for confirm member delete
    const confirmDelete = async () => {
        if (selectedMember && selectedMember.id) {
            await actionDeleteMember(selectedMember.id);
            toast.success("Member deleted successfully!");
            hdlCloseModal();
        } else {
            toast.error("Failed to delete member: Member ID is missing.");
        }
    };

    // Fn for pagination
    const hdlPageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <div className="overflow-x-auto">
            <div className="flex flex-col item-conter">
                <table className="table w-full">
                    {/* Head of the table */}
                    <thead>
                        <tr className="text-sm text-slate-900">
                            <th>Profile</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Password</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.slice((currentPage - 1) * membersPerPage, currentPage * membersPerPage).map((member) => (
                            <tr key={member.id}>
                                <td>
                                    <Avatar imgSrc={member.profileImage} className="mask mask-squircle h-12 w-12" />
                                </td>
                                <td>{member.firstName}</td>
                                <td>{member.lastName}</td>
                                <td>{member.email}</td>
                                <td>{member.password ? "******" : ""}</td>
                                <td>{member.role}</td>
                                <td>
                                    <button className="btn btn-ghost btn-xs" onClick={() => hdlEditClick(member)}>Edit</button>
                                    <button className="btn btn-ghost btn-xs" onClick={() => hdlDelete(member)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="join justify-center">
                    <button className="join-item btn btn-sm" disabled={currentPage === 1} onClick={() => hdlPageChange(currentPage - 1)}>«</button>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index + 1}
                            className={`join-item btn btn-sm ${currentPage === index + 1 ? "btn-active" : ""}`}
                            onClick={() => hdlPageChange(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}
                    <button className="join-item btn btn-sm" disabled={currentPage === totalPages} onClick={() => hdlPageChange(currentPage + 1)}>»</button>
                </div>
            </div>

            {/* Modal for Editing Member */}
            {isEditing && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h2 className="font-bold text-xl">Edit Member</h2>
                        <form onSubmit={hdlUpdate}>
                            <div className="form-control flex flex-col gap-2">
                                <Avatar
                                    imgSrc={selectedMember.profileImage}
                                    className="mask mask-squircle h-16 w-16"
                                />
                            </div>
                            <div className="form-control">
                                <label className="label font-semibold">First Name </label>
                                <input
                                    type="text"
                                    value={selectedMember.firstName}
                                    onChange={(e) =>
                                        setSelectedMember({
                                            ...selectedMember,
                                            firstName: e.target.value,
                                        })
                                    } // Update first name
                                    className="input input-bordered"
                                />
                            </div>
                            <div className="form-control">
                                <label className="label font-semibold">Last Name</label>
                                <input
                                    type="text"
                                    value={selectedMember.lastName}
                                    onChange={(e) =>
                                        setSelectedMember({
                                            ...selectedMember,
                                            lastName: e.target.value,
                                        })
                                    } // Update last name
                                    className="input input-bordered"
                                />
                            </div>
                            <div className="form-control">
                                <label className="label font-semibold">Email</label>
                                <input
                                    type="email"
                                    value={selectedMember.email}
                                    onChange={(e) =>
                                        setSelectedMember({
                                            ...selectedMember,
                                            email: e.target.value,
                                        })
                                    } // Update email
                                    className="input input-bordered"
                                />
                            </div>
                            <div className="form-control">
                                <label className="label font-semibold">Password</label>
                                <input
                                    type="password"
                                    placeholder="********"
                                    onChange={(e) =>
                                        setSelectedMember({
                                            ...selectedMember,
                                            password: e.target.value,
                                        })
                                    } // Update password
                                    className="input input-bordered"
                                />
                            </div>
                            <div className="form-control">
                                <label className="label font-semibold">Role</label>
                                <select
                                    value={selectedMember.role}
                                    onChange={(e) =>
                                        setSelectedMember({
                                            ...selectedMember,
                                            role: e.target.value,
                                        })
                                    } // Update role
                                    className="select select-bordered w-full max-w-xs"
                                >
                                    <option value="ADMIN">Admin</option>
                                    <option value="USER">User</option>
                                </select>
                            </div>
                            <div className="modal-action">
                                <button
                                    type="submit"
                                    className="btn bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                                >
                                    Save
                                </button>
                                <button type="button" className="btn" onClick={hdlCloseModal}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirmation Modal for Deletion */}
            {isConfirmDelete && (
                <div className="modal modal-open">
                    <div className="modal-box">
                        <h2 className="font-bold text-lg">Confirm Deletion</h2>
                        <p className="py-4">
                            {" "}
                            Are you sure you want to delete this member?
                        </p>
                        <div className="modal-action">
                            <button
                                className="btn bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                                onClick={confirmDelete}
                            >
                                Yes, Delete
                            </button>
                            <button className="btn" onClick={hdlCloseModal}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserTable;
