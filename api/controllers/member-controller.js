// Import
const prisma = require("../config/prisma-config");
const tryCatch = require("../utils/try-catch");
const createError = require("../utils/create-error");
const bcrypt = require("bcryptjs");

const memberController = {};

// List all members
memberController.listMember = tryCatch(async (req, res) => {

    const page = parseInt(req.query.page) || 1; // Get current page from query, default to 1
    const limit = parseInt(req.query.limit) || 100; // Set limit for number of members per page
    const offset = (page - 1) * limit; // Calculate offset for pagination

    // Fetch the list of members from the database
    const members = await prisma.user.findMany({
        skip: offset,
        take: limit,
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            password: true,
            role: true,
            profileImage: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    // Get total number of members for pagination
    const totalMembers = await prisma.user.count();

    res.json({
        message: "Get all member success",
        members,
        totalMembers,
        totalPages: Math.ceil(totalMembers / limit), // Calculate total pages
        currentPage: page,
    });
});

// Update member details
memberController.updateMember = tryCatch(async (req, res) => {
    const { memberId } = req.params;

    console.log("Updating member:", req.body);

    // 1. Check the existing user before updating
    const user = await prisma.user.findUnique({
        where: { id: Number(memberId) },
    });

    if (!user) {
        return createError(404, "Member not found");
    }

    const { firstName, lastName, email, password, role } = req.body;

    // 2. Prepare data for update
    const updatedData = {
        firstName,
        lastName,
        email,
        role,
    };

    // 3. Check if a new password is provided
    if (password && password.trim() !== "") {
        const hashedPassword = await bcrypt.hash(password, 10);
        updatedData.password = hashedPassword;
    } else {
        console.log("Retaining existing password");
        delete updatedData.password;
    }

    console.log("Updating member with data from member-cont:", updatedData);

    // 4. Update the member's information in the database
    const member = await prisma.user.update({
        where: {
            id: Number(memberId)
        },
        data: updatedData
    });

    res.json({ message: "Update member success", member });
    console.log("Updated member data from member-cont:", member);
});

// Remove a member
memberController.removeMember = tryCatch(async (req, res) => {
    const memberId = req.params.memberId;
    if (!memberId) {
        return createError(400, "Member ID is required");
    }

    await prisma.user.delete({
        where: {
            id: Number(memberId),
        },
    });

    res.json({ message: "Delete member success" });
});

module.exports = memberController;
